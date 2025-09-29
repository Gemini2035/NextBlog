'use client'

import { useState, useEffect } from 'react'
import { useDebounce } from 'use-debounce'

interface KeywordSearchProps {
  value: string
  onChange: (value: string) => void
  placeholder: string
}

export function KeywordSearch({ value, onChange, placeholder }: KeywordSearchProps) {
  const [inputValue, setInputValue] = useState(value)
  const [debouncedValue] = useDebounce(inputValue, 300)

  useEffect(() => {
    if (debouncedValue !== value) {
      onChange(debouncedValue)
    }
  }, [debouncedValue, onChange, value])

  return (
    <div className="relative">
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2 border border-gray-300 rounded-md text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
      {inputValue && (
        <button
          onClick={() => {
            setInputValue('')
            onChange('')
          }}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
        >
          ✕
        </button>
      )}
    </div>
  )
}
