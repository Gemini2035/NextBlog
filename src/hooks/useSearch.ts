'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { useDebounce } from 'use-debounce'
import { useLocale } from 'next-intl'
import { searchSite } from '@/apis/search'
import { RecommendedContent, SearchResultsGroup } from '@/types/search'

interface UseSearchOptions {
  debounceMs?: number
}

interface UseSearchReturn {
  query: string
  setQuery: (query: string) => void
  debouncedQuery: string
  isSearching: boolean
  searchResults: SearchResultsGroup[]
  hasResults: boolean
  recommendedContent: RecommendedContent
  isShowingRecommendations: boolean
  currentContent: SearchResultsGroup[] | RecommendedContent
  clearSearch: () => void
  refreshRecommendations: () => void
}

export function useSearch(options: UseSearchOptions = {}): UseSearchReturn {
  const { debounceMs = 600 } = options
  const locale = useLocale()
  const [query, setQuery] = useState('')
  const [debouncedQuery] = useDebounce(query, debounceMs)
  const [isSearching, setIsSearching] = useState(false)
  const [searchResults, setSearchResults] = useState<SearchResultsGroup[]>([])
  const [recommendedContent, setRecommendedContent] = useState<RecommendedContent>({ items: [] })

  const loadSearchData = useCallback(async (value: string) => {
    setIsSearching(true)

    try {
      const response = await searchSite({
        query: value.trim() || undefined,
        limit: 3,
        siteLanguage: locale,
      })
      const { data } = response

      if (data.mode === 'recommend') {
        setRecommendedContent({ items: data.items })
        setSearchResults([])
      } else {
        setRecommendedContent({ items: [] })
        setSearchResults(data.groups)
      }
    } catch {
      // Keep the last successful results visible when a duplicate dev request is canceled.
    } finally {
      setIsSearching(false)
    }
  }, [locale])

  const refreshRecommendations = useCallback(() => {
    loadSearchData('')
  }, [loadSearchData])

  useEffect(() => {
    if (!debouncedQuery.trim()) {
      return
    }

    loadSearchData(debouncedQuery)
  }, [debouncedQuery, loadSearchData])

  const currentContent = useMemo(() => {
    if (query.trim()) {
      return searchResults
    }
    return recommendedContent
  }, [query, searchResults, recommendedContent])

  const isShowingRecommendations = !query.trim()
  const hasResults = searchResults.length > 0

  const clearSearch = useCallback(() => {
    setQuery('')
    setSearchResults([])
  }, [])

  return {
    query,
    setQuery,
    debouncedQuery,
    isSearching,
    searchResults,
    hasResults,
    recommendedContent,
    isShowingRecommendations,
    currentContent,
    clearSearch,
    refreshRecommendations,
  }
}
