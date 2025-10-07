import { type IconProps } from './types'

export default function SchemaOrgIcon({ className = 'w-6 h-6', ...props }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      {...props}
    >
      {/* 结构化数据标签 */}
      <path
        d="M7 8L5 12L7 16M17 8L19 12L17 16"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      
      {/* 数据结构 */}
      <rect x="9" y="6" width="6" height="3" rx="0.5" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <rect x="9" y="10.5" width="6" height="3" rx="0.5" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <rect x="9" y="15" width="6" height="3" rx="0.5" stroke="currentColor" strokeWidth="1.5" fill="none" />
      
      {/* 连接线 */}
      <line x1="12" y1="9" x2="12" y2="10.5" stroke="currentColor" strokeWidth="1.5" />
      <line x1="12" y1="13.5" x2="12" y2="15" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  )
}

