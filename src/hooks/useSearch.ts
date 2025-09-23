import { useState, useEffect, useMemo } from 'react'
import { useDebounce } from 'use-debounce'
import { createSearchService, SearchResultsGroup, RecommendedContent } from '@/components/Header/Search/SearchDropdown/searchService'
import { useLocale } from 'next-intl'
import { usePosts } from './usePosts'

interface UseSearchOptions {
  debounceMs?: number
  getTranslation?: (key: string) => string
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
  const { debounceMs = 300, getTranslation } = options
  const locale = useLocale()
  const posts = usePosts()
  
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
        // 创建语言特定的搜索服务
        const searchService = createSearchService(locale)
        // 模拟异步搜索（实际是同步的，但保持一致性）
        await new Promise(resolve => setTimeout(resolve, 100))
        const results = getTranslation ? searchService.search(debouncedQuery, getTranslation) : []
        setSearchResults(results)
      } catch (error) {
        // 静默处理搜索错误，避免控制台错误
        setSearchResults([])
      } finally {
        setIsSearching(false)
      }
    }

    performSearch()
  }, [debouncedQuery, getTranslation, locale])

  // 加载推荐内容
  useEffect(() => {
    const loadRecommendedContent = () => {
      try {
        // 创建语言特定的搜索服务
        const searchService = createSearchService(locale)
        const featuredPost = posts.getFeaturedPost()
        const recentPosts = posts.getRecentPosts()
        const content = searchService.getRecommendedContent(featuredPost, recentPosts)
        setRecommendedContent(content)
      } catch (error) {
        // 静默处理推荐内容加载错误
      }
    }

    loadRecommendedContent()
  }, [locale, posts])

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
