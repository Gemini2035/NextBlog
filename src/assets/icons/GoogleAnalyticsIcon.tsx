import { type IconProps } from './types'

export default function GoogleAnalyticsIcon({ className = 'w-6 h-6', ...props }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      {...props}
    >
      {/* 数据分析图表 */}
      <rect x="4" y="14" width="3" height="7" rx="1" fill="currentColor" />
      <rect x="10" y="9" width="3" height="12" rx="1" fill="currentColor" />
      <rect x="16" y="4" width="3" height="17" rx="1" fill="currentColor" />
    </svg>
  )
}

