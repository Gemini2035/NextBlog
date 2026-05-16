'use client'

import HomeSectionSkeleton from '../HomeSectionSkeleton'
import { Link, Button } from '@/ui'
import { ArrowRightIcon } from '@/assets/icons'
import { useTranslations } from 'next-intl'
import { NAVIGATION_ITEMS } from '@/constants'

interface ProjectsSectionProps {
  index: number
  href: string
}

export default function ProjectsSection({ index, href }: ProjectsSectionProps) {
  const t = useTranslations('HomePage')
  const navT = useTranslations('Navigation')
  
  // 获取projects section的导航配置
  const projectsNav = NAVIGATION_ITEMS.find(item => item.type === '__projects')
  const projectsDescription = projectsNav?.submenu?.description || 'Showcase my technical projects and portfolio'

  return (
    <HomeSectionSkeleton index={index}>
      <div className="max-w-3xl">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
          {t('projectsTitle', { default: '项目' })}
        </h2>
        <p className="mt-4 sm:mt-6 text-base sm:text-lg lg:text-xl text-gray-600">
          {navT(projectsDescription, { default: projectsDescription })}
        </p>

        <div className="mt-8 sm:mt-10">
          <Link href={href}>
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
