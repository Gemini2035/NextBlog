import { type IconProps } from './types'

export default function PrettierIcon({ className = 'w-6 h-6', ...props }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      {...props}
    >
      {/* 格式化的代码行 */}
      <rect x="4" y="5" width="16" height="2" rx="1" fill="currentColor" />
      <rect x="6" y="9" width="12" height="2" rx="1" fill="currentColor" opacity="0.7" />
      <rect x="4" y="13" width="14" height="2" rx="1" fill="currentColor" opacity="0.5" />
      <rect x="6" y="17" width="10" height="2" rx="1" fill="currentColor" opacity="0.3" />
    </svg>
  )
}

