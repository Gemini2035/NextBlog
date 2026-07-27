'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useLayoutHeights } from './useLayoutHeights'
import { useIsomorphicLayoutEffect } from './useIsomorphicLayoutEffect'

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
  const scrollYRef = useRef(0)
  const smoothScrollYRef = useRef(0)
  const animationFrameRef = useRef<number | null>(null)

  // 客户端挂载检测
  useIsomorphicLayoutEffect(() => {
    if (window.scrollY > 0) {
      window.scrollTo({ top: 0, behavior: 'instant' })
    }

    setIsClient(true)
  }, [])

  const startSmoothScroll = useCallback(() => {
    if (animationFrameRef.current !== null) return

    const updateSmoothScroll = () => {
      setSmoothScrollY((prev) => {
        const diff = scrollYRef.current - prev

        if (Math.abs(diff) < 0.5) {
          smoothScrollYRef.current = scrollYRef.current
          return scrollYRef.current
        }

        const easingFactor = Math.abs(diff) > 10 ? 0.15 : 0.08
        const next = prev + diff * easingFactor
        smoothScrollYRef.current = next
        return next
      })

      if (Math.abs(scrollYRef.current - smoothScrollYRef.current) < 0.5) {
        animationFrameRef.current = null
        return
      }

      animationFrameRef.current = requestAnimationFrame(updateSmoothScroll)
    }

    animationFrameRef.current = requestAnimationFrame(updateSmoothScroll)
  }, [])

  useEffect(() => {
    if (!isClient) return

    let ticking = false

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const currentScrollY = window.scrollY
          scrollYRef.current = currentScrollY
          setScrollY(currentScrollY)
          setIsScrolling(currentScrollY > threshold)
          startSmoothScroll()
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()

    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current)
        animationFrameRef.current = null
      }
    }
  }, [threshold, isClient, startSmoothScroll])

  // 计算渐进式高度 - 基于滚动距离的平滑过渡
  const calculateHeight = () => {
    // 服务端渲染时返回固定高度，避免水合不匹配
    if (!isClient || typeof window === 'undefined') {
      return 600 // 服务端默认高度
    }
    
    const viewportHeight = window.innerHeight
    // 确保 headerHeight 有值，如果没有则使用默认值
    const safeHeaderHeight = headerHeight > 0 ? headerHeight : 64
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
