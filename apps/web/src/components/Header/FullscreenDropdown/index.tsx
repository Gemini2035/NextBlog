'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence, Variants } from 'framer-motion'
import type { SiteNavigationItem } from '@/types/site'
import { useLanguage } from '@/hooks'
import NestedMenuGroup from './NestedMenuGroup'
import SearchDropdown from '../Search/SearchDropdown'
import { LanguageMode } from '../LanguageToggle'


// 普通导航模式组件
interface NavigationModeProps {
  navigationItem: SiteNavigationItem
  onClose: () => void
  itemVariants: Variants
  isExiting?: boolean
}

function NavigationMode({ navigationItem, onClose, itemVariants, isExiting = false }: NavigationModeProps) {
  return (
    <motion.div 
      className="mb-8" 
      variants={itemVariants}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <NestedMenuGroup 
        items={navigationItem.items} 
        onClose={onClose}
        isAnimating={true}
        isExiting={isExiting}
      />
    </motion.div>
  )
}

interface FullscreenDropdownProps {
  isOpen: boolean
  onClose: () => void
  navigationItem: SiteNavigationItem
  isExiting?: boolean
  onAnimationComplete?: () => void
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
  navigationItem,
  isExiting = false,
  onAnimationComplete
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

  // 处理语言选择
  const handleLanguageChange = useCallback((langCode: string) => {
    changeLanguage(langCode)
    onClose()
  }, [changeLanguage, onClose])


  // 处理导航项切换
  useEffect(() => {
    if (isOpen) {
      setCurrentNavigationItem(navigationItem)
    }
  }, [navigationItem, isOpen])

  // 处理退出动画完成
  useEffect(() => {
    if (isExiting && onAnimationComplete) {
      const timer = setTimeout(() => {
        onAnimationComplete()
      }, 250) // 与退出动画持续时间匹配
      
      return () => clearTimeout(timer)
    }
  }, [isExiting, onAnimationComplete])

  // 处理关闭
  const handleClose = useCallback(() => {
    onClose()
  }, [onClose])

  // 处理子菜单鼠标离开事件
  const handleSubmenuMouseLeave = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
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
            handleClose()
          }
        } catch {
          // 静默处理错误，避免在组件卸载时抛出异常
        }
      }
    }, 100) // 100ms延迟，给鼠标足够时间移动到submenu内
  }, [handleClose])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* 背景遮罩 */}
          <motion.div 
            className="absolute left-0 top-full w-full h-screen bg-white/90 backdrop-blur-xl z-40"
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ duration: 0.3 }}
          />
          
          {/* 全屏下拉菜单 */}
          <motion.div 
            ref={submenuRef}
            className="absolute w-full top-full bg-white shadow-2xl z-50 border-gray-200 max-h-[80vh] overflow-y-auto"
            variants={containerVariants}
            initial="hidden"
            animate={isExiting ? "exit" : "visible"}
            transition={{ 
              duration: isExiting ? 0.2 : 0.4, 
              ease: isExiting ? "easeIn" : [0.25, 0.46, 0.45, 0.94] // 退出时使用更快的动画
            }}
            data-submenu
            onMouseEnter={(e: React.MouseEvent<HTMLDivElement>) => {
              // 阻止事件冒泡，确保submenu保持打开
              e.stopPropagation()
            }}
            onMouseLeave={handleSubmenuMouseLeave}
          >
            <motion.div 
              id="header-submenu-container"
              className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6"
              variants={contentVariants}
              initial="hidden"
              animate={isExiting ? "exit" : "visible"}
              transition={{ 
                duration: isExiting ? 0.2 : 0.5, 
                ease: isExiting ? "easeIn" : "easeOut", 
                staggerChildren: isExiting ? 0.02 : 0.08,
                delayChildren: isExiting ? 0 : 0.1 // 退出时立即开始动画
              }}
              key={currentNavigationItem.type}
            >
              {/* 标题区域 - 仅在非语言模式和非搜索模式下显示 */}
              {!isLanguageMode && !isSearchMode && (
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
                      {currentNavigationItem.label}
                    </motion.h2>
                    {currentNavigationItem.description && (
                      <motion.p 
                        className="text-base text-gray-600"
                        variants={itemVariants}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                      >
                        {currentNavigationItem.description}
                      </motion.p>
                    )}
                  </div>
                </motion.div>
              )}


              {/* 内容区域 */}
              {isSearchMode && (
                <SearchDropdown 
                  itemVariants={itemVariants}
                  isOpen={isOpen}
                  onClose={onClose}
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
                  onClose={handleClose}
                  itemVariants={itemVariants}
                  isExiting={isExiting}
                />
              )}

            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
