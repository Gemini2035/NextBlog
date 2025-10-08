'use client'

import { useTranslations } from 'next-intl'
import { StarIcon, StarFilledIcon } from '@/assets/icons'

interface PinnedFilterProps {
  value: boolean | null
  onChange: (value: boolean | null) => void
}

/**
 * 置顶项目筛选器
 * 使用星星图标，和博客的FeaturedFilter逻辑一致
 */
export function PinnedFilter({ value, onChange }: PinnedFilterProps) {
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
      return <StarFilledIcon className="w-4 h-4 text-yellow-500" />
    } else if (value === false) {
      return <StarIcon className="w-4 h-4 text-gray-400" />
    }
    return <StarIcon className="w-4 h-4 text-gray-300" />
  }

  const getTooltip = () => {
    if (value === true) {
      return t('pinnedOnly')
    } else if (value === false) {
      return t('noPinned')
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

