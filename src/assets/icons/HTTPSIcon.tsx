import { type IconProps } from './types'

export default function HTTPSIcon({ className = 'w-6 h-6', ...props }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      {...props}
    >
      {/* 锁的主体 */}
      <rect
        x="7"
        y="11"
        width="10"
        height="8"
        rx="1"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
      />
      
      {/* 锁扣 */}
      <path
        d="M9 11V8C9 6.34 10.34 5 12 5C13.66 5 15 6.34 15 8V11"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />
      
      {/* 钥匙孔 */}
      <circle cx="12" cy="15" r="1" fill="currentColor" />
      <line
        x1="12"
        y1="16"
        x2="12"
        y2="17.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  )
}

