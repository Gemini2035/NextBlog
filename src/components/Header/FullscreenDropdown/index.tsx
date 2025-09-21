'use client'

import { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { NavigationItem, LANGUAGES } from '@/constants'
import { useLanguage } from '@/hooks'
import { SearchIcon, CloseIcon } from '@/assets/icons'
import NestedMenuGroup from './NestedMenuGroup'

// 搜索模式组件
interface SearchModeProps {
  searchDisplayText: { title: string; description: string }
  itemVariants: any
}

function SearchMode({ searchDisplayText, itemVariants }: SearchModeProps) {
  return (
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
  )
}

// 语言选择模式组件
interface LanguageModeProps {
  currentLang: string
  onLanguageChange: (langCode: string) => void
  itemVariants: any
}

function LanguageMode({ currentLang, onLanguageChange, itemVariants }: LanguageModeProps) {
  return (
    <motion.div 
      className="w-full" 
      variants={itemVariants}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <ul className="space-y-2" role="listbox" aria-label="语言选择">
        {LANGUAGES.map((lang, index) => (
          <motion.li 
            key={lang.code}
            variants={itemVariants}
            transition={{ duration: 0.6, ease: "easeOut", delay: index * 0.03 }}
          >
            <button
              onClick={() => onLanguageChange(lang.code)}
              className="w-full flex items-center px-4 py-3 text-left rounded-lg hover:bg-gray-50 text-gray-900"
              role="option"
              aria-selected={currentLang === lang.code}
            >
              <span className="text-sm font-bold">
                {currentLang === lang.code 
                  ? `${lang.nativeName} ✓` 
                  : `${lang.nativeName} (${lang.translations[currentLang as keyof typeof lang.translations]})`
                }
              </span>
            </button>
          </motion.li>
        ))}
      </ul>
    </motion.div>
  )
}

// 普通导航模式组件
interface NavigationModeProps {
  navigationItem: NavigationItem
  onClose: () => void
  itemVariants: any
}

function NavigationMode({ navigationItem, onClose, itemVariants }: NavigationModeProps) {
  return (
    <motion.div 
      className="mb-8" 
      variants={itemVariants}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <NestedMenuGroup 
        items={navigationItem.submenu?.items || []} 
        onClose={onClose}
        isAnimating={true}
      />
    </motion.div>
  )
}

interface FullscreenDropdownProps {
  isOpen: boolean
  onClose: () => void
  navigationItem: NavigationItem
}

// 动画变体定义
const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 }
}

// 容器动画：从上方向下移动
const containerVariants = {
  hidden: { 
    opacity: 0, 
    y: -50, 
    scale: 0.95 
  },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1
  },
  exit: { 
    opacity: 0, 
    y: -50, 
    scale: 0.95
  }
}

// 内容动画：纯淡入淡出
const contentVariants = {
  hidden: { 
    opacity: 0
  },
  visible: { 
    opacity: 1
  },
  exit: { 
    opacity: 0
  }
}

// 子项动画：纯淡入淡出
const itemVariants = {
  hidden: { 
    opacity: 0
  },
  visible: { 
    opacity: 1
  }
}

export default function FullscreenDropdown({ 
  isOpen, 
  onClose, 
  navigationItem
}: FullscreenDropdownProps) {

  // 导航切换状态
  const [currentNavigationItem, setCurrentNavigationItem] = useState(navigationItem)
  
  // 使用ref来引用submenu元素，避免在异步回调中查询DOM
  const submenuRef = useRef<HTMLDivElement>(null)

  // 判断是否为搜索模式
  const isSearchMode = currentNavigationItem.type === '__search'
  
  // 判断是否为语言选择模式
  const isLanguageMode = currentNavigationItem.type === '__language'

  // 语言选择的状态
  const { currentLang, changeLanguage } = useLanguage()

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

  // 处理语言选择
  const handleLanguageChange = useCallback((langCode: string) => {
    changeLanguage(langCode)
    onClose()
  }, [changeLanguage, onClose])

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

  // 处理导航项切换
  useEffect(() => {
    if (isOpen) {
      setCurrentNavigationItem(navigationItem)
    }
  }, [navigationItem, isOpen])

  // 处理背景遮罩点击
  const handleBackgroundClick = useCallback(() => {
    onClose()
  }, [onClose])

  // 搜索模式下的标题和描述
  const title = isSearchMode ? '搜索文章' : currentNavigationItem.submenu?.title || currentNavigationItem.label
  const description = isSearchMode ? '输入关键词搜索相关文章' : currentNavigationItem.submenu?.description

  // 搜索模式下的显示文本 - 使用useMemo避免重复计算
  const searchDisplayText = useMemo(() => {
    const trimmedQuery = query.trim()
    return {
      title: trimmedQuery ? '搜索功能开发中' : '开始搜索',
      description: trimmedQuery ? '搜索功能即将上线，敬请期待' : '输入关键词搜索相关文章'
    }
  }, [query])


  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* 背景遮罩 */}
          <motion.div 
            className="absolute left-0 top-full w-full h-screen inset-0 bg-white/90 backdrop-blur-xl z-40"
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ duration: 0.3 }}
            onClick={handleBackgroundClick}
            onMouseEnter={handleBackgroundClick}
          />
          
          {/* 全屏下拉菜单 */}
          <motion.div 
            ref={submenuRef}
            className="absolute w-full top-full bg-white shadow-2xl z-50 border-gray-200 max-h-[80vh] overflow-y-auto"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ 
              duration: 0.4, 
              ease: [0.25, 0.46, 0.45, 0.94] // 自定义缓动曲线，更自然的移动
            }}
            data-submenu
            onMouseEnter={(e) => {
              // 阻止事件冒泡，确保submenu保持打开
              e.stopPropagation()
            }}
            onMouseLeave={(e) => {
              // 使用延迟检查，避免快速鼠标移动导致的意外关闭
              setTimeout(() => {
                // 使用ref来获取元素，避免DOM查询
                if (!submenuRef.current) return
                
                const rect = submenuRef.current.getBoundingClientRect()
                const x = e.clientX
                const y = e.clientY
                
                // 检查鼠标是否真的在submenu区域外，并增加一些容错范围
                const tolerance = 10 // 增加10px的容错范围
                if (x < rect.left - tolerance || x > rect.right + tolerance || 
                    y < rect.top - tolerance || y > rect.bottom + tolerance) {
                  // 再次检查鼠标是否在submenu或其父元素内
                  try {
                    const elementUnderMouse = document.elementFromPoint(x, y)
                    if (!elementUnderMouse) return
                    
                    const isInSubmenu = elementUnderMouse.closest('[data-submenu]')
                    const isInHeader = elementUnderMouse.closest('header')
                    
                    if (!isInSubmenu && !isInHeader) {
                      onClose()
                    }
                  } catch (error) {
                    // 静默处理错误，避免在组件卸载时抛出异常
                    console.warn('Submenu mouse tracking error:', error)
                  }
                }
              }, 100) // 100ms延迟，给鼠标足够时间移动到submenu内
            }}
          >
            <motion.div 
              className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6"
              variants={contentVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ 
                duration: 0.5, 
                ease: "easeOut", 
                staggerChildren: 0.08,
                delayChildren: 0.1 // 减少延迟，让内容更快开始淡入
              }}
              key={currentNavigationItem.type}
            >
              {/* 标题区域 - 仅在非语言模式下显示 */}
              {!isLanguageMode && (
                <motion.div 
                  className="text-left mb-8" 
                  variants={itemVariants}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                >
                  <div className="flex items-baseline gap-4">
                    <motion.h2 
                      className="text-2xl font-bold text-gray-900"
                      variants={itemVariants}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                    >
                      {title || currentNavigationItem.label}
                    </motion.h2>
                    {description && (
                      <motion.p 
                        className="text-base text-gray-600"
                        variants={itemVariants}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                      >
                        {description}
                      </motion.p>
                    )}
                  </div>
                </motion.div>
              )}

              {/* 搜索框区域 - 仅在搜索模式下显示 */}
              {isSearchMode && (
                <motion.div 
                  className="max-w-2xl mx-auto mb-8" 
                  variants={itemVariants}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                >
              <div className="flex items-center bg-gray-100 rounded-full px-6 py-4">
                <SearchIcon className="h-5 w-5 text-gray-500 mr-4 flex-shrink-0" />
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="搜索文章..."
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
              )}

              {/* 内容区域 */}
              {isSearchMode && (
                <SearchMode 
                  searchDisplayText={searchDisplayText}
                  itemVariants={itemVariants}
                />
              )}
              
              {isLanguageMode && (
                <LanguageMode 
                  currentLang={currentLang}
                  onLanguageChange={handleLanguageChange}
                  itemVariants={itemVariants}
                />
              )}
              
              {!isSearchMode && !isLanguageMode && (
                <NavigationMode 
                  navigationItem={currentNavigationItem}
                  onClose={onClose}
                  itemVariants={itemVariants}
                />
              )}

            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}