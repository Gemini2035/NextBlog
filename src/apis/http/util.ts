import axios, { type AxiosRequestConfig } from 'axios'
import type { ApiResponse, HttpError } from './core'

type SerializedValue =
  | string
  | number
  | boolean
  | null
  | SerializedValue[]
  | { [key: string]: SerializedValue }

export const DEFAULT_ERROR_MESSAGE = '请求失败，请稍后重试'
export const API_BASE_URL = '/api'
export const STALE_REQUEST_CODE = 'STALE_REQUEST'

export class StaleRequestError extends Error {
  code = STALE_REQUEST_CODE

  constructor() {
    super('请求已过时，已丢弃结果')
    this.name = 'StaleRequestError'
  }
}

export const isStaleRequestError = (error: unknown): error is StaleRequestError => {
  return error instanceof StaleRequestError
}

export const isRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === 'object' && value !== null
}

export const getErrorMessage = (data: unknown): string | undefined => {
  if (!isRecord(data)) {
    return undefined
  }

  const message = data.message ?? data.error ?? data.detail
  return typeof message === 'string' && message.trim().length > 0 ? message : undefined
}

export const createHttpError = (error: HttpError): HttpError => {
  return {
    message: error.message || DEFAULT_ERROR_MESSAGE,
    status: error.status,
    code: error.code,
    details: error.details,
  }
}

export const normalizeBaseHttpError = (error: unknown): HttpError => {
  if (isStaleRequestError(error)) {
    return createHttpError({
      message: error.message,
      code: error.code,
      details: error,
    })
  }

  if (isRecord(error) && typeof error.message === 'string') {
    return createHttpError({
      message: error.message,
      status: typeof error.status === 'number' ? error.status : undefined,
      code:
        typeof error.code === 'string' || typeof error.code === 'number'
          ? error.code
          : undefined,
      details: error.details,
    })
  }

  if (error instanceof Error) {
    return createHttpError({
      message: error.message,
    })
  }

  return createHttpError({
    message: DEFAULT_ERROR_MESSAGE,
    details: error,
  })
}

export const normalizeAxiosHttpError = (error: unknown): HttpError => {
  if (axios.isAxiosError(error)) {
    return createHttpError({
      message: getErrorMessage(error.response?.data) ?? error.message ?? DEFAULT_ERROR_MESSAGE,
      status: error.response?.status,
      code: error.code,
      details: error.response?.data,
    })
  }

  return normalizeBaseHttpError(error)
}

export const assertApiResponseOk = <TData>(response: ApiResponse<TData>): ApiResponse<TData> => {
  if (response.code !== 0) {
    throw createHttpError({
      message: response.message || DEFAULT_ERROR_MESSAGE,
      code: response.code,
      details: response,
    })
  }

  return response
}

export const normalizeRequestMethod = (method?: string) => {
  return (method ?? 'GET').toUpperCase()
}

export const getAxiosRequestUrl = <TBody>(
  config: AxiosRequestConfig<TBody>,
  fallbackBaseUrl: string
) => {
  const url = config.url ?? ''

  if (/^https?:\/\//.test(url)) {
    return url
  }

  const baseUrl = config.baseURL ?? fallbackBaseUrl
  return `${String(baseUrl).replace(/\/$/, '')}/${url.replace(/^\//, '')}`
}

export const createRequestDedupeKey = ({
  method,
  url,
  params,
  body,
  headers,
}: {
  method: string
  url: string
  params?: unknown
  body?: unknown
  headers?: unknown
}) => {
  return stableSerialize({
    method,
    url,
    params,
    body,
    headers: normalizeHeaders(headers),
  })
}

export const createRequestVersionKey = ({
  method,
  url,
  headers,
}: {
  method: string
  url: string
  headers?: unknown
}) => {
  return stableSerialize({
    method,
    url: stripUrlParams(url),
    headers: normalizeHeaders(headers),
  })
}

const stripUrlParams = (url: string) => {
  const [withoutHash] = url.split('#')
  const [withoutQuery] = withoutHash.split('?')
  return withoutQuery
}

const normalizeHeaders = (headers: unknown): SerializedValue | undefined => {
  if (!headers) {
    return undefined
  }

  if (typeof Headers !== 'undefined' && headers instanceof Headers) {
    return normalizeHeaderEntries([...headers.entries()])
  }

  if (Array.isArray(headers)) {
    return normalizeHeaderEntries(headers as [string, unknown][])
  }

  if (isRecord(headers)) {
    if (typeof headers.toJSON === 'function') {
      return normalizeHeaders(headers.toJSON())
    }

    return normalizeHeaderEntries(Object.entries(headers))
  }

  return normalizeSerializableValue(headers, new WeakSet())
}

const normalizeHeaderEntries = (entries: [string, unknown][]) => {
  return normalizeEntries(entries, (key) => key.toLowerCase())
}

const normalizeEntries = (entries: [string, unknown][], normalizeKey = (key: string) => key) => {
  return entries
    .filter(([, value]) => value !== undefined && value !== null)
    .sort(([leftKey], [rightKey]) => leftKey.localeCompare(rightKey))
    .reduce<Record<string, SerializedValue>>((headers, [key, value]) => {
      return {
        ...headers,
        [normalizeKey(key)]: normalizeSerializableValue(value, new WeakSet()),
      }
    }, {})
}

const stableSerialize = (value: unknown) => {
  return JSON.stringify(normalizeSerializableValue(value, new WeakSet()))
}

const normalizeSerializableValue = (value: unknown, seen: WeakSet<object>): SerializedValue => {
  if (value === undefined || value === null) {
    return null
  }

  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
    return value
  }

  if (typeof value === 'bigint') {
    return value.toString()
  }

  if (value instanceof Date) {
    return value.toISOString()
  }

  if (typeof URLSearchParams !== 'undefined' && value instanceof URLSearchParams) {
    return normalizeEntries([...value.entries()])
  }

  if (typeof FormData !== 'undefined' && value instanceof FormData) {
    return normalizeEntries([...value.entries()])
  }

  if (typeof Blob !== 'undefined' && value instanceof Blob) {
    return {
      size: value.size,
      type: value.type,
    }
  }

  if (Array.isArray(value)) {
    return value.map((item) => normalizeSerializableValue(item, seen))
  }

  if (typeof value === 'object') {
    if (seen.has(value)) {
      return '[Circular]'
    }

    seen.add(value)

    return Object.keys(value as Record<string, unknown>)
      .sort()
      .reduce<Record<string, SerializedValue>>((serializedValue, key) => {
        const item = (value as Record<string, unknown>)[key]

        if (item === undefined) {
          return serializedValue
        }

        return {
          ...serializedValue,
          [key]: normalizeSerializableValue(item, seen),
        }
      }, {})
  }

  return String(value)
}
