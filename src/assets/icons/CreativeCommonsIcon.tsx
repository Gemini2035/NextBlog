import { type IconProps } from './types'

export default function CreativeCommonsIcon({ className = 'w-6 h-6', ...props }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      {...props}
    >
      {/* 外圆 */}
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" fill="none" />
      
      {/* CC 标志 - 两个 C */}
      <path
        d="M8.5 9C7.67 9 7 9.67 7 10.5v3C7 14.33 7.67 15 8.5 15"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M14.5 9C13.67 9 13 9.67 13 10.5v3c0 .83.67 1.5 1.5 1.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  )
}

