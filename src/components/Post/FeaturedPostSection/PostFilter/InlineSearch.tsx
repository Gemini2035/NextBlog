'use client'

import { useState, useEffect, useRef } from 'react'
import { useDebounce } from 'use-debounce'
import { SearchIcon } from '@/assets/icons'

interface InlineSearchProps {
  value: string
  onChange: (value: string) => void
  placeholder: string
}

export function InlineSearch({ value, onChange, placeholder }: InlineSearchProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [inputValue, setInputValue] = useState(value)
  const [debouncedValue] = useDebounce(inputValue, 300)
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (debouncedValue !== value) {
      onChange(debouncedValue)
    }
  }, [debouncedValue, onChange, value])

  // 同步外部value变化到内部inputValue
  useEffect(() => {
    if (value !== inputValue) {
      setInputValue(value)
      // 如果外部value被清空，且当前是展开状态，则收起
      if (!value && isExpanded) {
        setIsExpanded(false)
      }
    }
  }, [value, inputValue, isExpanded])

  const handleToggle = () => {
    setIsExpanded(!isExpanded)
    if (isExpanded) {
      setInputValue('')
      onChange('')
    }
  }

  const handleInputClick = (e: React.MouseEvent) => {
    // 阻止事件冒泡，防止触发折叠
    e.stopPropagation()
  }

  const handleInputFocus = () => {
    // 阻止事件冒泡，防止触发折叠
    if (inputRef.current) {
      inputRef.current.addEventListener('click', handleInputClick, true)
    }
  }

  const handleInputBlur = () => {
    if (inputRef.current) {
      inputRef.current.removeEventListener('click', handleInputClick, true)
    }
  }

  // 处理点击外部区域
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        // 如果输入框为空，则自动收起
        if (isExpanded && !inputValue.trim()) {
          setIsExpanded(false)
          setInputValue('')
          onChange('')
        }
      }
    }

    if (isExpanded) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isExpanded, inputValue, onChange])

  return (
    <div ref={containerRef} className="flex items-center gap-2">
      {!isExpanded ? (
        <button
          onClick={handleToggle}
          className="flex items-center justify-center w-8 h-8 rounded-full transition-all duration-200 bg-gray-100 text-gray-600 hover:bg-gray-200"
          title={placeholder}
        >
          <SearchIcon className="w-4 h-4" />
        </button>
      ) : (
        <div className="relative animate-in slide-in-from-left-2 duration-200">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              onClick={handleInputClick}
              placeholder={placeholder}
              className="w-64 pl-10 pr-10 py-2 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              autoFocus
            />
            {inputValue && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setInputValue('')
                  onChange('')
                }}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
