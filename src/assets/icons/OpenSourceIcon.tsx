import { type IconProps } from './types'

export default function OpenSourceIcon({ className = 'w-6 h-6', ...props }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      {...props}
    >
      {/* 外圆 */}
      <circle
        cx="12"
        cy="12"
        r="9"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
      />
      {/* 三个书本堆叠 */}
      <rect x="8" y="8" width="8" height="2" rx="0.5" fill="currentColor" />
      <rect x="8" y="11" width="8" height="2" rx="0.5" fill="currentColor" />
      <rect x="8" y="14" width="8" height="2" rx="0.5" fill="currentColor" />
    </svg>
  )
}

