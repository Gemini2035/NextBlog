import { IconProps } from './types'

/**
 * 代码图标 - 符合站点主题的outline风格
 */
export function CodeIcon({ className = "w-6 h-6", size, strokeWidth = 2 }: IconProps) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
    >
      <path 
        d="M8 10L6 12L8 14" 
        strokeWidth={strokeWidth} 
        strokeLinecap="round" 
        strokeLinejoin="round" 
      />
      <path 
        d="M16 10L18 12L16 14" 
        strokeWidth={strokeWidth} 
        strokeLinecap="round" 
        strokeLinejoin="round" 
      />
      <path 
        d="M13 9L11 15" 
        strokeWidth={strokeWidth} 
        strokeLinecap="round" 
      />
    </svg>
  )
}

