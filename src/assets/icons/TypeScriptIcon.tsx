import { type IconProps } from './types'

export default function TypeScriptIcon({ className = 'w-6 h-6', ...props }: IconProps) {
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
      <rect x="7" y="6" width="10" height="10" rx="2" />
      <line x1="12" y1="8" x2="12" y2="14" />
      <line x1="9" y1="8" x2="15" y2="8" />
    </svg>
  )
}

