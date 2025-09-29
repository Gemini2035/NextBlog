'use client'

import { useTranslations } from 'next-intl'
import { StarIcon, StarFilledIcon } from '@/assets/icons'

interface FeaturedFilterProps {
  value: boolean | null
  onChange: (value: boolean | null) => void
}

export function FeaturedFilter({ value, onChange }: FeaturedFilterProps) {
  const t = useTranslations('PostFilter')
  
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
      return t('featuredOnly')
    } else if (value === false) {
      return t('nonFeaturedOnly')
    }
    return t('allPosts')
  }

  return (
    <button
      onClick={handleClick}
      className="flex items-center justify-center w-8 h-8 rounded-full transition-all duration-200 hover:bg-gray-100"
      title={getTooltip()}
    >
      {getIcon()}
    </button>
  )
}
