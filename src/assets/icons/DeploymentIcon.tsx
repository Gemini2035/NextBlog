import { type IconProps } from './types'

export default function DeploymentIcon({ className = 'w-6 h-6', ...props }: IconProps) {
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
      <circle cx="7" cy="12" r="2" />
      <circle cx="17" cy="7" r="2" />
      <circle cx="17" cy="17" r="2" />
      <line x1="9" y1="12" x2="15" y2="8" />
      <line x1="9" y1="12" x2="15" y2="16" />
    </svg>
  )
}

