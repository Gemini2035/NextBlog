import { type IconProps } from './types'

export default function HuskyIcon({ className = 'w-6 h-6', ...props }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      {...props}
    >
      {/* Git钩子符号 */}
      <path
        d="M6 8C6 5.79086 7.79086 4 10 4H14C16.2091 4 18 5.79086 18 8V12"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="18" cy="16" r="4" fill="currentColor" />
      <path
        d="M16 16l1.5 1.5L20 15"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

