import { type IconProps } from './types'

export default function VercelIcon({ className = 'w-6 h-6', ...props }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      {...props}
    >
      {/* Vercel 三角形标志 */}
      <path d="M12 3L3 21h18L12 3z" />
    </svg>
  )
}

