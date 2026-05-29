import { IconProps } from './types'

export function ChevronUpIcon({ className = "w-4 h-4", size, strokeWidth = 2 }: IconProps) {
  return (
    <svg 
      className={className} 
      width={size} 
      height={size} 
      fill="none" 
      stroke="currentColor" 
      viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={strokeWidth} d="M5 15l7-7 7 7" />
    </svg>
  )
}
