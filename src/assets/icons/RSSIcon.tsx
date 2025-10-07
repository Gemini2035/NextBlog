import { type IconProps } from './types'

export default function RSSIcon({ className = 'w-6 h-6', ...props }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      {...props}
    >
      {/* RSS 信号波纹 */}
      <path
        d="M4 11C9.52 11 14 15.48 14 21"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M4 4C13.94 4 22 12.06 22 22"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />
      
      {/* RSS 点 */}
      <circle cx="5" cy="19" r="2" fill="currentColor" />
    </svg>
  )
}

