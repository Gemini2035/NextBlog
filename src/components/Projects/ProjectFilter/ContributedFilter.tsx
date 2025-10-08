'use client'

import { useTranslations } from 'next-intl'
import { ContributorIcon } from '@/assets/icons'

interface ContributedFilterProps {
  value: boolean | null
  onChange: (value: boolean | null) => void
}

/**
 * 我参与的项目筛选器
 * 筛选Fork项目或有多个贡献者的项目
 */
export function ContributedFilter({ value, onChange }: ContributedFilterProps) {
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
      return <ContributorIcon className="w-4 h-4 text-purple-500" />
    } else if (value === false) {
      return <ContributorIcon className="w-4 h-4 text-gray-400" />
    }
    return <ContributorIcon className="w-4 h-4 text-gray-300" />
  }

  const getTooltip = () => {
    if (value === true) {
      return t('contributedOnly')
    } else if (value === false) {
      return t('noContributed')
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

