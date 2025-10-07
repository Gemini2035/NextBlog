import { type IconProps } from './types'

export default function OnlineServiceIcon({ className = 'w-6 h-6', ...props }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      {...props}
    >
      {/* 云服务图标 */}
      <path
        d="M18 10c1.657 0 3 1.343 3 3s-1.343 3-3 3H6c-2.21 0-4-1.79-4-4s1.79-4 4-4c.35 0 .687.047 1.007.136C7.563 6.27 9.596 5 12 5c3.314 0 6 2.686 6 6z"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
        strokeLinejoin="round"
      />
    </svg>
  )
}
