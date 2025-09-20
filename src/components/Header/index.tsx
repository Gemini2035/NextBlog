'use client'

import Link from 'next/link'
import { useState } from 'react'
import { SITE_CONFIG, NAVIGATION_ITEMS } from '@/constants'
import { getAllPosts } from '@/lib/posts'
import FullscreenDropdown from './FullscreenDropdown'

export default function Header() {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  
  // 获取所有文章用于子菜单
  const allPosts = getAllPosts()
  
  // 为有submenu的导航项动态填充内容
  const navigationItems = NAVIGATION_ITEMS.map(item => {
    if (item.type === '__blog' && item.submenu) {
      return {
        ...item,
        submenu: {
          ...item.submenu,
          items: allPosts.slice(0, 5).map(post => ({
            label: post.title,
            href: `/posts/${post.slug}`,
            description: post.description
          }))
        }
      }
    }
    return item
  })

  return (
    <header className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link 
              href="/" 
              className="text-xl font-bold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              {SITE_CONFIG.title}
            </Link>
          </div>
          
          <nav className="hidden md:flex space-x-8">
            {navigationItems.map((item) => (
              <div key={item.href} className="relative">
                {item.submenu && item.submenu.items && item.submenu.items.length > 0 ? (
                  <div
                    className="relative"
                    onMouseEnter={() => setActiveDropdown(item.type)}
                    onMouseLeave={() => setActiveDropdown(null)}
                  >
                    <Link 
                      href={item.href} 
                      className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center"
                    >
                      {item.label}
                      <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </Link>
                  </div>
                ) : (
                  <Link 
                    href={item.href} 
                    className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    {item.label}
                  </Link>
                )}
              </div>
            ))}
          </nav>
          
          <div className="md:hidden">
            <button className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      {/* 全屏下拉菜单 */}
      {navigationItems.map((item) => (
        <FullscreenDropdown
          key={item.type}
          isOpen={activeDropdown === item.type}
          onClose={() => setActiveDropdown(null)}
          navigationItem={item}
          posts={item.type === '__blog' ? allPosts : undefined}
        />
      ))}
    </header>
  )
}
