'use client'

import Link from 'next/link'
import { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import { SubmenuItem, NavigationItem } from '@/constants'
import NestedMenuGroup from './NestedMenuGroup'

interface FullscreenDropdownProps {
  isOpen: boolean
  onClose: () => void
  navigationItem: NavigationItem
}

export default function FullscreenDropdown({ 
  isOpen, 
  onClose, 
  navigationItem
}: FullscreenDropdownProps) {

  // 判断是否为搜索模式
  const isSearchMode = navigationItem.type === '__search'

  // 搜索模式的状态 - 仅用于UI显示
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  // 处理输入变化 - 仅更新UI状态
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value)
  }, [])

  // 清空搜索 - 仅清空UI状态
  const clearSearch = useCallback(() => {
    setQuery('')
    inputRef.current?.focus()
  }, [])

  // 关闭时清空搜索状态
  const handleClose = useCallback(() => {
    if (isSearchMode) {
      setQuery('')
    }
    onClose()
  }, [isSearchMode, onClose])

  // 当组件关闭时清空搜索状态
  useEffect(() => {
    if (!isOpen && isSearchMode) {
      setQuery('')
    }
  }, [isOpen, isSearchMode])

  // 处理背景遮罩点击
  const handleBackgroundClick = useCallback(() => {
    onClose()
  }, [onClose])

  // 搜索模式下的标题和描述
  const title = isSearchMode ? '搜索文章' : navigationItem.submenu?.title || navigationItem.label
  const description = isSearchMode ? '输入关键词搜索相关文章' : navigationItem.submenu?.description

  // 搜索模式下的显示文本 - 使用useMemo避免重复计算
  const searchDisplayText = useMemo(() => {
    const trimmedQuery = query.trim()
    return {
      title: trimmedQuery ? '搜索功能开发中' : '开始搜索',
      description: trimmedQuery ? '搜索功能即将上线，敬请期待' : '输入关键词搜索相关文章'
    }
  }, [query])

  // 底部按钮文本 - 使用useMemo避免重复计算
  const bottomButtonText = useMemo(() => {
    return navigationItem.type === '__blog' ? '查看所有文章' : `查看${navigationItem.label}`
  }, [navigationItem.type, navigationItem.label])

  if (!isOpen) return null

  return (
    <>
      {/* 背景遮罩 - 添加模糊效果 */}
      <div 
        className="absolute left-0 top-full w-full h-screen inset-0 bg-black opacity-30 z-40"
        onClick={handleBackgroundClick}
      />
      
      {/* 全屏下拉菜单 - 调整高度和定位 */}
      <div 
        className="absolute w-full top-full bg-white dark:bg-gray-900 shadow-2xl z-50 border-gray-200 dark:border-gray-700 max-h-[80vh] overflow-y-auto"
        data-submenu
        onMouseEnter={(e) => {
          // 阻止事件冒泡，确保submenu保持打开
          e.stopPropagation()
        }}
        onMouseLeave={(e) => {
          // 只有当鼠标真正离开submenu区域时才关闭
          const rect = e.currentTarget.getBoundingClientRect()
          const x = e.clientX
          const y = e.clientY
          
          // 检查鼠标是否真的在submenu区域外
          if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
            onClose()
          }
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* 标题区域 - 减小字体 */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
              {title || navigationItem.label}
            </h2>
            {description && (
              <p className="text-base text-gray-600 dark:text-gray-400">
                {description}
              </p>
            )}
          </div>

          {/* 搜索框区域 - 仅在搜索模式下显示 */}
          {isSearchMode && (
            <div className="max-w-2xl mx-auto mb-8">
              <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-full px-6 py-4">
                <svg 
                  className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-4 flex-shrink-0" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
                  />
                </svg>
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="搜索文章..."
                  value={query}
                  onChange={handleInputChange}
                  className="flex-1 bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none text-lg"
                  autoFocus
                />
                {query && (
                  <button
                    onClick={clearSearch}
                    className="ml-4 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    aria-label="清空搜索"
                  >
                    <svg className="h-5 w-5 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* 内容区域 */}
          {isSearchMode ? (
            // 搜索模式的内容 - 仅UI展示
            <div className="text-center py-12">
              <svg className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                {searchDisplayText.title}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {searchDisplayText.description}
              </p>
            </div>
          ) : (
            // 普通导航模式的内容 - 统一使用嵌套菜单布局
            <div className="mb-8">
              <NestedMenuGroup 
                items={navigationItem.submenu?.items || []} 
                onClose={onClose} 
              />
            </div>
          )}

          {/* 底部操作区域 - 减小字体和间距 */}
          <div className="text-center border-t border-gray-200 dark:border-gray-700 pt-6">
            {isSearchMode ? (
              <button
                onClick={handleClose}
                className="inline-flex items-center px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl text-sm"
              >
                关闭搜索
                <svg className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            ) : (
              <Link
                href={navigationItem.href}
                className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl text-sm"
                onClick={onClose}
              >
                {bottomButtonText}
                <svg className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            )}
          </div>
        </div>
      </div>
    </>
  )
}