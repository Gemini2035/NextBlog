import axios, { AxiosError, type AxiosRequestConfig } from 'axios'

export interface ApiResponse<TData = unknown> {
  code: number
  message: string
  data: TData
  success?: boolean
}

export interface HttpError {
  message: string
  status?: number
  code?: string
  details?: unknown
}

const DEFAULT_ERROR_MESSAGE = '请求失败，请稍后重试'

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === 'object' && value !== null
}

const getErrorMessage = (data: unknown): string | undefined => {
  if (!isRecord(data)) {
    return undefined
  }

  const message = data.message ?? data.error ?? data.detail
  return typeof message === 'string' && message.trim().length > 0 ? message : undefined
}

export const normalizeHttpError = (error: unknown): HttpError => {
  if (error instanceof AxiosError) {
    return {
      message: getErrorMessage(error.response?.data) ?? error.message ?? DEFAULT_ERROR_MESSAGE,
      status: error.response?.status,
      code: error.code,
      details: error.response?.data,
    }
  }

  if (error instanceof Error) {
    return {
      message: error.message || DEFAULT_ERROR_MESSAGE,
    }
  }

  return {
    message: DEFAULT_ERROR_MESSAGE,
    details: error,
  }
}

export const http = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL ?? '',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
})

http.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(normalizeHttpError(error))
)

export async function httpRequest<TData = unknown, TBody = unknown>(
  config: AxiosRequestConfig<TBody>
): Promise<ApiResponse<TData>> {
  const response = await http.request<ApiResponse<TData>>(config)
  return response.data
}

export default http
