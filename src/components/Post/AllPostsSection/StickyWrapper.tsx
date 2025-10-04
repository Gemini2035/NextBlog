'use client'

import { useState, useMemo, useEffect, useCallback } from 'react'
import { useTranslations } from 'next-intl'
import { PostCard } from '../PostCard'
import { PostFilter } from '../FeaturedPostSection/PostFilter'
import { Pagination, EmptyState } from '@/ui'
import { useLayoutHeights, useAnchorScroll } from '@/hooks'
import type { Post } from '.contentlayer/generated'

interface StickyWrapperProps {
  posts: Post[]
  title: string
  prevText?: string
  nextText?: string
  locale?: string
  initialTag?: string | null
}


export function StickyWrapper({ posts, title, locale, initialTag }: StickyWrapperProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [filteredPosts, setFilteredPosts] = useState<Post[]>(posts || [])
  const pageSize = 9 // 3x3网格，每页显示9篇文章
  
  // 国际化翻译
  const t = useTranslations('Pagination')
  const tEmpty = useTranslations('EmptyState')
  const { headerHeight } = useLayoutHeights()

  // 使用useCallback包装setFilteredPosts函数
  const handleFilteredPostsChange = useCallback((newFilteredPosts: Post[]) => {
    setFilteredPosts(newFilteredPosts)
  }, [])

  // 使用筛选后的数据
  const actualPosts = filteredPosts

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
    // 滚动到所有文章标题处而不是直接回顶部
    // 使用setTimeout确保DOM更新后再滚动
    setTimeout(() => {
      // 查找所有文章标题（使用ID选择器更精确）
      const allPostsTitle = document.getElementById('all-posts')
      if (allPostsTitle) {
        const titleRect = allPostsTitle.getBoundingClientRect()
        const scrollTop = window.scrollY + titleRect.top - headerHeight - 10 // 使用动态headerHeight并预留10px空间
        window.scrollTo({ top: Math.max(0, scrollTop), behavior: 'smooth' })
      } else {
        // 如果找不到标题，则滚动到顶部
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    }, 100) // 100ms延迟确保DOM更新
  }

  // 当筛选结果变化时，重置到第一页
  useEffect(() => {
    setCurrentPage(1)
  }, [filteredPosts])

  // 当currentPage变化时，确保分页组件同步
  useEffect(() => {
    setCurrentPage(currentPage)
  }, [currentPage])

  // 使用通用锚点滚动hook
  useAnchorScroll({ anchorId: 'all-posts' })

  // 当有initialTag时，自动滚动到all-posts区域
  useEffect(() => {
    if (initialTag) {
      // 延迟执行，确保DOM已渲染
      setTimeout(() => {
        const allPostsTitle = document.getElementById('all-posts')
        if (allPostsTitle) {
          const titleRect = allPostsTitle.getBoundingClientRect()
          const scrollTop = window.scrollY + titleRect.top - headerHeight - 20 // 预留更多空间
          window.scrollTo({ top: Math.max(0, scrollTop), behavior: 'smooth' })
        }
      }, 300) // 增加延迟确保筛选器已初始化
    }
  }, [initialTag, headerHeight])

  return (
    <div className="mb-12">
      {/* 标题 */}
      <h2 id="all-posts" className="text-2xl font-bold text-gray-900 mb-6">
        {title}
      </h2>
      
      {/* 筛选器 */}
      <div className="mb-8">
        <PostFilter
          posts={posts}
          onFilteredPostsChange={handleFilteredPostsChange}
          locale={locale}
          initialTag={initialTag}
        />
      </div>
      
      {/* 文章列表或空状态 */}
      {paginationData.currentPosts.length === 0 ? (
        <EmptyState
          icon="search"
          title={tEmpty('noPosts')}
          description={tEmpty('noPostsDescription')}
          size="md"
          variant="card"
        />
      ) : (
        <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mb-8">
          {paginationData.currentPosts.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      )}

      {/* 分页组件 */}
      {paginationData.totalPages > 1 && (
        <div className="flex flex-col items-center gap-4">
          <Pagination
            current={currentPage}
            total={paginationData.total}
            pageSize={pageSize}
            onChange={handlePageChange}
            showTotal={(total, range) => 
              t('range', { start: range[0], end: range[1], total })
            }
            showQuickJumper={paginationData.totalPages > 5}
            showSizeChanger={false}
            hideOnSinglePage={true}
            size="small"
            align="center"
            className="mt-4"
          />
        </div>
      )}
    </div>
  )
}
