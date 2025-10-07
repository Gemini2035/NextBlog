import { type IconProps } from './types'

export default function FramerMotionIcon({ className = 'w-6 h-6', ...props }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      {...props}
    >
      {/* Framer Motion 标志性的三角形叠加 */}
      <path
        d="M5 3h14L12 12H5V3z"
        fill="currentColor"
      />
      <path
        d="M5 12h7l7 9h-7l-7-9z"
        fill="currentColor"
        opacity="0.6"
      />
    </svg>
  )
}

