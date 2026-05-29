import { type IconProps } from './types'

export default function OpenAIIcon({ className = 'w-6 h-6', ...props }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      {...props}
    >
      {/* AI 符号 - 抽象的神经网络 */}
      <circle cx="12" cy="6" r="2" fill="currentColor" />
      <circle cx="6" cy="18" r="2" fill="currentColor" />
      <circle cx="18" cy="18" r="2" fill="currentColor" />
      <path
        d="M12 8L6 16M12 8L18 16M8 18h8"
        stroke="currentColor"
        strokeWidth="1.5"
        opacity="0.6"
      />
    </svg>
  )
}

