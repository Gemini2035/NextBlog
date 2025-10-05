import React from 'react'
import { IconProps } from './types'

export function ICloudIcon({ className = "w-6 h-6", size }: IconProps) {
  return (
    <svg 
      className={className} 
      width={size} 
      height={size} 
      viewBox="0 0 24 24"
    >
      <path 
        fill="currentColor" 
        d="M13.762 4.29a6.5 6.5 0 0 0-5.524 9.832 3.5 3.5 0 0 0-.238 6.878 6.5 6.5 0 0 0 10.5-5.71 6.5 6.5 0 0 0-4.738-10.998z"
      />
    </svg>
  )
}
