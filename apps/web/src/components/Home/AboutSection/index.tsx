'use client'

import HomeSectionSkeleton from '../HomeSectionSkeleton'
import { Link, Button } from '@/ui'
import { ArrowRightIcon } from '@/assets/icons'
import { useTranslations } from 'next-intl'
import type { SiteNavigationItem } from '@/types/site'

interface AboutSectionProps {
  index: number
  item: SiteNavigationItem
}

export default function AboutSection({ index, item }: AboutSectionProps) {
  const t = useTranslations('HomePage')
  const aboutDescription = item.description || 'Learn about my background, skills, experience and contact information'
  const submenuItems = item.items

  return (
    <HomeSectionSkeleton index={index}>
      <div className="max-w-3xl">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
          {t('aboutTitle', { default: '关于我' })}
        </h2>
        <p className="mt-4 sm:mt-6 text-base sm:text-lg lg:text-xl text-gray-600">
          {aboutDescription}
        </p>

        {/* 快速导航链接 */}
        {submenuItems.length > 0 && (
          <div className="mt-8 sm:mt-10">
            <div className="space-y-6">
              {submenuItems.map((item, itemIndex) => (
                <div key={itemIndex}>
                  {/* 父级链接 */}
                  <Link
                    href={item.href}
                    className="block text-lg font-semibold text-gray-900 hover:text-gray-600 transition-colors mb-3"
                  >
                    {item.label}
                  </Link>
                  
                  {/* 次级链接 */}
                  {item.items && item.items.length > 0 && (
                    <div className="flex flex-wrap gap-x-4 gap-y-2">
                      {item.items.map((subItem, subIndex) => (
                        <Link
                          key={subIndex}
                          href={subItem.href}
                          className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                        >
                          {subItem.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-6 sm:mt-8">
          <Link href={item.href}>
            <Button
              type="primary"
              size="sm"
              rounded={true}
              className="inline-flex items-center gap-2 bg-blue-900 text-white hover:bg-blue-800 focus-visible:outline-blue-900"
            >
              <span>{t('viewMore', { default: '了解更多' })}</span>
              <ArrowRightIcon className="w-4 h-4" strokeWidth={1.8} />
            </Button>
          </Link>
        </div>
      </div>
    </HomeSectionSkeleton>
  )
}

 
