import type { AxiosInstance, AxiosRequestConfig } from 'axios'
import {
  assertApiResponseOk,
  createRequestDedupeKey,
  createRequestVersionKey,
  getAxiosRequestUrl,
  normalizeRequestMethod,
  StaleRequestError,
} from './util'

export interface ApiResponse<TData = unknown> {
  code: number
  message: string
  data: TData
  success?: boolean
}

export interface HttpError {
  message: string
  status?: number
  code?: string | number
  details?: unknown
}

export interface HttpLifecycleOptions {
  dedupe?: boolean
  discardStale?: boolean
}

export type HttpRequestConfig<TBody = unknown> = AxiosRequestConfig<TBody> &
  HttpLifecycleOptions

interface ManagedHttpRequestOptions<TResponse> {
  method?: string
  url: string
  params?: unknown
  body?: unknown
  headers?: unknown
  dedupe?: boolean
  discardStale?: boolean
  request: () => Promise<TResponse>
}

interface ManagedAxiosRequestOptions<TBody> {
  client: AxiosInstance
  config: HttpRequestConfig<TBody>
  defaultDiscardStale?: boolean
  resolveRequestUrl: (config: AxiosRequestConfig<TBody>) => string
}

type MaybePromise<T> = T | Promise<T>

interface CreateHttpRequesterOptions {
  client: AxiosInstance
  getBaseUrl: () => MaybePromise<string>
  defaultDiscardStale?: boolean
}

export type HttpRequester = <TData = unknown, TBody = unknown>(
  config: HttpRequestConfig<TBody>
) => Promise<ApiResponse<TData>>

interface PendingRequestEntry<TResponse> {
  promise: Promise<TResponse>
  version?: number
}

const pendingRequests = new Map<string, PendingRequestEntry<unknown>>()
const requestVersions = new Map<string, number>()

export const createHttpRequester = ({
  client,
  getBaseUrl,
  defaultDiscardStale,
}: CreateHttpRequesterOptions): HttpRequester => {
  return async <TData = unknown, TBody = unknown>(config: HttpRequestConfig<TBody>) => {
    const baseUrl = await getBaseUrl()

    return requestApiWithAxios<TData, TBody>({
      client,
      config,
      defaultDiscardStale,
      resolveRequestUrl: (requestConfig) => getAxiosRequestUrl(requestConfig, baseUrl),
    })
  }
}

export const requestApiWithAxios = <TData = unknown, TBody = unknown>({
  client,
  config,
  defaultDiscardStale = true,
  resolveRequestUrl,
}: ManagedAxiosRequestOptions<TBody>): Promise<ApiResponse<TData>> => {
  const {
    dedupe = true,
    discardStale = defaultDiscardStale,
    ...axiosConfig
  } = config
  const method = normalizeRequestMethod(
    axiosConfig.method ?? (axiosConfig.data === undefined ? 'GET' : 'POST')
  )
  const requestConfig: AxiosRequestConfig<TBody> = {
    ...axiosConfig,
    method,
  }

  return runManagedHttpRequest({
    method,
    url: resolveRequestUrl(requestConfig),
    params: requestConfig.params,
    body: requestConfig.data,
    headers: requestConfig.headers,
    dedupe,
    discardStale,
    request: async () => {
      const response = await client.request<ApiResponse<TData>>(requestConfig)
      return assertApiResponseOk(response.data)
    },
  })
}

export const runManagedHttpRequest = <TResponse>({
  method,
  url,
  params,
  body,
  headers,
  dedupe = true,
  discardStale = true,
  request,
}: ManagedHttpRequestOptions<TResponse>): Promise<TResponse> => {
  const normalizedMethod = normalizeRequestMethod(method)
  const dedupeKey = createRequestDedupeKey({
    method: normalizedMethod,
    url,
    params,
    body,
    headers,
  })
  const versionKey = createRequestVersionKey({
    method: normalizedMethod,
    url,
    headers,
  })
  const pendingEntry = pendingRequests.get(dedupeKey) as
    | PendingRequestEntry<TResponse>
    | undefined

  if (dedupe && pendingEntry) {
    if (discardStale) {
      pendingEntry.version = nextRequestVersion(versionKey)
    }

    return pendingEntry.promise
  }

  const entry: PendingRequestEntry<TResponse> = {
    promise: Promise.resolve(undefined as TResponse),
    version: discardStale ? nextRequestVersion(versionKey) : undefined,
  }
  const assertFreshRequest = () => {
    if (!discardStale || requestVersions.get(versionKey) === entry.version) {
      return
    }

    throw new StaleRequestError()
  }

  entry.promise = request()
    .then((response) => {
      assertFreshRequest()
      return response
    })
    .catch((error) => {
      assertFreshRequest()
      throw error
    })
    .finally(() => {
      if (dedupe && pendingRequests.get(dedupeKey) === entry) {
        pendingRequests.delete(dedupeKey)
      }
    })

  if (dedupe) {
    pendingRequests.set(dedupeKey, entry as PendingRequestEntry<unknown>)
  }

  return entry.promise
}

const nextRequestVersion = (versionKey: string) => {
  const version = (requestVersions.get(versionKey) ?? 0) + 1
  requestVersions.set(versionKey, version)
  return version
}
