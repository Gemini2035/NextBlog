import { type IconProps } from './types'

export default function ClsxIcon({ className = 'w-6 h-6', ...props }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      {...props}
    >
      {/* 代表class的方块组合 */}
      <rect x="3" y="3" width="7" height="7" rx="1.5" fill="currentColor" />
      <rect x="13" y="3" width="7" height="7" rx="1.5" fill="currentColor" opacity="0.7" />
      <rect x="3" y="13" width="7" height="7" rx="1.5" fill="currentColor" opacity="0.5" />
      <rect x="13" y="13" width="7" height="7" rx="1.5" fill="currentColor" opacity="0.3" />
    </svg>
  )
}

