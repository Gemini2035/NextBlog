'use client'

import { useEffect } from 'react'
import { useLayoutHeights } from './useLayoutHeights'
import { smoothScrollToElement } from '@/utils'

interface UseAnchorScrollOptions {
  /** 锚点ID */
  anchorId: string
  /** 额外的偏移量，默认为10px */
  extraOffset?: number
  /** 滚动延迟，默认为100ms */
  delay?: number
}

/**
 * 处理锚点跳转时的滚动偏移，避免标题被header遮挡
 */
export function useAnchorScroll({ 
  anchorId, 
  extraOffset = 10, 
  delay = 100 
}: UseAnchorScrollOptions) {
  const { headerHeight } = useLayoutHeights()

  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === `#${anchorId}`) {
        setTimeout(() => {
          const element = document.getElementById(anchorId)
          if (element) {
            smoothScrollToElement(element, headerHeight + extraOffset)
          }
        }, delay)
      }
    }

    // 监听hash变化
    window.addEventListener('hashchange', handleHashChange)
    
    // 页面加载时检查hash
    handleHashChange()

    return () => {
      window.removeEventListener('hashchange', handleHashChange)
    }
  }, [anchorId, headerHeight, extraOffset, delay])
}
