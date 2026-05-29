'use client'

import { useState, useEffect, useRef } from 'react'
import { useDebounce } from 'use-debounce'
import { SearchIcon } from '@/assets/icons'
import { Button } from '@/ui'

interface InlineSearchProps {
  value: string
  onChange: (value: string) => void
  placeholder: string
}

export function InlineSearch({ value, onChange, placeholder }: InlineSearchProps) {
  const [inputValue, setInputValue] = useState(value)
  const [debouncedValue] = useDebounce(inputValue, 300)
  const inputRef = useRef<HTMLInputElement>(null)

  // 防抖搜索
  useEffect(() => {
    onChange(debouncedValue)
  }, [debouncedValue, onChange])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setInputValue(newValue)
  }

  const handleClear = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setInputValue('')
    onChange('')
  }

  return (
    <div className="flex items-center gap-2 w-full">
      <div className="relative w-full">
        <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder={placeholder}
          className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        {inputValue && (
          <Button
            type="ghost"
            size="sm"
            onClick={handleClear}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 w-6 h-6 rounded-full p-0 text-gray-400 hover:text-gray-600"
          >
            ✕
          </Button>
        )}
      </div>
    </div>
  )
}

