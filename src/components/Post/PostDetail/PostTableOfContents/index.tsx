'use client'

import { useEffect, useRef, useState } from 'react'
import { useLayoutHeights } from '@/hooks'
import { cn, smoothScrollToElement } from '@/utils'
import type { PostHeading } from '../PostContent'
import styles from './PostTableOfContents.module.css'

interface PostTableOfContentsProps {
  headings: PostHeading[]
  className?: string
  onItemClick?: () => void
  variant?: 'plain' | 'floating'
}

export function PostTableOfContents({
  headings,
  className,
  onItemClick,
  variant = 'plain',
}: PostTableOfContentsProps) {
  const { headerHeight } = useLayoutHeights()
  const [activeId, setActiveId] = useState(headings[0]?.id ?? '')
  const observerLockedUntilRef = useRef(0)

  useEffect(() => {
    setActiveId((currentActiveId) => {
      if (headings.some((heading) => heading.id === currentActiveId)) {
        return currentActiveId
      }

      return headings[0]?.id ?? ''
    })
  }, [headings])

  useEffect(() => {
    if (headings.length === 0) {
      return undefined
    }

    const headingElements = headings
      .map((heading) => document.getElementById(heading.id))
      .filter((element): element is HTMLElement => element !== null)

    if (headingElements.length === 0) {
      return undefined
    }

    let ticking = false

    const getReadingLine = () => {
      if (window.innerWidth >= 768) {
        return headerHeight + 32
      }

      const mobileSticky = document.querySelector<HTMLElement>('[data-mobile-post-sticky]')
      return headerHeight + (mobileSticky?.offsetHeight ?? 0) + 24
    }

    const updateActiveHeading = () => {
      if (Date.now() < observerLockedUntilRef.current) {
        ticking = false
        return
      }

      const readingLine = getReadingLine()
      const nextActiveElement = headingElements.reduce<HTMLElement | null>(
        (currentActiveElement, headingElement) => {
          const headingTop = headingElement.getBoundingClientRect().top

          if (headingTop <= readingLine) {
            return headingElement
          }

          return currentActiveElement
        },
        headingElements[0] ?? null
      )

      if (nextActiveElement?.id) {
        setActiveId(nextActiveElement.id)
      }

      ticking = false
    }

    const handleScroll = () => {
      if (ticking) {
        return
      }

      ticking = true
      window.requestAnimationFrame(updateActiveHeading)
    }

    updateActiveHeading()
    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleScroll)
    }
  }, [headings, headerHeight])

  const getScrollOffset = () => {
    if (window.innerWidth >= 768) {
      return headerHeight + 16
    }

    return headerHeight + 72
  }

  const handleItemClick = (heading: PostHeading) => {
    const element = document.getElementById(heading.id)

    if (!element) {
      return
    }

    setActiveId(heading.id)
    observerLockedUntilRef.current = Date.now() + 900
    smoothScrollToElement(element, getScrollOffset())
    window.history.replaceState(null, '', `#${encodeURIComponent(heading.id)}`)
    window.setTimeout(() => {
      setActiveId(heading.id)
    }, 950)
    onItemClick?.()
  }

  if (headings.length === 0) {
    return null
  }

  return (
    <nav
      className={cn(
        styles.tableOfContents,
        variant === 'floating' && styles.floatingTableOfContents,
        className
      )}
      aria-label="文章目录"
    >
      <h2 className={styles.title}>目录</h2>
      <div className={styles.list}>
        {headings.map((heading) => (
          <button
            key={heading.id}
            type="button"
            title={heading.title}
            className={cn(
              styles.item,
              heading.level === 3 && styles.level3,
              heading.level === 4 && styles.level4,
              heading.id === activeId && styles.activeItem
            )}
            aria-current={heading.id === activeId ? 'location' : undefined}
            onClick={() => handleItemClick(heading)}
          >
            <span className={styles.text}>{heading.title}</span>
          </button>
        ))}
      </div>
    </nav>
  )
}
