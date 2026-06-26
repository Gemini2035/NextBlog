import { IconProps } from './types'

export function CopyIcon({ className = "w-6 h-6", size, strokeWidth = 2 }: IconProps) {
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
        x="8"
        y="8"
        width="11"
        height="11"
        rx="2"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5 15V7C5 5.89543 5.89543 5 7 5H15"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
