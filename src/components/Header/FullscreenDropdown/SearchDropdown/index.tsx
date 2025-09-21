'use client'

import { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import { motion, Variants } from 'framer-motion'
import { SITE_CONFIG } from '@/constants'
import { SearchIcon, CloseIcon } from '@/assets/icons'

interface SearchDropdownProps {
  itemVariants: Variants
  isOpen: boolean
}

export default function SearchDropdown({ itemVariants, isOpen }: SearchDropdownProps) {
  // 搜索状态管理
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  // 处理输入变化
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value)
  }, [])

  // 清空搜索
  const clearSearch = useCallback(() => {
    setQuery('')
    inputRef.current?.focus()
  }, [])

  // 当组件关闭时清空搜索状态
  useEffect(() => {
    if (!isOpen) {
      setQuery('')
    }
  }, [isOpen])

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

  // 搜索模式下的显示文本 - 使用useMemo避免重复计算
  const searchDisplayText = useMemo(() => {
    const trimmedQuery = query.trim()
    return {
      title: trimmedQuery ? '搜索功能开发中' : '开始搜索',
      description: trimmedQuery ? '搜索功能即将上线，敬请期待' : '输入关键词搜索相关文章'
    }
  }, [query])

  return (
    <>
      {/* 搜索框区域 */}
      <motion.div 
        className="w-full mb-8" 
        variants={itemVariants}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="flex items-center bg-transparent px-6 py-4 w-full">
          <SearchIcon className="h-5 w-5 text-gray-500 mr-4 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder={`搜索${SITE_CONFIG.title}`}
            value={query}
            onChange={handleInputChange}
            className="flex-1 bg-transparent text-gray-900 placeholder-gray-500 focus:outline-none text-lg"
            autoFocus
          />
          {query && (
            <button
              onClick={clearSearch}
              className="ml-4 p-2 rounded-full hover:bg-gray-200 transition-colors"
              aria-label="清空搜索"
            >
              <CloseIcon className="h-5 w-5 text-gray-500" />
            </button>
          )}
        </div>
      </motion.div>

      {/* 搜索结果显示区域 */}
      <motion.div 
        className="text-center py-12" 
        variants={itemVariants}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <SearchIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" strokeWidth={1} />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          {searchDisplayText.title}
        </h3>
        <p className="text-sm text-gray-500">
          {searchDisplayText.description}
        </p>
      </motion.div>
    </>
  )
}
