import { httpRequest } from '@/apis/http'
import type { RecommendedContent, SearchResultsGroup } from '@/types/search'

export interface SearchSiteParams {
  query?: string
  limit?: number
  siteLanguage?: string
}

export interface SearchSitePayload {
  mode: 'recommend' | 'search'
  items: RecommendedContent['items']
  groups: SearchResultsGroup[]
}

export interface SearchSiteOptions {
  signal?: AbortSignal
}

export const searchSite = (params?: SearchSiteParams, options?: SearchSiteOptions) => {
  const { siteLanguage, ...queryParams } = params ?? {}

  return httpRequest<SearchSitePayload>({
    url: '/search',
    method: 'GET',
    params: queryParams,
    signal: options?.signal,
    headers: siteLanguage ? { 'X-Locale': siteLanguage } : undefined,
  })
}
