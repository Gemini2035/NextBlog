import { type IconProps } from './types'

export default function WCAGIcon({ className = 'w-6 h-6', ...props }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      {...props}
    >
      {/* 人形图标 - 代表无障碍访问 */}
      <circle cx="12" cy="6" r="2.5" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <path
        d="M12 9.5V14M9 11.5L12 14L15 11.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M8 14L7 19M16 14L17 19"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />
      {/* 外圈 - 代表包容性 */}
      <circle
        cx="12"
        cy="12"
        r="9"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
        strokeDasharray="2 2"
      />
    </svg>
  )
}

