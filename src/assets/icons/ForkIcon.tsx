import { IconProps } from './types'

/**
 * Fork图标 - 极简扁平化设计
 */
export function ForkIcon({ className = "w-6 h-6", size, strokeWidth = 2 }: IconProps) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
    >
      {/* 上方圆点 */}
      <circle 
        cx="12" 
        cy="4" 
        r="1.5" 
        fill="currentColor"
      />
      
      {/* 左下圆点 */}
      <circle 
        cx="6" 
        cy="20" 
        r="1.5" 
        fill="currentColor"
      />
      
      {/* 右下圆点 */}
      <circle 
        cx="18" 
        cy="20" 
        r="1.5" 
        fill="currentColor"
      />
      
      {/* 中间主干 - 直线 */}
      <path 
        d="M12 5.5V11" 
        strokeWidth={strokeWidth} 
        strokeLinecap="round"
      />
      
      {/* 分叉线 - 左侧直线 */}
      <path 
        d="M12 11L6 11L6 18.5" 
        strokeWidth={strokeWidth} 
        strokeLinecap="round"
      />
      
      {/* 分叉线 - 右侧直线 */}
      <path 
        d="M12 11L18 11L18 18.5" 
        strokeWidth={strokeWidth} 
        strokeLinecap="round"
      />
    </svg>
  )
}

