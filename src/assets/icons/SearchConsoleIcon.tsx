import { type IconProps } from './types'

export default function SearchConsoleIcon({ className = 'w-6 h-6', ...props }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      {...props}
    >
      {/* 搜索控制台 */}
      <circle
        cx="10"
        cy="10"
        r="6"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
      />
      <path
        d="M14.5 14.5L19 19"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M7 10h6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  )
}

