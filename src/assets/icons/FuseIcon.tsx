import { type IconProps } from './types'

export default function FuseIcon({ className = 'w-6 h-6', ...props }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      {...props}
    >
      {/* 搜索放大镜 */}
      <circle
        cx="10"
        cy="10"
        r="6"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
      />
      <path
        d="M15 15L20 20"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* 模糊搜索的波纹效果 */}
      <circle
        cx="10"
        cy="10"
        r="3"
        stroke="currentColor"
        strokeWidth="1"
        fill="none"
        opacity="0.5"
      />
    </svg>
  )
}

