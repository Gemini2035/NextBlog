'use client'

import { useTranslations } from 'next-intl'
import { ProjectIcon } from '@/assets/icons'

interface OwnedFilterProps {
  value: boolean | null
  onChange: (value: boolean | null) => void
}

/**
 * 我创建的项目筛选器
 * 筛选非Fork的项目
 */
export function OwnedFilter({ value, onChange }: OwnedFilterProps) {
  const t = useTranslations('ProjectFilter')
  
  const handleClick = () => {
    // 循环切换: null -> true -> false -> null
    if (value === null) {
      onChange(true)
    } else if (value === true) {
      onChange(false)
    } else {
      onChange(null)
    }
  }

  const getIcon = () => {
    if (value === true) {
      return <ProjectIcon className="w-4 h-4 text-[var(--site-action)]" />
    } else if (value === false) {
      return <ProjectIcon className="w-4 h-4 text-[var(--site-text-tertiary)]" />
    }
    return <ProjectIcon className="w-4 h-4 text-[var(--site-border)]" />
  }

  const getTooltip = () => {
    if (value === true) {
      return t('ownedOnly')
    } else if (value === false) {
      return t('noOwned')
    }
    return t('allProjects')
  }

  return (
    <button
      onClick={handleClick}
      className="flex items-center justify-center w-8 h-8 rounded-[var(--site-radius-control)] transition-all duration-200 hover:bg-[var(--site-canvas-muted)] cursor-pointer"
      title={getTooltip()}
    >
      {getIcon()}
    </button>
  )
}
