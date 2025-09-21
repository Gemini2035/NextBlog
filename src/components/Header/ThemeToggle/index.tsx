'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

interface ThemeToggleProps {
  onCloseSubmenu?: () => void
}

export default function ThemeToggle({ onCloseSubmenu }: ThemeToggleProps) {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // 确保组件已挂载
  useEffect(() => {
    setMounted(true)
  }, [])

  // 防止水合不匹配，显示默认状态
  if (!mounted) {
    return (
      <button
        className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
        aria-label="切换主题模式"
      >
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      </button>
    )
  }

  // 获取主题标签
  const getThemeLabel = (currentTheme: string | undefined): string => {
    switch (currentTheme) {
      case 'light':
        return '切换到深色模式'
      case 'dark':
        return '切换到跟随系统模式'
      case 'system':
        return '切换到浅色模式'
      default:
        return '切换主题模式'
    }
  }

  // 获取当前显示的图标
  const getCurrentIcon = () => {
    switch (theme) {
      case 'light':
        // 太阳图标 - 浅色模式
        return (
          <svg 
            className="h-5 w-5" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" 
            />
          </svg>
        )
      case 'dark':
        // 月亮图标 - 深色模式
        return (
          <svg 
            className="h-5 w-5" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" 
            />
        </svg>
        )
      case 'system':
        // 显示器图标 - 跟随系统模式
        return (
          <svg 
            className="h-5 w-5" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" 
            />
          </svg>
        )
      default:
        return null
    }
  }

  // 处理主题切换点击
  const handleThemeToggle = () => {
    // 切换到下一个主题模式
    if (theme === 'light') {
      setTheme('dark')
    } else if (theme === 'dark') {
      setTheme('system')
    } else {
      setTheme('light')
    }
    
    // 如果有关闭submenu的函数，则调用它
    if (onCloseSubmenu) {
      onCloseSubmenu()
    }
  }

  return (
    <button
      onClick={handleThemeToggle}
      className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
      aria-label={getThemeLabel(theme)}
      title={`当前模式: ${theme === 'system' ? '跟随系统' : theme === 'light' ? '浅色' : '深色'}`}
    >
      {getCurrentIcon()}
    </button>
  )
}