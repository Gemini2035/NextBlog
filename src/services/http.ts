import axios, { type AxiosInstance } from 'axios'

const DEFAULT_TIMEOUT = 15000

/** 404 回调：收到 404 时调用，可用于打点、降级等 */
export type On404Callback = (url: string, config?: { url?: string; method?: string }) => void

let on404Callback: On404Callback | null = null

/**
 * 设置全局 404 回调（仅保留一个，重复调用会覆盖）
 */
export function setOn404(callback: On404Callback | null): void {
  on404Callback = callback
}

/**
 * 封装 axios 实例，供 services 层统一使用
 * - 统一超时、错误处理
 * - 404 统一处理并触发预留回调
 * - 不设默认 baseURL，调用方传完整 URL 或 path（便于服务端 getApiBaseUrl 等）
 */
export const http: AxiosInstance = axios.create({
  timeout: DEFAULT_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
})

http.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status as number | undefined
    const message =
      error.response?.data?.message ??
      error.response?.data?.error ??
      error.message
    const url =
      typeof error.config?.url === 'string'
        ? error.config.url
        : String(error.config?.url ?? '')

    if (status === 404) {
      try {
        on404Callback?.(url, error.config ? { url: error.config.url, method: error.config.method } : undefined)
      } catch (_) {
        // 回调内部错误不影响主流程
      }
    }

    const err = new Error(status ? `[${status}] ${message}` : message) as Error & {
      status?: number
      is404?: boolean
    }
    err.status = status
    err.is404 = status === 404
    return Promise.reject(err)
  }
)

export default http
