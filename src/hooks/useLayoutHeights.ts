'use client'

import { useState } from 'react'
import { useIsomorphicLayoutEffect } from './useIsomorphicLayoutEffect'

interface LayoutHeights {
  headerHeight: number
  footerHeight: number
  totalLayoutHeight: number
}

/**
 * Hook to get the heights of header and footer elements
 * @returns Object containing header height, footer height, and total layout height
 */
export function useLayoutHeights(): LayoutHeights {
  const [heights, setHeights] = useState<LayoutHeights>({
    headerHeight: 0,
    footerHeight: 0,
    totalLayoutHeight: 0
  })

  useIsomorphicLayoutEffect(() => {
    const measureHeights = () => {
      const header = document.querySelector('header')
      const footer = document.querySelector('footer')
      
      const headerHeight = header ? header.offsetHeight : 0
      const footerHeight = footer ? footer.offsetHeight : 0
      
      setHeights((currentHeights) => {
        const nextHeights = {
          headerHeight,
          footerHeight,
          totalLayoutHeight: headerHeight + footerHeight
        }

        if (
          currentHeights.headerHeight === nextHeights.headerHeight &&
          currentHeights.footerHeight === nextHeights.footerHeight &&
          currentHeights.totalLayoutHeight === nextHeights.totalLayoutHeight
        ) {
          return currentHeights
        }

        return nextHeights
      })
    }

    const resizeObserver = new ResizeObserver(measureHeights)
    let observedHeader: Element | null = null
    let observedFooter: Element | null = null

    const observeLayoutElements = () => {
      const header = document.querySelector('header')
      const footer = document.querySelector('footer')

      if (header === observedHeader && footer === observedFooter) {
        return
      }

      resizeObserver.disconnect()
      observedHeader = header
      observedFooter = footer

      if (header) {
        resizeObserver.observe(header)
      }

      if (footer) {
        resizeObserver.observe(footer)
      }
    }

    // 初始测量
    measureHeights()
    observeLayoutElements()

    // 监听窗口大小变化
    window.addEventListener('resize', measureHeights)

    // 使用 MutationObserver 监听 header/footer 节点替换
    const observer = new MutationObserver(() => {
      measureHeights()
      observeLayoutElements()
    })

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    })

    return () => {
      window.removeEventListener('resize', measureHeights)
      resizeObserver.disconnect()
      observer.disconnect()
    }
  }, [])

  return heights
}
