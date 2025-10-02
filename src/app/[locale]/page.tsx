'use client'

import { useTranslations } from 'next-intl'
import { useNavigation, useScrollParallax } from '@/hooks'
import SectionSwitch from '@/components/Home/SectionSwitch'
import HomeSectionSkeleton from '@/components/Home/HomeSectionSkeleton'
import { SITE_CONFIG } from '@/constants'
import { useRef, useCallback, useEffect } from 'react'

export default function Home() {
  const t = useTranslations('HomePage')
  const { navigationItems } = useNavigation()
  const { scrollY, isScrolling, parallaxHeight, opacity, currentHeight, isClient } = useScrollParallax({
    threshold: 400,
    maxHeight: 100,
    minHeight: 0
  })

  // 过滤掉非内容型导航（如搜索、语言）
  const contentNavs = navigationItems.filter(item => item.type !== '__search' && item.type !== '__language')
  const getNav = (type: string) => contentNavs.find(n => n.type === type)

  const sections = [
    getNav('__blog'),
    getNav('__about'),
    getNav('__projects'),
    getNav('__resources')
  ].filter(Boolean) as Array<{ type: '__blog' | '__about' | '__projects' | '__resources'; href: string }>

  // 获取博客区域的引用
  const blogSectionRef = useRef<HTMLDivElement>(null)

  // 确保页面首次加载时滚动到顶部
  useEffect(() => {
    if (isClient && window.scrollY > 0) {
      window.scrollTo(0, 0)
    }
  }, [isClient])

  // 平滑滚动到博客区域
  const scrollToBlogSection = useCallback(() => {
    if (blogSectionRef.current) {
      blogSectionRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      })
    }
  }, [])

  return (
    <div className="relative">
      {/* Hero Section with Parallax Effect */}
      <section 
        className="relative flex items-center justify-center overflow-hidden will-change-transform cursor-pointer hover:bg-gradient-to-br hover:from-blue-100 hover:via-white hover:to-purple-100 transition-all duration-300 active:scale-[0.98] touch-manipulation"
        style={{
          height: isClient ? `${currentHeight}px` : '600px',
          minHeight: isClient ? `${currentHeight}px` : '600px',
          paddingTop: isScrolling ? '2rem' : '0',
          paddingBottom: isScrolling ? '2rem' : '0',
          transition: isClient ? 'height 0.1s ease-out, padding 0.3s ease-out' : 'none'
        }}
        onClick={scrollToBlogSection}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            scrollToBlogSection()
          }
        }}
        aria-label={t('scrollToBlog')}
      >
        {/* Background with parallax effect */}
        <div 
          className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 transition-opacity duration-500"
          style={{ opacity }}
        />
        
        {/* Content */}
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h1 
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900 will-change-transform"
            style={{
              transform: isScrolling ? 'scale(1)' : `scale(${1 + scrollY * 0.0003})`,
              opacity: opacity,
              transition: 'transform 0.1s ease-out, opacity 0.3s ease-out'
            }}
          >
            {t('welcome', { siteTitle: SITE_CONFIG.title })}
          </h1>
          <p 
            className="mt-4 sm:mt-6 text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto will-change-transform"
            style={{
              transform: isScrolling ? 'translateY(0)' : `translateY(${scrollY * 0.2}px)`,
              opacity: opacity,
              transition: 'transform 0.1s ease-out, opacity 0.3s ease-out'
            }}
          >
            {t('description')}
          </p>
          
          {/* 点击提示 */}
          <div 
            className="mt-8 sm:mt-12 flex items-center justify-center text-sm text-gray-500 will-change-transform"
            style={{
              transform: isScrolling ? 'translateY(0)' : `translateY(${scrollY * 0.1}px)`,
              opacity: opacity * 0.8,
              transition: 'transform 0.1s ease-out, opacity 0.3s ease-out'
            }}
          >
            <span 
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 backdrop-blur-sm border border-gray-200/50"
              style={{
                animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
              }}
            >
              <span>{t('continue')}</span>
              <svg 
                className="w-4 h-4" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </div>
        </div>
      </section>

      {/* Full-bleed Sections */}
      <div className="relative z-20">
        {sections.length === 0 ? (
          <HomeSectionSkeleton index={0} />
        ) : (
          sections.map((item, idx) => {
            // 为博客区域添加引用
            if (item.type === '__blog') {
              return (
                <div key={item.type} ref={blogSectionRef}>
                  <SectionSwitch item={item} index={idx} />
                </div>
              )
            }
            return (
              <SectionSwitch key={item.type} item={item} index={idx} />
            )
          })
        )}
      </div>
    </div>
  )
}