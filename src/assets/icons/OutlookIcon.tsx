import React from 'react'
import { IconProps } from './types'

export function OutlookIcon({ className = "w-6 h-6", size }: IconProps) {
  return (
    <svg 
      className={className} 
      width={size} 
      height={size} 
      viewBox="0 0 24 24"
    >
      <path 
        fill="currentColor" 
        d="M7.462 2.5h9.076c.904 0 1.636.732 1.636 1.636v15.728c0 .904-.732 1.636-1.636 1.636H7.462c-.904 0-1.636-.732-1.636-1.636V4.136c0-.904.732-1.636 1.636-1.636zM9.5 6.5h5v11h-5v-11zm0-2v1h5v-1h-5z"
      />
    </svg>
  )
}
