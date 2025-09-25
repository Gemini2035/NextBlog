import { useState, useEffect } from 'react'

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

  useEffect(() => {
    const measureHeights = () => {
      const header = document.querySelector('header')
      const footer = document.querySelector('footer')
      
      const headerHeight = header ? header.offsetHeight : 0
      const footerHeight = footer ? footer.offsetHeight : 0
      
      setHeights({
        headerHeight,
        footerHeight,
        totalLayoutHeight: headerHeight + footerHeight
      })
    }

    // 初始测量
    measureHeights()

    // 监听窗口大小变化
    window.addEventListener('resize', measureHeights)

    // 使用 MutationObserver 监听 DOM 变化
    const observer = new MutationObserver(() => {
      measureHeights()
    })

    // 开始观察整个文档的变化
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class', 'style']
    })

    return () => {
      window.removeEventListener('resize', measureHeights)
      observer.disconnect()
    }
  }, [])

  return heights
}
