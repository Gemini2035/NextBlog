import React from 'react'
import { IconProps } from './types'

export function RefreshIcon({ className = "w-6 h-6", size, strokeWidth = 2 }: IconProps) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <polyline points="23 4 23 10 17 10" strokeLinecap="round" strokeLinejoin="round" strokeWidth={strokeWidth} />
      <polyline points="1 20 1 14 7 14" strokeLinecap="round" strokeLinejoin="round" strokeWidth={strokeWidth} />
      <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15" strokeLinecap="round" strokeLinejoin="round" strokeWidth={strokeWidth} />
    </svg>
  )
}
