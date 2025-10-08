'use client'

import { CheckIcon, CloseIcon } from '@/ui/icons'

interface BooleanFilterProps {
  value: boolean | null
  onChange: (value: boolean | null) => void
  trueLabel?: string
  falseLabel?: string
  nullLabel?: string
}

export function BooleanFilter({ 
  value, 
  onChange,
  trueLabel = '是',
  falseLabel = '否',
  nullLabel = '全部'
}: BooleanFilterProps) {
  
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
      return <CheckIcon className="w-4 h-4 text-green-500" />
    } else if (value === false) {
      return <CloseIcon className="w-4 h-4 text-red-500" />
    }
    return <span className="w-4 h-4 text-xs text-gray-400">—</span>
  }

  const getTooltip = () => {
    if (value === true) {
      return trueLabel
    } else if (value === false) {
      return falseLabel
    }
    return nullLabel
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

