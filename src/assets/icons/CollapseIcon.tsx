import React from 'react'
import { IconProps } from './types'

export function CollapseIcon({ 
  className = "w-6 h-6", 
  size, 
  strokeWidth = 2 
}: IconProps) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={strokeWidth}
        d="M19 9l-7 7-7-7"
      />
    </svg>
  )
}
