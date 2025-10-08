import { IconProps } from './types'

/**
 * 编程语言图标 - 符合站点主题的outline风格
 */
export function LanguageIcon({ className = "w-6 h-6", size, strokeWidth = 2 }: IconProps) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
    >
      <circle 
        cx="12" 
        cy="12" 
        r="9" 
        strokeWidth={strokeWidth} 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      <path
        d="M3 12H21M12 3C14.5 5.5 15.5 9 15.5 12C15.5 15 14.5 18.5 12 21M12 3C9.5 5.5 8.5 9 8.5 12C8.5 15 9.5 18.5 12 21"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

