'use client'

import HomeSectionSkeleton from '../HomeSectionSkeleton'
import { Link, Button } from '@/ui'
import { ArrowRightIcon } from '@/assets/icons'
import { useTranslations } from 'next-intl'
import type { SiteNavigationItem } from '@/types/site'

interface ProjectsSectionProps {
  index: number
  item: SiteNavigationItem
}

export default function ProjectsSection({ index, item }: ProjectsSectionProps) {
  const t = useTranslations('HomePage')
  const { description, href, items } = item
  const projectsDescription = description || 'Showcase my technical projects and portfolio'
  const submenuItems = items

  return (
    <HomeSectionSkeleton index={index}>
      <div className="max-w-3xl">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[var(--site-text)]">
          {t('projectsTitle', { default: '项目' })}
        </h2>
        <p className="mt-4 sm:mt-6 text-base sm:text-lg lg:text-xl text-[var(--site-text-muted)]">
          {projectsDescription}
        </p>

        {submenuItems.length > 0 && (
          <div className="mt-8 sm:mt-10">
            <div className="space-y-6">
              {submenuItems.map(({ href, label, items }, itemIndex) => (
                <div key={itemIndex}>
                  <Link
                    href={href}
                    className="block text-[17px] font-semibold text-[var(--site-text)] hover:text-[var(--site-action)] transition-colors mb-3"
                  >
                    {label}
                  </Link>

                  {items && items.length > 0 && (
                    <div className="flex flex-wrap gap-x-4 gap-y-2">
                      {items.map(({ href, label }, subIndex) => (
                        <Link
                          key={subIndex}
                          href={href}
                          className="text-sm text-[var(--site-text-muted)] hover:text-[var(--site-action)] transition-colors"
                        >
                          {label}
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
          <Link href={href}>
            <Button
              type="primary"
              size="sm"
              rounded={true}
              className="inline-flex items-center gap-2 rounded-[var(--site-radius-control)] border border-[var(--site-action)] bg-[var(--site-action)] text-white hover:bg-[var(--site-action)] focus-visible:outline-[var(--site-focus-ring)]"
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
