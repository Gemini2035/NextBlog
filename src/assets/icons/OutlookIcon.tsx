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
        d="M7 2h10a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zm0 2v16h10V4H7zm2 2h6v2H9V6zm0 3h6v2H9V9zm0 3h4v2H9v-2z"
      />
    </svg>
  )
}
