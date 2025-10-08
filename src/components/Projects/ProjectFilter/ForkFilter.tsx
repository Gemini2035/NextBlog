'use client'

import { useTranslations } from 'next-intl'
import { ForkIcon } from '@/assets/icons'

interface ForkFilterProps {
  value: boolean | null
  onChange: (value: boolean | null) => void
}

/**
 * Fork项目筛选器
 * 使用Fork图标
 */
export function ForkFilter({ value, onChange }: ForkFilterProps) {
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
      return <ForkIcon className="w-4 h-4 text-orange-500" />
    } else if (value === false) {
      return <ForkIcon className="w-4 h-4 text-gray-400" />
    }
    return <ForkIcon className="w-4 h-4 text-gray-300" />
  }

  const getTooltip = () => {
    if (value === true) {
      return t('forkOnly')
    } else if (value === false) {
      return t('noFork')
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

