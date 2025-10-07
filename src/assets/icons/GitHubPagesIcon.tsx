import { type IconProps } from './types'

export default function GitHubPagesIcon({ className = 'w-6 h-6', ...props }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      {...props}
    >
      {/* GitHub Pages - 书页+GitHub标志 */}
      <rect x="5" y="3" width="14" height="18" rx="1.5" stroke="currentColor" strokeWidth="2" fill="none" />
      <path
        d="M9 8h6M9 12h6M9 16h4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  )
}

