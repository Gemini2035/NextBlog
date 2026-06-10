import {
  appendRequestParams,
  assertApiResponseOk,
  createHttpError,
  createRequestDedupeKey,
  createRequestVersionKey,
  getErrorMessage,
  getFetchRequestUrl,
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

export type HttpRequestConfig<TBody = unknown> = Omit<RequestInit, 'body' | 'method'> &
  HttpLifecycleOptions & {
    baseURL?: string
    url: string
    method?: string
    params?: unknown
    data?: TBody
    body?: BodyInit | null
  }

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

type MaybePromise<T> = T | Promise<T>

interface CreateHttpRequesterOptions {
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
  getBaseUrl,
  defaultDiscardStale,
}: CreateHttpRequesterOptions): HttpRequester => {
  return async <TData = unknown, TBody = unknown>(config: HttpRequestConfig<TBody>) => {
    const baseUrl = await getBaseUrl()
    const requestConfig: HttpRequestConfig<TBody> = {
      ...config,
      baseURL: config.baseURL ?? baseUrl,
    }

    return requestApiWithFetch<TData, TBody>({
      config: requestConfig,
      defaultDiscardStale,
      resolveRequestUrl: (requestConfig) => getFetchRequestUrl(requestConfig, baseUrl),
    })
  }
}

export const requestApiWithFetch = <TData = unknown, TBody = unknown>({
  config,
  defaultDiscardStale = true,
  resolveRequestUrl,
}: {
  config: HttpRequestConfig<TBody>
  defaultDiscardStale?: boolean
  resolveRequestUrl: (config: HttpRequestConfig<TBody>) => string
}): Promise<ApiResponse<TData>> => {
  const {
    dedupe = true,
    discardStale = defaultDiscardStale,
    baseURL: _baseURL,
    url: _url,
    params,
    data,
    headers,
    body,
    method: rawMethod,
    ...fetchConfig
  } = config
  void _baseURL
  void _url
  const method = normalizeRequestMethod(rawMethod ?? (data === undefined ? 'GET' : 'POST'))
  const requestUrl = appendRequestParams(resolveRequestUrl(config), params)
  const requestHeaders = new Headers(headers)
  let requestBody: BodyInit | null | undefined = body

  if (data !== undefined) {
    if (
      typeof FormData !== 'undefined' && data instanceof FormData ||
      typeof Blob !== 'undefined' && data instanceof Blob ||
      typeof URLSearchParams !== 'undefined' && data instanceof URLSearchParams
    ) {
      requestBody = data
    } else if (typeof data === 'string') {
      requestBody = data
    } else {
      requestHeaders.set('Content-Type', requestHeaders.get('Content-Type') ?? 'application/json')
      requestBody = JSON.stringify(data)
    }
  }

  return runManagedHttpRequest({
    method,
    url: requestUrl,
    params,
    body: data,
    headers,
    dedupe,
    discardStale,
    request: async () => {
      const response = await fetch(requestUrl, {
        ...fetchConfig,
        method,
        headers: requestHeaders,
        body: requestBody,
      })
      const payload = await parseFetchJson(response)

      if (!response.ok) {
        throw createHttpError({
          message: getResponseErrorMessage(payload) ?? response.statusText,
          status: response.status,
          details: payload,
        })
      }

      return assertApiResponseOk(payload as ApiResponse<TData>)
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

const parseFetchJson = async (response: Response): Promise<unknown> => {
  const text = await response.text()
  if (!text) {
    return null
  }

  try {
    return JSON.parse(text)
  } catch {
    return text
  }
}

const getResponseErrorMessage = (payload: unknown) => {
  return getErrorMessage(payload)
}

const nextRequestVersion = (versionKey: string) => {
  const version = (requestVersions.get(versionKey) ?? 0) + 1
  requestVersions.set(versionKey, version)
  return version
}
