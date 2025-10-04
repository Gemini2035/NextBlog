'use client'

import { useState, useEffect } from 'react'
import { useLayoutHeights } from './useLayoutHeights'

export interface ScrollParallaxOptions {
  threshold?: number
  maxHeight?: number
  minHeight?: number
}

export function useScrollParallax(options: ScrollParallaxOptions = {}) {
  const { threshold = 200, maxHeight = 100, minHeight = 0 } = options
  const [scrollY, setScrollY] = useState(0)
  const [isScrolling, setIsScrolling] = useState(false)
  const [smoothScrollY, setSmoothScrollY] = useState(0)
  const [isClient, setIsClient] = useState(false)
  const { headerHeight } = useLayoutHeights()

  // 客户端挂载检测
  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (!isClient) return

    let ticking = false
    let animationFrame: number

    // 初始化时确保滚动位置正确
    const initializeScroll = () => {
      if (window.scrollY > 0) {
        window.scrollTo(0, 0)
      }
    }

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const currentScrollY = window.scrollY
          setScrollY(currentScrollY)
          setIsScrolling(currentScrollY > threshold)
          ticking = false
        })
        ticking = true
      }
    }

    // 平滑滚动值更新 - 使用更智能的缓动
    const updateSmoothScroll = () => {
      setSmoothScrollY(prev => {
        const diff = scrollY - prev
        const easingFactor = Math.abs(diff) > 10 ? 0.15 : 0.08 // 根据滚动速度调整缓动
        return prev + diff * easingFactor
      })
      animationFrame = requestAnimationFrame(updateSmoothScroll)
    }

    // 初始化滚动位置
    initializeScroll()
    
    window.addEventListener('scroll', handleScroll, { passive: true })
    updateSmoothScroll()

    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (animationFrame) {
        cancelAnimationFrame(animationFrame)
      }
    }
  }, [threshold, isClient, scrollY])

  // 计算渐进式高度 - 基于滚动距离的平滑过渡
  const calculateHeight = () => {
    // 服务端渲染时返回固定高度，避免水合不匹配
    if (!isClient || typeof window === 'undefined') {
      return 600 // 服务端默认高度
    }
    
    const viewportHeight = window.innerHeight
    // 确保 headerHeight 有值，如果没有则使用默认值
    const safeHeaderHeight = headerHeight > 0 ? headerHeight : 80
    const availableHeight = viewportHeight - safeHeaderHeight // 100vh - headerHeight
    const isMobile = window.innerWidth < 768
    
    // 初始高度为可用高度的100%（即 100vh - headerHeight）
    const initialHeightPx = availableHeight
    // 最小高度为可用高度的30-40%
    const minHeightRatio = isMobile ? 0.4 : 0.3
    const minHeightPx = availableHeight * minHeightRatio
    
    if (smoothScrollY <= 0) return initialHeightPx
    
    // 使用缓动函数实现平滑过渡
    const progress = Math.min(smoothScrollY / threshold, 1)
    const easeOutCubic = 1 - Math.pow(1 - progress, 3)
    
    return initialHeightPx - (initialHeightPx - minHeightPx) * easeOutCubic
  }

  // 计算视差效果的高度
  const parallaxHeight = Math.max(
    minHeight,
    Math.min(maxHeight, maxHeight - (scrollY / 2))
  )

  // 计算透明度 - 更平滑的过渡
  const opacity = Math.max(0.1, 1 - smoothScrollY / (threshold * 1.5))

  // 计算当前高度
  const currentHeight = calculateHeight()

  return {
    scrollY,
    isScrolling,
    parallaxHeight,
    opacity,
    progress: Math.min(1, scrollY / threshold),
    currentHeight,
    isClient
  }
}
