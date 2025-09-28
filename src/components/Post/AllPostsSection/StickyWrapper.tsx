'use client'

import { useState, useMemo, useEffect } from 'react'
import { PostCard } from '../PostCard'
import { Pagination } from '@/ui'
import type { Post } from '../../../../.contentlayer/generated'

interface StickyWrapperProps {
  posts: Post[]
  title: string
  prevText?: string
  nextText?: string
}


export function StickyWrapper({ posts, title, prevText = "上一页", nextText = "下一页" }: StickyWrapperProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 9 // 3x3网格，每页显示9篇文章

  // 使用真实数据
  const actualPosts = posts || []

  // 计算分页数据
  const paginationData = useMemo(() => {
    const totalPages = Math.ceil(actualPosts.length / pageSize)
    const startIndex = (currentPage - 1) * pageSize
    const endIndex = startIndex + pageSize
    const currentPosts = actualPosts.slice(startIndex, endIndex)

    return {
      totalPages,
      currentPosts,
      total: actualPosts.length
    }
  }, [actualPosts, currentPage, pageSize])

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    // 滚动到顶部
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // 当currentPage变化时，确保分页组件同步
  useEffect(() => {
    setCurrentPage(currentPage)
  }, [currentPage])

  return (
    <div className="mb-12">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        {title}
      </h2>
      
      {/* 3x3网格布局 */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
        {paginationData.currentPosts.map((post) => (
          <PostCard key={post._id} post={post} />
        ))}
      </div>

      {/* 分页组件 */}
      {paginationData.totalPages > 1 && (
        <div className="flex flex-col items-center gap-4">
          {/* 分页信息 */}
          <div className="text-sm text-gray-600">
            第 {((currentPage - 1) * pageSize) + 1}-{Math.min(currentPage * pageSize, paginationData.total)} 条，共 {paginationData.total} 条
          </div>
          
          {/* 简化的分页导航 */}
          <div className="flex items-center gap-2">
            {/* 上一页按钮 */}
            {currentPage > 1 && (
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                className="px-3 py-1 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-colors cursor-pointer"
              >
                {prevText}
              </button>
            )}
            
            {/* 页码按钮 */}
            <div className="flex items-center gap-1">
              {Array.from({ length: paginationData.totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-3 py-1 border rounded-md transition-colors ${
                    page === currentPage
                      ? 'bg-blue-500 text-white border-blue-500 cursor-default'
                      : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-400 cursor-pointer'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
            
            {/* 下一页按钮 */}
            {currentPage < paginationData.totalPages && (
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                className="px-3 py-1 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-colors cursor-pointer"
              >
                {nextText}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
