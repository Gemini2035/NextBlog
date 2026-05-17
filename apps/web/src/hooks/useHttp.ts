'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import type { AxiosRequestConfig } from 'axios'
import { httpRequest, normalizeHttpError, type ApiResponse, type HttpError } from '@/apis/http'

export interface UseHttpOptions<TData, TBody = unknown> {
  config?: AxiosRequestConfig<TBody>
  immediate?: boolean
  onSuccess?: (response: ApiResponse<TData>) => void
  onError?: (error: HttpError) => void
}

export interface UseHttpResult<TData, TBody = unknown> {
  loading: boolean
  data: TData | null
  response: ApiResponse<TData> | null
  error: HttpError | null
  execute: (config?: AxiosRequestConfig<TBody>) => Promise<ApiResponse<TData>>
  reset: () => void
}

export function useHttp<TData = unknown, TBody = unknown>(
  options: UseHttpOptions<TData, TBody> = {}
): UseHttpResult<TData, TBody> {
  const { config, immediate = false, onSuccess, onError } = options
  const [loading, setLoading] = useState(false)
  const [response, setResponse] = useState<ApiResponse<TData> | null>(null)
  const [error, setError] = useState<HttpError | null>(null)
  const requestIdRef = useRef(0)
  const configRef = useRef(config)
  const onSuccessRef = useRef(onSuccess)
  const onErrorRef = useRef(onError)

  useEffect(() => {
    configRef.current = config
    onSuccessRef.current = onSuccess
    onErrorRef.current = onError
  }, [config, onError, onSuccess])

  const reset = useCallback(() => {
    setLoading(false)
    setResponse(null)
    setError(null)
  }, [])

  const execute = useCallback(
    async (overrideConfig?: AxiosRequestConfig<TBody>) => {
      const baseConfig = configRef.current
      const requestId = requestIdRef.current + 1
      requestIdRef.current = requestId
      setLoading(true)
      setError(null)

      try {
        const result = await httpRequest<TData, TBody>({
          ...baseConfig,
          ...overrideConfig,
          headers: {
            ...baseConfig?.headers,
            ...overrideConfig?.headers,
          },
        })

        if (requestIdRef.current === requestId) {
          setResponse(result)
        }

        onSuccessRef.current?.(result)
        return result
      } catch (requestError) {
        const normalizedError = normalizeHttpError(requestError)

        if (requestIdRef.current === requestId) {
          setError(normalizedError)
        }

        onErrorRef.current?.(normalizedError)
        throw normalizedError
      } finally {
        if (requestIdRef.current === requestId) {
          setLoading(false)
        }
      }
    },
    []
  )

  useEffect(() => {
    if (!immediate) {
      return
    }

    void execute()
  }, [execute, immediate])

  return {
    loading,
    data: response?.data ?? null,
    response,
    error,
    execute,
    reset,
  }
}
