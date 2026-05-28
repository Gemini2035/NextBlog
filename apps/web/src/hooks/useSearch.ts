'use client'

import { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import { useDebounce } from 'use-debounce'
import { useTranslations } from 'next-intl'
import { useRecommendedContent, RecommendedContent } from './useRecommendedContent'
import { usePosts } from './usePosts'
import Fuse, { FuseResultMatch, IFuseOptions } from 'fuse.js'
import { SearchableItem, SearchResult, SearchResultsGroup } from '@/types/search'
import { useSiteData } from '@/components/SiteDataProvider'
import type { SiteNavigationItem } from '@/types/site'

interface UseSearchOptions {
  debounceMs?: number
}

interface UseSearchReturn {
  // 搜索状态
  query: string
  setQuery: (query: string) => void
  debouncedQuery: string
  isSearching: boolean
  suspensePromise: Promise<void> | null
  
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
  const [searchResults, setSearchResults] = useState<SearchResultsGroup[]>([])
  const [suspensePromise, setSuspensePromise] = useState<Promise<void> | null>(null)
  const suspenseResolveRef = useRef<(() => void) | null>(null)
  
  // 基础数据
  const tSearch = useTranslations('Search')
  const posts = usePosts()
  const { navigation } = useSiteData()
  
  // 推荐内容
  const { recommendedContent } = useRecommendedContent()
  
  // 搜索数据 - 使用 useMemo 缓存，不依赖翻译函数
  const searchableItems = useMemo((): SearchableItem[] => {
    const items: SearchableItem[] = []

    // 1. 添加博客文章
    posts.getAllPosts().forEach((post) => {
      items.push({
        id: `post-${post.id}`,
        type: 'post',
        title: post.title,
        description: post.description ?? undefined,
        href: `/posts/${post.id}`,
        tags: post.tags,
        content: post.description || '',
        priority: post.featured ? 10 : 5,
        category: '博客文章'
      })
    })

    const appendNavigationItem = (navItem: SiteNavigationItem, depth: number = 0) => {
      if (navItem.type !== '__search' && navItem.type !== '__language') {
        items.push({
          id: `nav-${navItem.type}`,
          type: 'link',
          title: navItem.label,
          originalTitle: navItem.label,
          description: navItem.description ?? undefined,
          originalDescription: navItem.description ?? undefined,
          href: navItem.href,
          priority: Math.max(8 - depth * 2, 2),
          category: '导航链接'
        })

        navItem.items.forEach(item => appendNavigationItem(item, depth + 1))
      }
    }

    // 2. 添加导航链接
    navigation.forEach(navItem => appendNavigationItem(navItem))

    return items
  }, [posts, navigation])

  // 搜索引擎 - 使用 useMemo 缓存
  const fuse = useMemo(() => {
    const options: IFuseOptions<SearchableItem> = {
      keys: [
        { name: 'title', weight: 0.3 }, // 翻译后的标题
        { name: 'originalTitle', weight: 0.3 }, // 原始标题，用于英文检索
        { name: 'description', weight: 0.2 },
        { name: 'originalDescription', weight: 0.2 }, // 原始描述，用于英文检索
        { name: 'tags', weight: 0.1 },
        { name: 'content', weight: 0.1 }
      ],
      threshold: 0.3,
      includeScore: true,
      includeMatches: true,
      minMatchCharLength: 2,
      ignoreLocation: true,
      findAllMatches: true
    }
    return new Fuse(searchableItems, options)
  }, [searchableItems])

  // 搜索函数 - 使用 useCallback 稳定引用
  const performSearch = useCallback((query: string): SearchResultsGroup[] => {
    if (!query.trim()) {
      return []
    }

    const results = fuse.search(query)
    
    // 按类型分组
    const groupedResults: { [key: string]: SearchResult[] } = {
      posts: [],
      links: [],
      categories: []
    }

    results.forEach(result => {
      // 直接使用搜索结果，因为数据已经包含翻译后的内容
      const searchResult: SearchResult = {
        item: result.item,
        score: result.score,
        matches: result.matches as FuseResultMatch[]
      }

      if (result.item.type === 'post') {
        groupedResults.posts.push(searchResult)
      } else if (result.item.type === 'link') {
        groupedResults.links.push(searchResult)
      } else if (result.item.type === 'category') {
        groupedResults.categories.push(searchResult)
      }
    })

    // 转换为分组格式，使用翻译的标题
    const searchGroups: SearchResultsGroup[] = []

    if (groupedResults.posts.length > 0) {
      searchGroups.push({
        title: tSearch('searchResults.blogPosts'),
        items: groupedResults.posts.slice(0, 5),
        type: 'posts'
      })
    }

    if (groupedResults.links.length > 0) {
      searchGroups.push({
        title: tSearch('searchResults.navigationLinks'),
        items: groupedResults.links.slice(0, 5),
        type: 'links'
      })
    }

    if (groupedResults.categories.length > 0) {
      searchGroups.push({
        title: tSearch('searchResults.categories'),
        items: groupedResults.categories.slice(0, 5),
        type: 'categories'
      })
    }

    return searchGroups
  }, [fuse, tSearch])

  // 执行搜索
  useEffect(() => {
    const executeSearch = async () => {
      if (!debouncedQuery.trim()) {
        setSearchResults([])
        setIsSearching(false)
        setSuspensePromise(null)
        return
      }

      setIsSearching(true)
      const promise = new Promise<void>((resolve) => {
        suspenseResolveRef.current = resolve
      })
      setSuspensePromise(promise)
      
      try {
        // 模拟异步搜索
        await new Promise(resolve => setTimeout(resolve, 100))
        const results = performSearch(debouncedQuery)
        setSearchResults(results)
      } catch {
        setSearchResults([])
      } finally {
        setIsSearching(false)
        suspenseResolveRef.current?.()
        suspenseResolveRef.current = null
        setSuspensePromise(null)
      }
    }

    executeSearch()
  }, [debouncedQuery, performSearch])


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
    suspensePromise,
    
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
