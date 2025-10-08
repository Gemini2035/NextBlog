import { IconProps } from './types'

/**
 * 项目图标 - 符合站点主题的outline风格
 */
export function ProjectIcon({ className = "w-6 h-6", size, strokeWidth = 2 }: IconProps) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
    >
      <rect 
        x="3" 
        y="5" 
        width="18" 
        height="14" 
        rx="2" 
        strokeWidth={strokeWidth} 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      <path 
        d="M3 8H21" 
        strokeWidth={strokeWidth} 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      <circle cx="6" cy="6.5" r="0.5" fill="currentColor" />
      <circle cx="8" cy="6.5" r="0.5" fill="currentColor" />
      <circle cx="10" cy="6.5" r="0.5" fill="currentColor" />
    </svg>
  )
}

