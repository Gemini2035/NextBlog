/**
 * 通用HTTP请求框架
 * 跨项目可复用的axios封装
 */

import axios, { 
  AxiosInstance, 
  AxiosRequestConfig,
  AxiosResponse as AxiosResponseType,
  AxiosError as AxiosErrorType,
  InternalAxiosRequestConfig, 
} from 'axios'

// 重新导出为统一的类型名称
export type HttpAxiosResponse = AxiosResponseType
export type HttpAxiosError = AxiosErrorType

/**
 * 请求配置接口
 */
export interface HttpConfig extends AxiosRequestConfig {
  skipErrorHandler?: boolean // 跳过全局错误处理
  retry?: number // 重试次数
  retryDelay?: number // 重试延迟（毫秒）
}

/**
 * 响应数据接口
 */
export interface HttpResponse<T = Record<string, unknown>> {
  data: T
  status: number
  statusText: string
  headers: Record<string, string | string[]>
}

/**
 * 错误响应接口
 */
export interface HttpError {
  message: string
  status?: number
  code?: string
  response?: Record<string, unknown>
}

/**
 * 请求拦截器类型
 */
export type RequestInterceptor = (
  config: InternalAxiosRequestConfig
) => InternalAxiosRequestConfig | Promise<InternalAxiosRequestConfig>

/**
 * 响应拦截器类型
 */
export type ResponseInterceptor = (response: AxiosResponseType) => AxiosResponseType | Promise<AxiosResponseType>

/**
 * 错误拦截器类型
 */
export type ErrorInterceptor = (error: AxiosErrorType) => Promise<AxiosErrorType>

/**
 * HTTP客户端类
 */
export class HttpClient {
  private instance: AxiosInstance
  private requestInterceptors: RequestInterceptor[] = []
  private responseInterceptors: ResponseInterceptor[] = []
  private errorInterceptors: ErrorInterceptor[] = []

  constructor(config?: AxiosRequestConfig) {
    this.instance = axios.create({
      timeout: 30000,
      ...config,
    })

    this.setupInterceptors()
  }

  /**
   * 设置拦截器
   */
  private setupInterceptors() {
    // 请求拦截器
    this.instance.interceptors.request.use(
      async (config) => {
        // 执行所有注册的请求拦截器
        for (const interceptor of this.requestInterceptors) {
          config = await interceptor(config)
        }
        return config
      },
      (error) => Promise.reject(error)
    )

    // 响应拦截器
    this.instance.interceptors.response.use(
      async (response) => {
        // 执行所有注册的响应拦截器
        for (const interceptor of this.responseInterceptors) {
          response = await interceptor(response)
        }
        return response
      },
      async (error: HttpAxiosError) => {
        // 执行所有注册的错误拦截器
        for (const interceptor of this.errorInterceptors) {
          error = await interceptor(error)
        }
        return Promise.reject(error)
      }
    )
  }

  /**
   * 添加请求拦截器
   */
  public addRequestInterceptor(interceptor: RequestInterceptor) {
    this.requestInterceptors.push(interceptor)
  }

  /**
   * 添加响应拦截器
   */
  public addResponseInterceptor(interceptor: ResponseInterceptor) {
    this.responseInterceptors.push(interceptor)
  }

  /**
   * 添加错误拦截器
   */
  public addErrorInterceptor(interceptor: ErrorInterceptor) {
    this.errorInterceptors.push(interceptor)
  }

  /**
   * GET请求
   */
  public async get<T = Record<string, unknown>>(url: string, config?: HttpConfig): Promise<HttpResponse<T>> {
    return this.request<T>({ ...config, method: 'GET', url })
  }

  /**
   * POST请求
   */
  public async post<T = Record<string, unknown>, D = Record<string, unknown>>(
    url: string, 
    data?: D, 
    config?: HttpConfig
  ): Promise<HttpResponse<T>> {
    return this.request<T>({ ...config, method: 'POST', url, data })
  }

  /**
   * PUT请求
   */
  public async put<T = Record<string, unknown>, D = Record<string, unknown>>(
    url: string, 
    data?: D, 
    config?: HttpConfig
  ): Promise<HttpResponse<T>> {
    return this.request<T>({ ...config, method: 'PUT', url, data })
  }

  /**
   * DELETE请求
   */
  public async delete<T = Record<string, unknown>>(url: string, config?: HttpConfig): Promise<HttpResponse<T>> {
    return this.request<T>({ ...config, method: 'DELETE', url })
  }

  /**
   * PATCH请求
   */
  public async patch<T = Record<string, unknown>, D = Record<string, unknown>>(
    url: string, 
    data?: D, 
    config?: HttpConfig
  ): Promise<HttpResponse<T>> {
    return this.request<T>({ ...config, method: 'PATCH', url, data })
  }

  /**
   * 通用请求方法（支持重试）
   */
  public async request<T = Record<string, unknown>>(config: HttpConfig): Promise<HttpResponse<T>> {
    const { retry = 0, retryDelay = 1000, ...axiosConfig } = config

    let lastError: Error | AxiosErrorType = new Error('Unknown error')

    for (let attempt = 0; attempt <= retry; attempt++) {
      try {
        const response = await this.instance.request<T>(axiosConfig)
        return {
          data: response.data,
          status: response.status,
          statusText: response.statusText,
          headers: response.headers as Record<string, string | string[]>,
        }
      } catch (error) {
        const typedError = error instanceof Error ? error : new Error('Unknown error')
        lastError = typedError

        // 如果还有重试机会且是网络错误，则重试
        if (attempt < retry && this.isRetryableError(typedError)) {
          await this.delay(retryDelay)
          continue
        }

        // 处理错误
        throw this.handleError(typedError)
      }
    }

    throw this.handleError(lastError)
  }

  /**
   * 判断是否为可重试的错误
   */
  private isRetryableError(error: Error | AxiosErrorType): boolean {
    if (!axios.isAxiosError(error)) {
      return true // 非Axios错误，可能是网络错误，可重试
    }

    const status = error.response?.status
    if (!status) {
      return true // 无响应状态，网络错误，可重试
    }

    // 5xx服务器错误和429限流错误可重试
    return status >= 500 || status === 429
  }

  /**
   * 延迟函数
   */
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  /**
   * 错误处理
   */
  private handleError(error: Error | AxiosErrorType): HttpError {
    if (axios.isAxiosError(error)) {
      const responseData = error.response?.data
      const response: Record<string, unknown> | undefined = 
        responseData && typeof responseData === 'object' 
          ? responseData as Record<string, unknown>
          : undefined

      return {
        message: error.message,
        status: error.response?.status,
        code: error.code,
        response,
      }
    }

    return {
      message: error.message,
    }
  }

  /**
   * 获取原始axios实例（用于高级操作）
   */
  public getAxiosInstance(): AxiosInstance {
    return this.instance
  }
}

/**
 * 创建HTTP客户端实例
 */
export function createHttpClient(config?: AxiosRequestConfig): HttpClient {
  return new HttpClient(config)
}

/**
 * 默认HTTP客户端实例
 */
export const httpClient = createHttpClient()

