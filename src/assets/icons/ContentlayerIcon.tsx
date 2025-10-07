import { type IconProps } from './types'

export default function ContentlayerIcon({ className = 'w-6 h-6', ...props }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
      {...props}
    >
      <rect x="6" y="7" width="12" height="8" rx="1" />
      <rect x="8" y="11" width="8" height="4" rx="1" />
    </svg>
  )
}

