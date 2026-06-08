import axios from 'axios'
import { createHttpRequester, type ApiResponse, type HttpError, type HttpRequestConfig } from './core'
import { API_BASE_URL, normalizeAxiosHttpError } from './util'

export type { ApiResponse, HttpError, HttpRequestConfig } from './core'
export { isStaleRequestError } from './util'

const getConfiguredApiBaseUrl = () => {
  return API_BASE_URL
}

export const normalizeHttpError = (error: unknown): HttpError => {
  return normalizeAxiosHttpError(error)
}

export const normalizeServerHttpError = (error: unknown): HttpError => {
  return normalizeAxiosHttpError(error)
}

export const http = axios.create({
  baseURL: getConfiguredApiBaseUrl(),
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
})

http.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(normalizeHttpError(error))
)

export const serverHttp = axios.create({
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
})

serverHttp.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(normalizeServerHttpError(error))
)

export const httpRequest = createHttpRequester({
  client: http,
  getBaseUrl: getConfiguredApiBaseUrl,
})

export type ServerHttpError = HttpError

export type ServerHttpRequestConfig<TBody = unknown> = HttpRequestConfig<TBody> & {
  body?: TBody
}

export type ServerHttpRequestOptions<TBody = unknown> = Omit<
  ServerHttpRequestConfig<TBody>,
  'url'
>

const getConfiguredServerApiBaseUrl = async () => {
  const { headers } = await import('next/headers')
  const requestHeaders = await headers()
  const forwardedHost = requestHeaders.get('x-forwarded-host')
  const host = forwardedHost?.split(',')[0]?.trim() ?? requestHeaders.get('host')

  if (!host) {
    return API_BASE_URL
  }

  const forwardedProto = requestHeaders.get('x-forwarded-proto')
  const protocol =
    forwardedProto?.split(',')[0]?.trim() ??
    (host.startsWith('localhost') || host.startsWith('127.0.0.1') ? 'http' : 'https')

  return `${protocol}://${host}${API_BASE_URL}`
}

const serverHttpRequester = createHttpRequester({
  client: serverHttp,
  getBaseUrl: getConfiguredServerApiBaseUrl,
  defaultDiscardStale: false,
})

const normalizeServerHttpConfig = <TBody>({
  body,
  data,
  ...config
}: ServerHttpRequestConfig<TBody>): HttpRequestConfig<TBody> => {
  return {
    ...config,
    data: data !== undefined ? data : body,
  }
}

export const serverHttpRequest = <TData = unknown, TBody = unknown>(
  config: ServerHttpRequestConfig<TBody>
): Promise<ApiResponse<TData>> => {
  return serverHttpRequester<TData, TBody>(normalizeServerHttpConfig(config))
}

export function serverHttpData<TData = unknown, TBody = unknown>(
  config: ServerHttpRequestConfig<TBody>
): Promise<TData>
export function serverHttpData<TData = unknown, TBody = unknown>(
  url: string,
  options?: ServerHttpRequestOptions<TBody>
): Promise<TData>
export async function serverHttpData<TData = unknown, TBody = unknown>(
  configOrUrl: string | ServerHttpRequestConfig<TBody>,
  options?: ServerHttpRequestOptions<TBody>
): Promise<TData> {
  const config =
    typeof configOrUrl === 'string'
      ? {
          ...options,
          url: configOrUrl,
        }
      : configOrUrl
  const response = await serverHttpRequest<TData, TBody>(config)
  return response.data
}

export default http

export const getApiBaseUrl = () => {
  return getConfiguredApiBaseUrl()
}

export const getServerApiBaseUrl = async () => {
  return getConfiguredServerApiBaseUrl()
}
