import { type IconProps } from './types'

export default function NextJsIcon({ className = 'w-6 h-6', ...props }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      {...props}
    >
      {/* 灰色圆角方块背景 */}
      <rect
        x="2"
        y="2"
        width="20"
        height="20"
        rx="4"
        fill="currentColor"
      />
      {/* 白色三角形 */}
      <path
        d="M12 7L18 15H6L12 7Z"
        fill="white"
      />
    </svg>
  )
}

