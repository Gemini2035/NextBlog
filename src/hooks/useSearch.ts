import { useState, useEffect, useMemo } from 'react'
import { useDebounce } from 'use-debounce'
import { search, getRecommendedContent, SearchResultsGroup, RecommendedContent } from '@/components/Header/FullscreenDropdown/SearchDropdown/searchService'

interface UseSearchOptions {
  debounceMs?: number
}

interface UseSearchReturn {
  // 搜索状态
  query: string
  setQuery: (query: string) => void
  debouncedQuery: string
  isSearching: boolean
  
  // 搜索结果
  searchResults: SearchResultsGroup[]
  hasResults: boolean
  
  // 推荐内容
  recommendedContent: RecommendedContent
  
  // 当前显示的内容
  isShowingRecommendations: boolean
  currentContent: SearchResultsGroup[] | RecommendedContent
  
  // 清空搜索
  clearSearch: () => void
}

export function useSearch(options: UseSearchOptions = {}): UseSearchReturn {
  const { debounceMs = 300 } = options
  
  // 搜索状态
  const [query, setQuery] = useState('')
  const [debouncedQuery] = useDebounce(query, debounceMs)
  const [isSearching, setIsSearching] = useState(false)
  
  // 搜索结果和推荐内容
  const [searchResults, setSearchResults] = useState<SearchResultsGroup[]>([])
  const [recommendedContent, setRecommendedContent] = useState<RecommendedContent>({
    featuredPosts: [],
    recentPosts: [],
    navigationLinks: []
  })

  // 执行搜索
  useEffect(() => {
    const performSearch = async () => {
      if (!debouncedQuery.trim()) {
        setSearchResults([])
        setIsSearching(false)
        return
      }

      setIsSearching(true)
      
      try {
        // 模拟异步搜索（实际是同步的，但保持一致性）
        await new Promise(resolve => setTimeout(resolve, 100))
        const results = search(debouncedQuery)
        setSearchResults(results)
      } catch (error) {
        console.error('Search error:', error)
        setSearchResults([])
      } finally {
        setIsSearching(false)
      }
    }

    performSearch()
  }, [debouncedQuery])

  // 加载推荐内容
  useEffect(() => {
    const loadRecommendedContent = () => {
      try {
        const content = getRecommendedContent()
        setRecommendedContent(content)
      } catch (error) {
        console.error('Failed to load recommended content:', error)
      }
    }

    loadRecommendedContent()
  }, [])

  // 计算当前显示的内容
  const currentContent = useMemo(() => {
    if (debouncedQuery.trim()) {
      return searchResults
    }
    return recommendedContent
  }, [debouncedQuery, searchResults, recommendedContent])

  // 是否显示推荐内容
  const isShowingRecommendations = !debouncedQuery.trim()

  // 是否有搜索结果
  const hasResults = searchResults.length > 0

  // 清空搜索
  const clearSearch = () => {
    setQuery('')
    setSearchResults([])
  }

  return {
    // 搜索状态
    query,
    setQuery,
    debouncedQuery,
    isSearching,
    
    // 搜索结果
    searchResults,
    hasResults,
    
    // 推荐内容
    recommendedContent,
    
    // 当前显示的内容
    isShowingRecommendations,
    currentContent,
    
    // 清空搜索
    clearSearch
  }
}
