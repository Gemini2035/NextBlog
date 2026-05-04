import { type IconProps } from './types'

export default function PostgresIcon({ className = 'w-6 h-6', ...props }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      {...props}
    >
      <path
        d="M12.05 2.5c-2.63 0-4.75 1.57-5.92 4.13-.9 1.95-1.12 4.2-.86 6.38.31 2.58 1.59 4.58 3.71 5.69.43.22.63.72.48 1.18l-.59 1.74c-.13.39.2.76.6.67l1.31-.31c1.48-.35 2.81-1.14 3.84-2.27l2.05-2.25c1.36-1.5 2.14-3.45 2.2-5.48l.05-1.74c.06-2.17-.4-4.36-1.59-6.13C16.15 3.16 14.3 2.5 12.05 2.5Z"
        fill="#336791"
      />
      <path
        d="M10 7.6c-.75 0-1.36.62-1.36 1.39 0 .76.61 1.38 1.36 1.38.76 0 1.37-.62 1.37-1.38 0-.77-.61-1.39-1.37-1.39Zm4.67.55c-.44 0-.8.37-.8.83 0 .45.36.82.8.82s.81-.37.81-.82c0-.46-.37-.83-.81-.83Z"
        fill="#F8FAFC"
      />
      <path
        d="M8.83 12.46c.93.54 1.92.82 2.98.82 1.66 0 3.11-.58 4.37-1.77"
        stroke="#F8FAFC"
        strokeWidth="1.15"
        strokeLinecap="round"
      />
      <path
        d="M11.52 14.06v4.57"
        stroke="#F8FAFC"
        strokeWidth="1.15"
        strokeLinecap="round"
      />
      <path
        d="M10.16 19.1c.93.05 1.85-.09 2.74-.4"
        stroke="#DCEAF5"
        strokeWidth="1.05"
        strokeLinecap="round"
      />
    </svg>
  )
}
