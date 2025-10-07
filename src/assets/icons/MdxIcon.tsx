import { type IconProps } from './types'

export default function MdxIcon({ className = 'w-6 h-6', ...props }: IconProps) {
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
      <polyline points="8,12 11,9 8,6" />
      <polyline points="16,6 13,9 16,12" />
      <line x1="12" y1="13" x2="12" y2="18" />
    </svg>
  )
}

