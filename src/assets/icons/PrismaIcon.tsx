import { type IconProps } from './types'

export default function PrismaIcon({ className = 'w-6 h-6', ...props }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      {...props}
    >
      <path
        d="M14.12 2.8c-.3-.57-1.11-.58-1.43-.02L5.2 16.07c-.22.39-.11.89.25 1.15l4.32 3.04c.48.34 1.14.06 1.23-.51l1.11-7.03c.04-.27.3-.42.55-.33l4.76 1.84c.53.2 1.07-.27.94-.81L14.12 2.8Z"
        fill="#1E293B"
      />
      <path
        d="M13.57 4.84 7.16 16.12l2.93 2.06 1.01-6.35c.13-.81.94-1.31 1.69-1.02l3.8 1.46-2.92-7.43Z"
        fill="#334155"
      />
      <path
        d="M11.1 12.04 7.16 16.12l2.93 2.06 1.01-6.14Z"
        fill="#94A3B8"
        opacity="0.95"
      />
    </svg>
  )
}
