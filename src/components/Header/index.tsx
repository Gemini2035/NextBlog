'use client'

import Link from 'next/link'
import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { SITE_CONFIG, getNavigationItemsWithSubmenus, HEADER_CONFIG, NavigationItem } from '@/constants'
import { ChevronDownIcon, MenuIcon } from '@/assets/icons'
import FullscreenDropdown from './FullscreenDropdown'
import SearchBar from './SearchBar'
import LanguageToggle from './LanguageToggle'

// 导航项组件 - 减少三目选择器的使用
interface NavItemProps {
  item: NavigationItem
  activeSubmenu: string | null
  onNavHover: (itemType: string) => void
}

function NavItem({ item, activeSubmenu, onNavHover }: NavItemProps) {
  const hasSubmenu = item.submenu && item.submenu.items && item.submenu.items.length > 0
  
  if (hasSubmenu) {
    return (
      <div
        className="relative"
        onMouseEnter={() => onNavHover(item.type)}
      >
        <Link 
          href={item.href} 
          className="text-gray-700 hover:text-gray-800 transition-colors flex items-center"
          aria-haspopup="true"
          aria-expanded={activeSubmenu === item.type}
        >
          {item.label}
          <ChevronDownIcon className="ml-1 h-4 w-4" />
        </Link>
      </div>
    )
  }
  
  return (
    <Link 
      href={item.href} 
      className="text-gray-700 hover:text-gray-800 transition-colors"
    >
      {item.label}
    </Link>
  )
}

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
    const target = event.target as HTMLElement
    
    // 检查鼠标是否在搜索按钮上
    const isOnSearchButton = target.closest('button[aria-label="搜索"]')
    // 检查鼠标是否在语言切换按钮上
    const isOnLanguageButton = target.closest('button[aria-label="切换语言"]')
    
    // 如果鼠标在搜索按钮上，且当前submenu不是搜索类型
    if (isOnSearchButton && activeSubmenu && activeSubmenu !== '__search') {
      setActiveSubmenu(null)
      return
    }
    
    // 如果鼠标在语言切换按钮上，且当前submenu不是语言类型
    if (isOnLanguageButton && activeSubmenu && activeSubmenu !== '__language') {
      setActiveSubmenu(null)
      return
    }
    
    if (!activeSubmenu) return
    
    // 检查鼠标是否在子菜单区域
    const isInSubmenu = target.closest('[data-submenu]')
    
    // 检查鼠标是否在header区域
    const isInHeader = navRef.current?.contains(target)
    
    // 检查鼠标是否在触发按钮上（搜索按钮或语言切换按钮）
    const isOnTriggerButton = target.closest('button[aria-label="搜索"], button[aria-label="切换语言"]')
    
    // 只有当鼠标完全离开header、submenu区域和触发按钮时才关闭submenu
    if (!isInHeader && !isInSubmenu && !isOnTriggerButton) {
      // 添加小延迟，避免快速鼠标移动导致的意外关闭
      setTimeout(() => {
        // 再次检查鼠标位置，确保真的离开了所有相关区域
        // 使用try-catch包装，避免在组件卸载后访问DOM元素
        try {
          const currentElement = document.elementFromPoint(event.clientX, event.clientY)
          if (!currentElement) return // 如果元素不存在，直接返回
          
          const stillInSubmenu = currentElement?.closest('[data-submenu]')
          const stillInHeader = currentElement?.closest('header')
          const stillOnTriggerButton = currentElement?.closest('button[aria-label="搜索"], button[aria-label="切换语言"]')
          
          if (!stillInSubmenu && !stillInHeader && !stillOnTriggerButton) {
            setActiveSubmenu(null)
          }
        } catch (error) {
          // 静默处理错误，避免在组件卸载时抛出异常
          console.warn('Mouse tracking error:', error)
        }
      }, 150) // 150ms延迟，给用户足够时间移动到submenu
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

  // 处理语言切换点击
  const handleLanguageClick = useCallback(() => {
    setActiveSubmenu('__language')
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

  // 语言导航项的子菜单配置
  const languageSubmenu = useMemo(() => ({
    title: '',
    description: '',
    items: []
  }), [])

  // 语言导航项 - 使用useMemo避免在渲染中创建新对象
  const languageNavigationItem = useMemo(() => ({
    type: '__language' as const,
    label: '语言',
    href: '#',
    submenu: languageSubmenu
  }), [languageSubmenu])


  return (
    <header 
      ref={navRef}
      className="sticky top-0 z-50 bg-white/95  backdrop-blur-sm shadow-sm border-b border-gray-200 "
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 主要内容区域 */}
        <div className="flex justify-between items-center h-16">
          {/* Logo区域 */}
          <div className="flex items-center">
            <Link 
              href="/" 
              className="text-xl font-bold text-gray-900  hover:text-gray-800  transition-colors"
            >
              {SITE_CONFIG.title}
            </Link>
          </div>
          
          {/* 右侧区域：导航菜单 + Action Bar */}
          <div className="flex items-center space-x-6">
            {/* 导航菜单 */}
            <nav ref={navItemsRef} className="hidden lg:flex" aria-label="主导航">
              <ul className="flex space-x-8">
                {navigationItems.map((item) => (
                  <li key={item.href} className="relative">
                    <NavItem 
                      item={item}
                      activeSubmenu={activeSubmenu}
                      onNavHover={handleNavHover}
                    />
                  </li>
                ))}
              </ul>
            </nav>

            {/* Action Bar */}
            <ul className="flex items-center space-x-2" role="toolbar" aria-label="操作工具栏">
              {/* 搜索功能 */}
              <li className="hidden md:block">
                <SearchBar onSearchClick={handleSearchClick} />
              </li>

              {/* 语言切换 */}
              <li>
                <LanguageToggle onLanguageClick={handleLanguageClick} />
              </li>

              {/* 移动端菜单按钮 */}
              <li className="lg:hidden">
                <button 
                  className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-all duration-200"
                  aria-label="打开移动端菜单"
                  aria-expanded="false"
                >
                  <MenuIcon className="h-6 w-6" />
                </button>
              </li>
            </ul>
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
              : activeSubmenu === '__language'
              ? languageNavigationItem
              : navigationItems.find(item => item.type === activeSubmenu) || searchNavigationItem
          }
        />
      )}
    </header>
  )
}
