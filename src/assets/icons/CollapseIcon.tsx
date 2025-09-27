import { IconProps } from './types'

export function CollapseIcon({ 
  className = '', 
  size = 24, 
  strokeWidth = 2 
}: IconProps) {
  return (
    <svg
      className={`w-4 h-4 text-gray-600 transition-transform duration-200 ${className}`}
      fill="none"
      stroke="currentColor"
      viewBox={`0 0 ${size} ${size}`}
      width={size}
      height={size}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={strokeWidth}
        d="M19 9l-7 7-7-7"
      />
    </svg>
  )
}
