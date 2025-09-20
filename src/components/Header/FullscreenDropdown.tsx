'use client'

import Link from 'next/link'
import { Post } from '../../../.contentlayer/generated'
import { SubmenuItem, NavigationItem } from '@/constants'
import NestedMenuGroup from './NestedMenuGroup'

interface FullscreenDropdownProps {
  isOpen: boolean
  onClose: () => void
  navigationItem: NavigationItem
  posts?: Post[]
}

export default function FullscreenDropdown({ 
  isOpen, 
  onClose, 
  navigationItem,
  posts = []
}: FullscreenDropdownProps) {
  if (!isOpen || !navigationItem.submenu) return null

  const { title, description } = navigationItem.submenu

  return (
    <>
      {/* 背景遮罩 */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />
      
      {/* 全屏下拉菜单 */}
      <div className="fixed top-16 left-0 right-0 bg-white dark:bg-gray-900 shadow-2xl z-50 border-t border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* 标题区域 */}
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              {title || navigationItem.label}
            </h2>
            {description && (
              <p className="text-lg text-gray-600 dark:text-gray-400">
                {description}
              </p>
            )}
          </div>

          {/* 内容区域 */}
          {navigationItem.type === '__blog' && posts.length > 0 ? (
            // 文章网格布局
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-12">
              {posts.slice(0, 8).map((post) => (
                <Link
                  key={post.slug}
                  href={`/posts/${post.slug}`}
                  className="group block p-6 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300 border border-transparent hover:border-gray-200 dark:hover:border-gray-700 hover:shadow-lg"
                  onClick={onClose}
                >
                  <div className="mb-4">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-2 line-clamp-2">
                      {post.title}
                    </h3>
                    {post.description && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors line-clamp-2">
                        {post.description}
                      </p>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500 dark:text-gray-500">
                      {new Date(post.date).toLocaleDateString('zh-CN', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                    
                    {post.tags && post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {post.tags.slice(0, 2).map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            // 嵌套菜单布局
            <div className="mb-12">
              <NestedMenuGroup 
                items={navigationItem.submenu.items} 
                onClose={onClose} 
              />
            </div>
          )}

          {/* 底部操作区域 */}
          <div className="text-center border-t border-gray-200 dark:border-gray-700 pt-8">
            <Link
              href={navigationItem.href}
              className="inline-flex items-center px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl"
              onClick={onClose}
            >
              {navigationItem.type === '__blog' ? '查看所有文章' : `查看${navigationItem.label}`}
              <svg className="ml-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}

