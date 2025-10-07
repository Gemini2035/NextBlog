import React from 'react'
import { IconProps } from './types'

export function EmailIcon({ className = "w-6 h-6", size, strokeWidth = 1.5 }: IconProps) {
  return (
    <svg 
      className={className} 
      width={size} 
      height={size} 
      fill="none" 
      stroke="currentColor" 
      viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={strokeWidth} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  )
}
