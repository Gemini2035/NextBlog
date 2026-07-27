'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useIsomorphicLayoutEffect } from './useIsomorphicLayoutEffect'

export interface ScrollParallaxOptions {
  threshold?: number
}

export function useScrollParallax(options: ScrollParallaxOptions = {}) {
  const { threshold = 200 } = options
  const [scrollY, setScrollY] = useState(0)
  const [isScrolling, setIsScrolling] = useState(false)
  const [smoothScrollY, setSmoothScrollY] = useState(0)
  const [isClient, setIsClient] = useState(false)
  const scrollYRef = useRef(0)
  const smoothScrollYRef = useRef(0)
  const animationFrameRef = useRef<number | null>(null)

  // 客户端挂载检测
  useIsomorphicLayoutEffect(() => {
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

  // 计算透明度 - 更平滑的过渡
  const opacity = Math.max(0.1, 1 - smoothScrollY / (threshold * 1.5))

  return {
    scrollY,
    isScrolling,
    opacity,
    progress: Math.min(1, scrollY / threshold),
    isClient
  }
}
