import { IconProps } from './types'

export function PixivIcon({ className, ...props }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      {...props}
    >
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
      <path d="M9 7h3.5c2.21 0 4 1.79 4 4s-1.79 4-4 4H11v2h3v2H9V7zm2 2v4h1.5c1.1 0 2-.9 2-2s-.9-2-2-2H11z"/>
    </svg>
  )
}