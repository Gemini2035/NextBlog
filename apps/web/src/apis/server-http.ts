import 'server-only'

import type { ApiResponse } from '@/types/api'

export interface ServerHttpError {
  message: string
  status?: number
  code?: number
  details?: unknown
}

export interface ServerHttpRequestOptions<TBody = unknown>
  extends Omit<RequestInit, 'body' | 'method'> {
  method?: 'GET' | 'POST'
  params?: Record<string, unknown>
  body?: TBody
}

const DEFAULT_ERROR_MESSAGE = '请求失败，请稍后重试'

const getConfiguredApiBaseUrl = () => {
  const baseUrl = process.env.API_BASE_URL ?? process.env.NEXT_PUBLIC_API_BASE_URL ?? '/api'

  if (/^https?:\/\//.test(baseUrl)) {
    return baseUrl.replace(/\/$/, '')
  }

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ??
    process.env.VERCEL_PROJECT_PRODUCTION_URL ??
    process.env.VERCEL_URL

  if (siteUrl) {
    const normalizedSiteUrl = siteUrl.startsWith('http') ? siteUrl : `https://${siteUrl}`
    return `${normalizedSiteUrl.replace(/\/$/, '')}/${baseUrl.replace(/^\//, '').replace(/\/$/, '')}`
  }

  return baseUrl.replace(/\/$/, '')
}

const appendParams = (url: string, params?: Record<string, unknown>) => {
  if (!params) {
    return url
  }

  const searchParams = new URLSearchParams()

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null) {
      return
    }

    if (Array.isArray(value)) {
      value.forEach((item) => {
        if (item !== undefined && item !== null) {
          searchParams.append(key, String(item))
        }
      })
      return
    }

    searchParams.set(key, String(value))
  })

  const queryString = searchParams.toString()
  return queryString ? `${url}${url.includes('?') ? '&' : '?'}${queryString}` : url
}

const resolveUrl = (url: string, params?: Record<string, unknown>) => {
  const baseUrl = getConfiguredApiBaseUrl()
  const requestUrl = /^https?:\/\//.test(url)
    ? url
    : `${baseUrl}${url.startsWith('/') ? url : `/${url}`}`

  return appendParams(requestUrl, params)
}

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === 'object' && value !== null
}

const getErrorMessage = (data: unknown) => {
  if (!isRecord(data)) {
    return undefined
  }

  const message = data.message ?? data.error ?? data.detail
  return typeof message === 'string' && message.trim().length > 0 ? message : undefined
}

export const normalizeServerHttpError = (error: unknown): ServerHttpError => {
  if (isRecord(error) && typeof error.message === 'string') {
    return {
      message: error.message,
      status: typeof error.status === 'number' ? error.status : undefined,
      code: typeof error.code === 'number' ? error.code : undefined,
      details: error.details,
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

export async function serverHttpRequest<TData = unknown, TBody = unknown>(
  url: string,
  options: ServerHttpRequestOptions<TBody> = {}
): Promise<ApiResponse<TData>> {
  const { params, body, headers, method = body === undefined ? 'GET' : 'POST', ...init } = options
  const response = await fetch(resolveUrl(url, params), {
    ...init,
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  })

  const contentType = response.headers.get('content-type') ?? ''
  const data = contentType.includes('application/json') ? await response.json() : await response.text()

  if (!response.ok) {
    throw {
      message: getErrorMessage(data) ?? `服务端请求失败，状态码：${response.status}`,
      status: response.status,
      details: data,
    } satisfies ServerHttpError
  }

  const json = data as ApiResponse<TData>

  if (json.code !== 0) {
    throw {
      message: json.message || DEFAULT_ERROR_MESSAGE,
      code: json.code,
      details: json,
    } satisfies ServerHttpError
  }

  return json
}

export async function serverHttpData<TData = unknown, TBody = unknown>(
  url: string,
  options?: ServerHttpRequestOptions<TBody>
): Promise<TData> {
  const response = await serverHttpRequest<TData, TBody>(url, options)
  return response.data
}

export const getServerApiBaseUrl = () => {
  return getConfiguredApiBaseUrl()
}
