import React from 'react'
import { IconProps } from './types'

export function QQIcon({ className = "w-6 h-6", size }: IconProps) {
  return (
    <svg 
      className={className} 
      width={size} 
      height={size} 
      viewBox="0 0 24 24"
    >
      {/* QQ企鹅身体 */}
      <ellipse 
        fill="currentColor" 
        cx="12" 
        cy="15" 
        rx="4" 
        ry="5"
      />
      {/* QQ企鹅头部 */}
      <circle 
        fill="currentColor" 
        cx="12" 
        cy="8" 
        r="3.5"
      />
      {/* QQ企鹅眼睛 */}
      <circle 
        fill="white" 
        cx="10.5" 
        cy="7" 
        r="0.8"
      />
      <circle 
        fill="white" 
        cx="13.5" 
        cy="7" 
        r="0.8"
      />
      {/* QQ企鹅瞳孔 */}
      <circle 
        fill="currentColor" 
        cx="10.5" 
        cy="7" 
        r="0.3"
      />
      <circle 
        fill="currentColor" 
        cx="13.5" 
        cy="7" 
        r="0.3"
      />
      {/* QQ企鹅嘴 */}
      <path 
        fill="currentColor" 
        d="M12 9.5c-0.4 0-0.8-0.2-1-0.5l-0.3 0.3c0.3 0.2 0.7 0.2 1 0l-0.3-0.3c-0.2 0.3-0.6 0.5-1 0.5z"
      />
      {/* QQ企鹅围巾 */}
      <rect 
        fill="currentColor" 
        x="10" 
        y="11" 
        width="4" 
        height="1.5"
        rx="0.2"
      />
    </svg>
  )
}
