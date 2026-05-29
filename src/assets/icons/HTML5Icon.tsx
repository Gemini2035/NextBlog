import { type IconProps } from './types'

export default function HTML5Icon({ className = 'w-6 h-6', ...props }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      {...props}
    >
      {/* HTML5 盾形 */}
      <path
        d="M5 3L6.5 19L12 21L17.5 19L19 3H5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
        fill="none"
      />
      
      {/* HTML5 数字 5 */}
      <path
        d="M10 10H13.5L13 13H10.5L11 15.5H14"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  )
}

