'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { cn } from '@/utils'
import { useLayoutHeights } from '@/hooks'

interface StickyWrapperProps {
  children: React.ReactNode
}

export function StickyWrapper({ children }: StickyWrapperProps) {
  const [isSticky, setIsSticky] = useState(false)
  const [sectionHeight, setSectionHeight] = useState<number | null>(null)
  const sectionRef = useRef<HTMLDivElement>(null)
  const originalTopRef = useRef<number | null>(null)
  const { headerHeight } = useLayoutHeights()

  // 稳定的滚动处理函数
  const handleScroll = useCallback(() => {
    if (!sectionRef.current || !originalTopRef.current) return

    const scrollY = window.scrollY
    
    // 使用原始位置和当前滚动位置来判断
    const shouldBeSticky = scrollY > originalTopRef.current - headerHeight
    
    if (shouldBeSticky !== isSticky) {
      setIsSticky(shouldBeSticky)
    }
  }, [isSticky])

  useEffect(() => {
    // 初始化：记录原始位置和高度
    if (sectionRef.current) {
      const rect = sectionRef.current.getBoundingClientRect()
      originalTopRef.current = rect.top + window.scrollY - headerHeight
      setSectionHeight(rect.height)
    }

    // 添加滚动监听
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [handleScroll])

  return (
    <>
      {/* 占位div - 当组件变为sticky时保持布局稳定 */}
      {isSticky && sectionHeight && (
        <div 
          className="w-full"
          style={{ height: sectionHeight }}
          aria-hidden="true"
        />
      )}
      
      <div 
        ref={sectionRef}
        className={cn(
          "mb-12 transition-all duration-300 ease-in-out",
          isSticky && "fixed left-0 right-0 z-49 bg-white shadow-lg border-b border-gray-200"
        )}
        style={{ top: headerHeight }}
      >
        <div className={cn(
          isSticky && "max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4"
        )}>
          {children}
        </div>
      </div>
    </>
  )
}
