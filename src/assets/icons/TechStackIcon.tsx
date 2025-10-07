import { type IconProps } from './types'

export default function TechStackIcon({ className = 'w-6 h-6', ...props }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      {...props}
    >
      <rect x="4" y="14" width="16" height="4" rx="1.5" />
      <rect x="6" y="9" width="12" height="3" rx="1.5" />
      <rect x="8" y="5" width="8" height="2" rx="1" />
    </svg>
  )
}

