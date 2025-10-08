'use client'

import { useTranslations } from 'next-intl'
import { ArchiveIcon } from '@/assets/icons'

interface ArchivedFilterProps {
  value: boolean | null
  onChange: (value: boolean | null) => void
}

/**
 * 归档项目筛选器
 * 使用归档图标
 */
export function ArchivedFilter({ value, onChange }: ArchivedFilterProps) {
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
      return <ArchiveIcon className="w-4 h-4 text-gray-600" />
    } else if (value === false) {
      return <ArchiveIcon className="w-4 h-4 text-gray-400" />
    }
    return <ArchiveIcon className="w-4 h-4 text-gray-300" />
  }

  const getTooltip = () => {
    if (value === true) {
      return t('archivedOnly')
    } else if (value === false) {
      return t('noArchived')
    }
    return t('allProjects')
  }

  return (
    <button
      onClick={handleClick}
      className="flex items-center justify-center w-8 h-8 rounded-full transition-all duration-200 hover:bg-gray-100 cursor-pointer"
      title={getTooltip()}
    >
      {getIcon()}
    </button>
  )
}

