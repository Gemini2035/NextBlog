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

export const searchSite = (params?: SearchSiteParams) => {
  const { siteLanguage, ...queryParams } = params ?? {}

  return httpRequest<SearchSitePayload>({
    url: '/search',
    method: 'GET',
    params: queryParams,
    headers: siteLanguage ? { 'X-Locale': siteLanguage } : undefined,
  })
}
