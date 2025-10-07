import { type IconProps } from './types'

export default function TailwindIcon({ className = 'w-6 h-6', ...props }: IconProps) {
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
      <rect x="7" y="7" width="6" height="3" rx="1" />
      <rect x="11" y="12" width="6" height="3" rx="1" />
    </svg>
  )
}

