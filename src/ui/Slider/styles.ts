import { cn } from '@/utils'

/**
 * 获取Slider容器的样式类名
 */
export const getSliderStyles = (
  className?: string
) => {
  return cn(
    'relative w-full overflow-hidden',
    className
  )
}

/**
 * 获取滑动容器的样式类名
 */
export const getSliderTrackStyles = (
  paddingLeft: number,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _gap: number = 0,
  className?: string
) => {
  // 暂时不使用 gap 参数，但保留接口兼容性
  return cn(
    'flex transition-transform duration-300 ease-in-out',
    className
  )
}

/**
 * 获取单个item的样式类名
 */
export const getSliderItemStyles = (
  itemsPerPage: number,
  className?: string
) => {
  return cn(
    'flex-shrink-0',
    className
  )
}

/**
 * 获取导航按钮的样式类名
 */
export const getNavigationButtonStyles = (
  direction: 'left' | 'right',
  variant: 'default' | 'outline' | 'ghost' = 'default',
  disabled: boolean = false,
  className?: string
) => {
  const baseStyles = cn(
    'absolute top-1/2 -translate-y-1/2 z-10',
    'w-10 h-10 rounded-full',
    'flex items-center justify-center',
    'transition-all duration-200',
    'focus:outline-none focus:ring-2 focus:ring-offset-2',
    disabled && 'hidden', // 禁用时直接隐藏
    !disabled && 'cursor-pointer hover:scale-110 active:scale-95' // 启用时显示pointer光标
  )

  const positionStyles = direction === 'left' 
    ? 'left-4' 
    : 'right-4'

  const variantStyles = {
    default: cn(
      'bg-white text-gray-800 shadow-lg',
      'hover:bg-gray-50',
      'focus:ring-gray-300'
    ),
    outline: cn(
      'bg-transparent border-2 border-white text-white',
      'hover:bg-white hover:text-gray-800',
      'focus:ring-white'
    ),
    ghost: cn(
      'bg-transparent text-white',
      'hover:bg-white/20',
      'focus:ring-white'
    )
  }

  return cn(
    baseStyles,
    positionStyles,
    variantStyles[variant],
    className
  )
}

/**
 * 获取指示器的样式类名
 */
export const getIndicatorStyles = (
  variant: 'dot' | 'number' | 'line' = 'dot',
  active: boolean = false,
  className?: string
) => {
  const baseStyles = cn(
    'transition-all duration-200 cursor-pointer',
    'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300'
  )

  const variantStyles = {
    dot: cn(
      'w-2 h-2 rounded-full',
      active 
        ? 'bg-white scale-125' 
        : 'bg-white/50 hover:bg-white/75'
    ),
    number: cn(
      'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium',
      active
        ? 'bg-white text-gray-800'
        : 'bg-white/50 text-white hover:bg-white/75'
    ),
    line: cn(
      'h-1 rounded-full',
      active
        ? 'bg-white'
        : 'bg-white/50 hover:bg-white/75'
    )
  }

  return cn(
    baseStyles,
    variantStyles[variant],
    className
  )
}

/**
 * 获取指示器容器的样式类名
 */
export const getIndicatorContainerStyles = (
  variant: 'dot' | 'number' | 'line' = 'dot',
  className?: string
) => {
  return cn(
    'flex items-center justify-center gap-2 mt-4',
    variant === 'line' && 'w-full',
    className
  )
}
