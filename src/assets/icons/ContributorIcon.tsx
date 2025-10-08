import { IconProps } from './types'

/**
 * 贡献者图标 - 符合站点主题的outline风格
 */
export function ContributorIcon({ className = "w-6 h-6", size, strokeWidth = 2 }: IconProps) {
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
        cy="8" 
        r="3" 
        strokeWidth={strokeWidth} 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      <path
        d="M5 18C5 15.2386 7.23858 13 10 13H14C16.7614 13 19 15.2386 19 18V19H5V18Z"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

