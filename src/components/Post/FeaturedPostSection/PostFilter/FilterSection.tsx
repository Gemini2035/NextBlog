'use client'

import { FilterSectionProps } from './types'

export function FilterSection({ title, children, className = '' }: FilterSectionProps) {
  return (
    <div className={`mb-4 ${className}`}>
      <h3 className="text-sm font-medium text-gray-700 mb-2">{title}</h3>
      <div className="space-y-2">
        {children}
      </div>
    </div>
  )
}
