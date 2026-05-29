import { type IconProps } from './types'

export default function RESTfulIcon({ className = 'w-6 h-6', ...props }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      {...props}
    >
      {/* REST API - 服务器与客户端交互 */}
      <rect
        x="3"
        y="4"
        width="8"
        height="6"
        rx="1"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
      />
      <rect
        x="13"
        y="14"
        width="8"
        height="6"
        rx="1"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
      />
      
      {/* 连接线和箭头 */}
      <path
        d="M11 7L13 7M13 7L13 17M13 17L11 17"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      
      {/* HTTP方法点 */}
      <circle cx="5" cy="6.5" r="0.8" fill="currentColor" />
      <circle cx="7" cy="6.5" r="0.8" fill="currentColor" />
      <circle cx="9" cy="6.5" r="0.8" fill="currentColor" />
      
      <circle cx="15" cy="16.5" r="0.8" fill="currentColor" />
      <circle cx="17" cy="16.5" r="0.8" fill="currentColor" />
      <circle cx="19" cy="16.5" r="0.8" fill="currentColor" />
    </svg>
  )
}

