import type { IconProps } from './types'

export function RechartsIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      {/* 柱状图图标 */}
      <path d="M3 3v18h18" stroke="currentColor" strokeWidth="2" fill="none" />
      <rect x="6" y="12" width="3" height="8" rx="1" />
      <rect x="11" y="8" width="3" height="12" rx="1" />
      <rect x="16" y="5" width="3" height="15" rx="1" />
    </svg>
  )
}

