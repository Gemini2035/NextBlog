import { TimelineMode, TimelineSize, TimelineColor, TimelineStatus } from './types'

/**
 * 获取 Timeline 组件的样式类名
 */
export const getTimelineStyles = (
  mode: TimelineMode = 'left',
  size: TimelineSize = 'md',
  showLine: boolean = true,
  className?: string
): string => {
  const baseStyles = 'relative'
  
  const modeStyles = {
    left: 'pl-6',
    right: 'pr-6',
    alternate: 'px-6'
  }
  
  const sizeStyles = {
    sm: 'space-y-4',
    md: 'space-y-6',
    lg: 'space-y-8'
  }
  
  const lineStyles = showLine ? 'before:absolute before:left-6 before:top-0 before:bottom-0 before:w-0.5 before:bg-gray-300 before:rounded-full' : ''
  
  return `${baseStyles} ${modeStyles[mode]} ${sizeStyles[size]} ${lineStyles} ${className || ''}`
}

/**
 * 获取 TimelineItem 组件的样式类名
 */
export const getTimelineItemStyles = (
  mode: TimelineMode = 'left',
  size: TimelineSize = 'md',
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _status: TimelineStatus = 'process',
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _color: TimelineColor = 'blue',
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _showLine: boolean = true,
  className?: string
): string => {
  const baseStyles = 'relative flex items-start'
  
  const modeStyles = {
    left: 'space-x-4',
    right: 'flex-row-reverse space-x-reverse space-x-4',
    alternate: 'space-x-4'
  }
  
  const sizeStyles = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  }
  
  return `${baseStyles} ${modeStyles[mode]} ${sizeStyles[size]} ${className || ''}`
}

/**
 * 获取 Timeline 连接线的样式类名
 */
export const getTimelineLineStyles = (
  color: TimelineColor = 'blue',
  showLine: boolean = true
): string => {
  if (!showLine) return ''
  
  const colorStyles = {
    blue: 'bg-blue-300',
    green: 'bg-green-300',
    red: 'bg-red-300',
    orange: 'bg-orange-300',
    purple: 'bg-purple-300',
    gray: 'bg-gray-300'
  }
  
  return `absolute left-6 top-0 bottom-0 w-0.5 rounded-full ${colorStyles[color]}`
}

/**
 * 获取 Timeline 点的样式类名
 */
export const getTimelineDotStyles = (
  size: TimelineSize = 'md',
  color: TimelineColor = 'blue',
  status: TimelineStatus = 'process'
): string => {
  const baseStyles = 'flex-shrink-0 rounded-full flex items-center justify-center shadow-lg'
  
  const sizeStyles = {
    sm: 'w-6 h-6 text-xs',
    md: 'w-8 h-8 text-sm',
    lg: 'w-10 h-10 text-base'
  }
  
  const statusStyles = {
    pending: 'bg-gray-100 border-2 border-gray-300',
    process: 'bg-blue-500 text-white',
    finish: 'bg-green-500 text-white',
    error: 'bg-red-500 text-white'
  }
  
  const colorStyles = {
    blue: status === 'process' ? 'bg-blue-500' : status === 'finish' ? 'bg-green-500' : 'bg-gray-500',
    green: status === 'process' ? 'bg-green-500' : status === 'finish' ? 'bg-green-500' : 'bg-gray-500',
    red: status === 'process' ? 'bg-red-500' : status === 'finish' ? 'bg-green-500' : 'bg-gray-500',
    orange: status === 'process' ? 'bg-orange-500' : status === 'finish' ? 'bg-green-500' : 'bg-gray-500',
    purple: status === 'process' ? 'bg-purple-500' : status === 'finish' ? 'bg-green-500' : 'bg-gray-500',
    gray: status === 'process' ? 'bg-gray-500' : status === 'finish' ? 'bg-green-500' : 'bg-gray-500'
  }
  
  return `${baseStyles} ${sizeStyles[size]} ${statusStyles[status]} ${colorStyles[color]}`
}

/**
 * 获取 Timeline 内容区域的样式类名
 */
export const getTimelineContentStyles = (
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _mode: TimelineMode = 'left',
  size: TimelineSize = 'md',
  className?: string
): string => {
  const baseStyles = 'flex-1 bg-white rounded-lg shadow-sm border border-gray-200'
  
  const sizeStyles = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  }
  
  return `${baseStyles} ${sizeStyles[size]} ${className || ''}`
}

/**
 * 获取 Timeline 标签的样式类名
 */
export const getTimelineLabelStyles = (
  mode: TimelineMode = 'left',
  size: TimelineSize = 'md',
  className?: string
): string => {
  const baseStyles = 'text-gray-600 font-medium'
  
  const sizeStyles = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  }
  
  const modeStyles = {
    left: 'mb-2',
    right: 'mb-2 text-right',
    alternate: 'mb-2'
  }
  
  return `${baseStyles} ${sizeStyles[size]} ${modeStyles[mode]} ${className || ''}`
}
