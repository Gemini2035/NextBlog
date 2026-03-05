'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import { useDebounce } from 'use-debounce'
import { useLocale, useTranslations } from 'next-intl'
import { NAVIGATION_ITEMS } from '@/constants'
import { useRecommendedContent, RecommendedContent } from './useRecommendedContent'
import Fuse, { FuseResultMatch, IFuseOptions } from 'fuse.js'
import { SearchableItem, SearchResult, SearchResultsGroup } from '@/types/search'
import { POST_LIST_QUERY, type PostListResult } from '@/graphql/operations'
import { useLoading } from '@/components/LoadingProvider'

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

async function fetchGraphQL<T>(
  query: string,
  variables: Record<string, unknown>,
  locale: string,
): Promise<T> {
  const res = await fetch('/api/graphql', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-locale': locale,
    },
    body: JSON.stringify({ query, variables }),
    cache: 'no-store',
  })

  if (!res.ok) {
    throw new Error(`GraphQL 请求失败: ${res.status}`)
  }

  const json = (await res.json()) as { data?: T; errors?: { message: string }[] }
  if (json.errors?.length) {
    throw new Error(json.errors.map((e) => e.message).join('; '))
  }
  if (!json.data) {
    throw new Error('GraphQL 响应缺少 data')
  }
  return json.data
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
  const { handleSetLoading } = useLoading()
  
  // 推荐内容
  const { recommendedContent } = useRecommendedContent()
  
  // 搜索数据（仅导航及分类等本地数据；文章数据从后端 GraphQL 获取）
  const searchableItems = useMemo((): SearchableItem[] => {
    const items: SearchableItem[] = []

    // 导航链接（同时保存原始标签和翻译标签）
    NAVIGATION_ITEMS.forEach((navItem) => {
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
          category: '导航链接',
        })

        // 子菜单项
        navItem.submenu?.items.forEach((subItem) => {
          items.push({
            id: `nav-${navItem.type}-${subItem.label}`,
            type: 'link',
            title: t(subItem.label),
            originalTitle: subItem.label,
            description: subItem.description ? t(subItem.description) : undefined,
            originalDescription: subItem.description || undefined,
            href: subItem.href,
            priority: 6,
            category: '导航链接',
          })

          // 三级菜单项
          subItem.items?.forEach((thirdItem) => {
            items.push({
              id: `nav-${navItem.type}-${subItem.label}-${thirdItem.label}`,
              type: 'link',
              title: t(thirdItem.label),
              originalTitle: thirdItem.label,
              description: thirdItem.description ? t(thirdItem.description) : undefined,
              originalDescription: thirdItem.description || undefined,
              href: thirdItem.href,
              priority: 4,
              category: '导航链接',
            })
          })
        })
      }
    })

    return items
  }, [t])

  // 搜索函数：
  // - 文章：完全使用后端按关键词检索的结果，不再经过 Fuse
  // - 导航等其它：只在本地 searchableItems 上用 Fuse 做模糊搜索
  const performSearch = useCallback(
    (keyword: string, postsFromBackend: SearchableItem[]): SearchResultsGroup[] => {
      const trimmed = keyword.trim()
      if (!trimmed) {
        return []
      }

      // 1. 文章结果：直接用后端返回的数据构造分组，不再二次模糊匹配
      const postResults: SearchResult[] = postsFromBackend.map((item) => ({
        item,
      }))

      // 2. 导航等非文章结果：在本地 searchableItems 上做 Fuse 模糊搜索
      const options: IFuseOptions<SearchableItem> = {
        keys: [
          { name: 'title', weight: 0.4 },
          { name: 'originalTitle', weight: 0.3 },
          { name: 'description', weight: 0.2 },
          { name: 'originalDescription', weight: 0.1 },
          { name: 'tags', weight: 0.1 },
        ],
        threshold: 0.3,
        includeScore: true,
        includeMatches: true,
        minMatchCharLength: 2,
        ignoreLocation: true,
        findAllMatches: true,
      }

      const fuse = new Fuse(searchableItems, options)
      const results = fuse.search(trimmed)

      const groupedResults: { [key: string]: SearchResult[] } = {
        posts: postResults,
        links: [],
        categories: [],
      }

      results.forEach((result) => {
        const searchResult: SearchResult = {
          item: result.item,
          score: result.score,
          matches: result.matches as FuseResultMatch[],
        }

        if (result.item.type === 'post') {
          groupedResults.posts.push(searchResult)
        } else if (result.item.type === 'link') {
          groupedResults.links.push(searchResult)
        } else if (result.item.type === 'category') {
          groupedResults.categories.push(searchResult)
        }
      })

      const searchGroups: SearchResultsGroup[] = []

      if (postResults.length > 0) {
        searchGroups.push({
          title: tSearch('searchResults.blogPosts'),
          items: groupedResults.posts.slice(0, 5),
          type: 'posts',
        })
      }

      if (groupedResults.links.length > 0) {
        searchGroups.push({
          title: tSearch('searchResults.navigationLinks'),
          items: groupedResults.links.slice(0, 5),
          type: 'links',
        })
      }

      if (groupedResults.categories.length > 0) {
        searchGroups.push({
          title: tSearch('searchResults.categories'),
          items: groupedResults.categories.slice(0, 5),
          type: 'categories',
        })
      }

      return searchGroups
    },
    [searchableItems, tSearch],
  )

  // 执行搜索
  useEffect(() => {
    const executeSearch = async () => {
      if (!debouncedQuery.trim()) {
        setSearchResults([])
        setIsSearching(false)
        return
      }

      setIsSearching(true)
      handleSetLoading({
        id: 'header-search',
        loadingSelector: ['#header-submenu-container'],
      })
      
      try {
        // 1. 先从后端按关键词获取相关文章（数据库数据）
        const data = await fetchGraphQL<PostListResult>(
          POST_LIST_QUERY,
          {
            page: 1,
            pageSize: 50,
            keyword: debouncedQuery.trim(),
            sortBy: 'date',
            sortOrder: 'desc',
          },
          locale,
        )

        const postItems: SearchableItem[] = data.postsList.list.map((post) => ({
          id: `post-${post.id}-${post.locale}`,
          type: 'post',
          title: post.title,
          description: post.description ?? undefined,
          href: `/posts/${post.id}`,
          tags: post.tags,
          priority: post.featured ? 10 : 5,
          category: '博客文章',
        }))

        // 2. 再用 Fuse 在「文章 + 导航项」数据上做统一模糊搜索和分组
        const results = performSearch(debouncedQuery, postItems)
        setSearchResults(results)
      } catch {
        setSearchResults([])
      } finally {
        setIsSearching(false)
        handleSetLoading({
          id: 'header-search',
          loadingSelector: ['#header-submenu-container'],
        })
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
