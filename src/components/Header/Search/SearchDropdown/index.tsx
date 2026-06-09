'use client'

import { useRef, useEffect, useCallback } from 'react'
import { motion, Variants } from 'framer-motion'
import { SearchIcon, CloseIcon, ArrowRightIcon } from '@/assets/icons'
import { useSearch } from '@/hooks/useSearch'
import { Link } from '@/ui'
import SearchResults from './SearchResults'
import { useTranslations } from 'next-intl'

interface SearchDropdownProps {
  itemVariants: Variants
  isOpen: boolean
  onClose: () => void
}

export default function SearchDropdown({ itemVariants, isOpen, onClose }: SearchDropdownProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const didRequestRecommendationsRef = useRef(false)
  const t = useTranslations('Search')
  
  // 使用搜索Hook
  const {
    query,
    setQuery,
    isSearching,
    searchResults,
    recommendedContent,
    isShowingRecommendations,
    clearSearch,
    refreshRecommendations,
  } = useSearch()
  const chatAgentHref = `/agent/chat${query.trim() ? `?question=${encodeURIComponent(query.trim())}` : ''}`

  // 处理输入变化
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value)
  }, [setQuery])

  // 处理搜索结果项点击
  const handleItemClick = useCallback((href: string) => {
    // 关闭搜索下拉框
    onClose()
    // 使用Next.js路由导航
    if (typeof window !== 'undefined') {
      window.location.href = href
    }
  }, [onClose])

  // 当组件关闭时清空搜索状态
  useEffect(() => {
    if (!isOpen) {
      clearSearch()
      didRequestRecommendationsRef.current = false
      return
    }

    if (didRequestRecommendationsRef.current) {
      return
    }

    didRequestRecommendationsRef.current = true
    refreshRecommendations()
  }, [isOpen, clearSearch, refreshRecommendations])

  // 搜索模式打开时自动聚焦输入框
  useEffect(() => {
    if (isOpen && inputRef.current) {
      // 延迟聚焦，确保动画完成后再聚焦
      const timer = setTimeout(() => {
        inputRef.current?.focus()
      }, 300) // 延迟300ms，等待动画完成
      
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  return (
    <>
      {/* 搜索框区域 */}
      <motion.div 
        className="w-full mb-4 md:mb-8" 
        variants={itemVariants}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="flex items-center bg-transparent px-0 py-2 md:px-6 md:py-4 w-full">
          <SearchIcon className="hidden md:block h-5 w-5 text-gray-500 mr-4 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder={t('searchPlaceholder')}
            value={query}
            onChange={handleInputChange}
            className="flex-1 bg-transparent text-gray-900 placeholder-gray-500 focus:outline-none text-base md:text-lg"
            autoFocus
          />
          {query && (
            <button
              onClick={clearSearch}
              className="ml-2 md:ml-4 p-2 rounded-full hover:bg-gray-200 transition-colors cursor-pointer"
              aria-label={t('clearSearch')}
            >
              <CloseIcon className="h-5 w-5 text-gray-500" />
            </button>
          )}
        </div>
      </motion.div>

      <SearchResults
        searchResults={searchResults}
        recommendedContent={recommendedContent}
        isShowingRecommendations={isShowingRecommendations}
        isSearching={isSearching}
        onItemClick={handleItemClick}
        itemVariants={itemVariants}
      />
      <motion.div
        className="mt-6 flex justify-end border-t border-gray-200 pt-4"
        variants={itemVariants}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <Link
          href={chatAgentHref}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-900 transition-colors hover:text-gray-600"
          onClick={onClose}
        >
          <span>使用ai助手</span>
          <ArrowRightIcon className="h-4 w-4" strokeWidth={1.8} />
        </Link>
      </motion.div>
    </>
  )
}
