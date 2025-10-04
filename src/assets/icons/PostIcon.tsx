import React from 'react'
import { IconProps } from './types'

export function PostIcon({ className = "w-6 h-6", size, strokeWidth = 2 }: IconProps) {
  return (
    <svg 
      className={className} 
      width={size} 
      height={size} 
      fill="none" 
      stroke="currentColor" 
      viewBox="0 0 24 24"
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" strokeLinecap="round" strokeLinejoin="round" strokeWidth={strokeWidth}/>
      <polyline points="14,2 14,8 20,8" strokeLinecap="round" strokeLinejoin="round" strokeWidth={strokeWidth}/>
      <line x1="16" y1="13" x2="8" y2="13" strokeLinecap="round" strokeLinejoin="round" strokeWidth={strokeWidth}/>
      <line x1="16" y1="17" x2="8" y2="17" strokeLinecap="round" strokeLinejoin="round" strokeWidth={strokeWidth}/>
      <polyline points="10,9 9,9 8,9" strokeLinecap="round" strokeLinejoin="round" strokeWidth={strokeWidth}/>
    </svg>
  )
}
