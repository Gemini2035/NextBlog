'use client'

import { motion } from 'framer-motion'
import { SearchResultsGroup, RecommendedContent, SearchResult } from './searchService'
import { SearchIcon, ChevronRightIcon } from '@/assets/icons'

interface SearchResultsProps {
  searchResults: SearchResultsGroup[]
  recommendedContent: RecommendedContent
  isShowingRecommendations: boolean
  isSearching: boolean
  onItemClick: (href: string) => void
  itemVariants: any // eslint-disable-line @typescript-eslint/no-explicit-any
}

export default function SearchResults({
  searchResults,
  recommendedContent,
  isShowingRecommendations,
  isSearching,
  onItemClick,
  itemVariants
}: SearchResultsProps) {

  // 渲染搜索结果项
  const renderSearchResultItem = (result: SearchResult, index: number) => (
    <motion.div
      key={result.item.id}
      variants={itemVariants}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="group"
    >
      <button
        onClick={() => onItemClick(result.item.href)}
        className="w-full flex items-center justify-between p-4 rounded-lg hover:bg-gray-50 transition-colors text-left"
      >
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-gray-900 truncate group-hover:text-blue-600 transition-colors">
            {result.item.title}
          </h4>
          {result.item.description && (
            <p className="text-sm text-gray-500 mt-1 line-clamp-2">
              {result.item.description}
            </p>
          )}
          {result.item.tags && result.item.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {result.item.tags.slice(0, 3).map((tag, tagIndex) => (
                <span
                  key={tagIndex}
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-600"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
        <ChevronRightIcon className="h-4 w-4 text-gray-400 group-hover:text-gray-600 transition-colors flex-shrink-0 ml-2" />
      </button>
    </motion.div>
  )

  // 渲染推荐内容项
  const renderRecommendedItem = (item: any, index: number) => ( // eslint-disable-line @typescript-eslint/no-explicit-any
    <motion.div
      key={item.id}
      variants={itemVariants}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="group"
    >
      <button
        onClick={() => onItemClick(item.href)}
        className="w-full flex items-center justify-between p-4 rounded-lg hover:bg-gray-50 transition-colors text-left"
      >
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-gray-900 truncate group-hover:text-blue-600 transition-colors">
            {item.title}
          </h4>
          {item.description && (
            <p className="text-sm text-gray-500 mt-1 line-clamp-2">
              {item.description}
            </p>
          )}
          {item.tags && item.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {item.tags.slice(0, 3).map((tag: string, tagIndex: number) => (
                <span
                  key={tagIndex}
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-600"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
        <ChevronRightIcon className="h-4 w-4 text-gray-400 group-hover:text-gray-600 transition-colors flex-shrink-0 ml-2" />
      </button>
    </motion.div>
  )

  // 渲染搜索结果组
  const renderSearchResultsGroup = (group: SearchResultsGroup) => (
    <div key={group.title} className="mb-8">
      <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center">
        <SearchIcon className="h-4 w-4 mr-2" />
        {group.title}
      </h3>
      <div className="space-y-1">
        {group.items.map((result, index) => renderSearchResultItem(result, index))}
      </div>
    </div>
  )

  // 渲染推荐内容组
  const renderRecommendedGroup = (title: string, items: any[]) => { // eslint-disable-line @typescript-eslint/no-explicit-any
    if (items.length === 0) return null

    return (
      <div key={title} className="mb-8">
        <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center">
          <ChevronRightIcon className="h-4 w-4 mr-2" />
          {title}
        </h3>
        <div className="space-y-1">
          {items.map((item, index) => renderRecommendedItem(item, index))}
        </div>
      </div>
    )
  }

  // 加载状态
  if (isSearching) {
    return (
      <motion.div 
        className="text-center py-12" 
        variants={itemVariants}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-sm text-gray-500">搜索中...</p>
      </motion.div>
    )
  }

  // 显示搜索结果
  if (!isShowingRecommendations && searchResults.length > 0) {
    return (
      <div className="max-h-96 overflow-y-auto">
        {searchResults.map(renderSearchResultsGroup)}
      </div>
    )
  }

  // 显示推荐内容
  if (isShowingRecommendations) {
    return (
      <div className="max-h-96 overflow-y-auto">
        {recommendedContent.featuredPosts.length > 0 && 
          renderRecommendedGroup('推荐博客', recommendedContent.featuredPosts)
        }
        {recommendedContent.recentPosts.length > 0 && 
          renderRecommendedGroup('最新文章', recommendedContent.recentPosts)
        }
        {recommendedContent.navigationLinks.length > 0 && 
          renderRecommendedGroup('推荐链接', recommendedContent.navigationLinks)
        }
      </div>
    )
  }

  // 无结果状态
  return (
    <motion.div 
      className="text-center py-12" 
      variants={itemVariants}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <SearchIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" strokeWidth={1} />
      <h3 className="text-lg font-medium text-gray-900 mb-2">未找到结果</h3>
      <p className="text-sm text-gray-500">尝试使用其他关键词搜索</p>
    </motion.div>
  )
}
