import { type IconProps } from './types'

export default function OpenGraphIcon({ className = 'w-6 h-6', ...props }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      {...props}
    >
      {/* 图谱节点 */}
      <circle cx="6" cy="6" r="2.5" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <circle cx="18" cy="6" r="2.5" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <circle cx="6" cy="18" r="2.5" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <circle cx="18" cy="18" r="2.5" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <circle cx="12" cy="12" r="2.5" stroke="currentColor" strokeWidth="1.5" fill="none" />
      
      {/* 连接线 */}
      <line x1="7.8" y1="7.8" x2="10.2" y2="10.2" stroke="currentColor" strokeWidth="1.5" />
      <line x1="13.8" y1="10.2" x2="16.2" y2="7.8" stroke="currentColor" strokeWidth="1.5" />
      <line x1="7.8" y1="16.2" x2="10.2" y2="13.8" stroke="currentColor" strokeWidth="1.5" />
      <line x1="13.8" y1="13.8" x2="16.2" y2="16.2" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  )
}

