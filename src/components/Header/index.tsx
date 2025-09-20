'use client'

import Link from 'next/link'
import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { SITE_CONFIG, getNavigationItemsWithSubmenus, HEADER_CONFIG } from '@/constants'
import { getAllPosts } from '@/lib/posts'
import FullscreenDropdown from './FullscreenDropdown'
import SearchBar from './SearchBar'
import ThemeToggle from './ThemeToggle'
import LanguageToggle from './LanguageToggle'

export default function Header() {
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null)
  const navRef = useRef<HTMLElement>(null)
  const navItemsRef = useRef<HTMLElement>(null)
  const lastScrollYRef = useRef<number>(0)
  
  // 获取带有动态子菜单的导航项 - 使用useMemo缓存
  const navigationItems = useMemo(() => getNavigationItemsWithSubmenus(), [])

  // 处理滚动事件
  const handleScroll = useCallback(() => {
    const currentScrollY = window.scrollY
    const lastScrollY = lastScrollYRef.current
    const scrollDelta = Math.abs(currentScrollY - lastScrollY)
    const scrollDirection = currentScrollY > lastScrollY ? 'down' : 'up'
    
    // 更新上次滚动位置
    lastScrollYRef.current = currentScrollY
    
    // 如果有submenu打开，检查滚动条件
    if (activeSubmenu) {
      // 如果是向下滚动且超过配置的阈值，立即关闭submenu
      if (scrollDirection === 'down' && scrollDelta > HEADER_CONFIG.downwardScrollThreshold) {
        setActiveSubmenu(null)
      }
    }
  }, [activeSubmenu])

  // 监听滚动事件，当页面滚动超过阈值时关闭submenu
  useEffect(() => {
    // 添加滚动事件监听器
    window.addEventListener('scroll', handleScroll, { passive: true })
    
    // 清理函数
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [handleScroll])

  // 处理鼠标移动事件
  const handleMouseMove = useCallback((event: MouseEvent) => {
    if (!activeSubmenu) return

    const target = event.target as HTMLElement
    
    // 检查鼠标是否在子菜单区域
    const isInSubmenu = target.closest('[data-submenu]')
    
    // 检查鼠标是否在header区域
    const isInHeader = navRef.current?.contains(target)
    
    // 只有当鼠标完全离开header和submenu区域时才关闭submenu
    if (!isInHeader && !isInSubmenu) {
      setActiveSubmenu(null)
    }
  }, [activeSubmenu])

  // 监听鼠标移动事件，检测鼠标是否在导航项区域或子菜单区域
  useEffect(() => {
    // 添加鼠标移动事件监听器
    document.addEventListener('mousemove', handleMouseMove)
    
    // 清理函数
    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
    }
  }, [handleMouseMove])

  // 处理搜索点击
  const handleSearchClick = useCallback(() => {
    setActiveSubmenu('__search')
  }, [])

  // 处理导航项悬停
  const handleNavHover = useCallback((itemType: string) => {
    setActiveSubmenu(itemType)
  }, [])

  // 处理submenu关闭
  const handleSubmenuClose = useCallback(() => {
    setActiveSubmenu(null)
  }, [])

  // 搜索导航项的子菜单配置 - 使用useMemo避免在渲染中创建新对象
  const searchSubmenu = useMemo(() => ({
    title: '搜索文章',
    description: '输入关键词搜索相关文章',
    items: []
  }), [])

  // 搜索导航项 - 使用useMemo避免在渲染中创建新对象
  const searchNavigationItem = useMemo(() => ({
    type: '__search' as const,
    label: '搜索',
    href: '#',
    submenu: searchSubmenu
  }), [searchSubmenu])


  return (
    <header 
      ref={navRef}
      className="sticky top-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm shadow-sm border-b border-gray-200 dark:border-gray-700"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 主要内容区域 */}
        <div className="flex justify-between items-center h-16">
          {/* Logo区域 */}
          <div className="flex items-center">
            <Link 
              href="/" 
              className="text-xl font-bold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              {SITE_CONFIG.title}
            </Link>
          </div>
          
          {/* 右侧区域：导航菜单 + Action Bar */}
          <div className="flex items-center space-x-6">
            {/* 导航菜单 */}
            <nav ref={navItemsRef} className="hidden lg:flex space-x-8">
              {navigationItems.map((item) => (
                <div key={item.href} className="relative">
                  {item.submenu && item.submenu.items && item.submenu.items.length > 0 ? (
                    <div
                      className="relative"
                      onMouseEnter={() => handleNavHover(item.type)}
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

            {/* Action Bar */}
            <div className="flex items-center space-x-2">
            {/* 搜索功能 */}
            <div className="hidden md:block">
              <SearchBar onSearchClick={handleSearchClick} />
            </div>

              {/* 语言切换 */}
              <LanguageToggle />

              {/* 主题切换 */}
              <ThemeToggle />

              {/* 移动端菜单按钮 */}
              <div className="lg:hidden">
                <button className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white transition-all duration-200">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 移动端搜索栏 */}
        <div className="md:hidden pb-4">
          <SearchBar onSearchClick={handleSearchClick} />
        </div>
      </div>
      
      {/* 统一的submenu */}
      {activeSubmenu && (
        <FullscreenDropdown
          isOpen={true}
          onClose={handleSubmenuClose}
          navigationItem={
            activeSubmenu === '__search' 
              ? searchNavigationItem 
              : navigationItems.find(item => item.type === activeSubmenu) || searchNavigationItem
          }
        />
      )}
    </header>
  )
}
