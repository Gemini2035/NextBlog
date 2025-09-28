'use client'

import { SortOption } from './types'

interface SortSelectProps {
  options: SortOption[]
  value: string | null
  onChange: (value: string | null) => void
  placeholder: string
}

export function SortSelect({ options, value, onChange, placeholder }: SortSelectProps) {
  return (
    <select
      value={value || ''}
      onChange={(e) => onChange(e.target.value || null)}
      className="w-full px-3 py-2 border border-gray-300 rounded-md text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
    >
      <option value="">{placeholder}</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  )
}
