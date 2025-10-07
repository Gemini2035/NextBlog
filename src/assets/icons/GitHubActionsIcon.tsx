import { type IconProps } from './types'

export default function GitHubActionsIcon({ className = 'w-6 h-6', ...props }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      {...props}
    >
      {/* GitHub Actions - 齿轮+工作流 */}
      <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="2" fill="none" />
      <circle cx="12" cy="12" r="3" fill="currentColor" />
      <path
        d="M12 4v3M12 17v3M4 12h3M17 12h3"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M7.5 7.5l2 2M14.5 14.5l2 2M7.5 16.5l2-2M14.5 9.5l2-2"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  )
}

