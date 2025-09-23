import { useState, useEffect, useMemo, useCallback } from 'react'
import { useDebounce } from 'use-debounce'
import { useLocale, useTranslations } from 'next-intl'
import { allPosts, Post } from '../../.contentlayer/generated'
import { NAVIGATION_ITEMS } from '@/constants'
import { useRecommendedContent, RecommendedContent } from './useRecommendedContent'
import Fuse, { FuseResultMatch, IFuseOptions } from 'fuse.js'
import { SearchableItem, SearchResult, SearchResultsGroup } from '@/types/search'

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
  const [searchResults, setSearchResults] = useState<SearchResultsGroup[]>([])
  
  // 基础数据
  const locale = useLocale()
  const t = useTranslations('Navigation')
  const tSearch = useTranslations('Search')
  
  // 推荐内容
  const { recommendedContent } = useRecommendedContent()
  
  // 搜索数据 - 使用 useMemo 缓存，不依赖翻译函数
  const searchableItems = useMemo((): SearchableItem[] => {
    const items: SearchableItem[] = []

    // 1. 添加博客文章
    const publishedPosts = allPosts.filter((post: Post) => 
      post.published !== false && post.locale === locale
    )
    
    publishedPosts.forEach((post: Post) => {
      items.push({
        id: `post-${post.slug}-${post.locale || 'default'}`,
        type: 'post',
        title: post.title,
        description: post.description,
        href: `/posts/${post.slug}`,
        tags: post.tags,
        content: post.body?.raw || '',
        priority: post.featured ? 10 : 5,
        category: '博客文章'
      })
    })

    // 2. 添加导航链接（同时保存原始标签和翻译标签）
    NAVIGATION_ITEMS.forEach(navItem => {
      if (navItem.type !== '__search' && navItem.type !== '__language') {
        items.push({
          id: `nav-${navItem.type}`,
          type: 'link',
          title: t(navItem.label), // 翻译后的标签用于显示
          originalTitle: navItem.label, // 原始标签用于检索
          description: navItem.submenu?.description ? t(navItem.submenu.description) : undefined,
          originalDescription: navItem.submenu?.description || undefined,
          href: navItem.href,
          priority: 8,
          category: '导航链接'
        })

        // 添加子菜单项
        navItem.submenu?.items.forEach(subItem => {
          items.push({
            id: `nav-${navItem.type}-${subItem.label}`,
            type: 'link',
            title: t(subItem.label), // 翻译后的标签用于显示
            originalTitle: subItem.label, // 原始标签用于检索
            description: subItem.description ? t(subItem.description) : undefined,
            originalDescription: subItem.description || undefined,
            href: subItem.href,
            priority: 6,
            category: '导航链接'
          })

          // 添加三级菜单项
          subItem.items?.forEach(thirdItem => {
            items.push({
              id: `nav-${navItem.type}-${subItem.label}-${thirdItem.label}`,
              type: 'link',
              title: t(thirdItem.label), // 翻译后的标签用于显示
              originalTitle: thirdItem.label, // 原始标签用于检索
              description: thirdItem.description ? t(thirdItem.description) : undefined,
              originalDescription: thirdItem.description || undefined,
              href: thirdItem.href,
              priority: 4,
              category: '导航链接'
            })
          })
        })
      }
    })

    return items
  }, [locale]) // 移除 posts 依赖，因为 posts 在 useMemo 内部没有直接使用

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
  }, [fuse, t, tSearch])

  // 执行搜索
  useEffect(() => {
    const executeSearch = async () => {
      if (!debouncedQuery.trim()) {
        setSearchResults([])
        setIsSearching(false)
        return
      }

      setIsSearching(true)
      
      try {
        // 模拟异步搜索
        await new Promise(resolve => setTimeout(resolve, 100))
        const results = performSearch(debouncedQuery)
        setSearchResults(results)
      } catch {
        setSearchResults([])
      } finally {
        setIsSearching(false)
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
