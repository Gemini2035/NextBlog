'use client'

import React from 'react'

interface MobileToggleProps {
  isOpen: boolean
  onToggle: () => void
  title: string
}

export function MobileToggle({ isOpen, onToggle, title }: MobileToggleProps) {
  return (
    <button
      onClick={onToggle}
      className="lg:hidden w-full flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
    >
      <span className="font-medium text-gray-900 text-sm">{title}</span>
      <svg
        className={`w-4 h-4 text-gray-500 transition-transform ${
          isOpen ? 'rotate-180' : ''
        }`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 9l-7 7-7-7"
        />
      </svg>
    </button>
  )
}
