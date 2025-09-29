import { forwardRef } from 'react'
import { EmptyStateProps, EmptyStateRef, EmptyStateIconType } from './types'
import { 
  getEmptyStateStyles, 
  getIconContainerStyles, 
  getTitleStyles, 
  getDescriptionStyles, 
  getActionStyles 
} from './styles'
import { EmptyStateIcon } from './EmptyStateIcon'

/**
 * 空状态组件 - 用于展示没有数据时的情况
 * 支持多种图标类型、尺寸和变体
 * 
 * @example
 * ```tsx
 * // 基础用法
 * <EmptyState 
 *   icon="search"
 *   title="No results found"
 *   description="Try searching with different keywords"
 * />
 * 
 * // 带操作按钮
 * <EmptyState 
 *   icon="folder"
 *   title="No files"
 *   description="Upload your first file to get started"
 *   action={<Button>Upload File</Button>}
 * />
 * 
 * // 自定义图标
 * <EmptyState 
 *   icon={<CustomIcon />}
 *   title="Custom empty state"
 *   description="With custom icon"
 * />
 * 
 * // 不同尺寸和变体
 * <EmptyState 
 *   size="lg"
 *   variant="card"
 *   icon="users"
 *   title="No users found"
 *   description="Create your first user account"
 * />
 * ```
 */
export const EmptyState = forwardRef<EmptyStateRef, EmptyStateProps>(
  (
    {
      icon = 'search' as const,
      title,
      description,
      action,
      size = 'md',
      variant = 'default',
      className,
      showIcon = true,
      style,
      ...props
    },
    ref
  ) => {
    // 获取样式类名
    const containerStyles = getEmptyStateStyles(size, variant, className)
    const iconContainerStyles = getIconContainerStyles(size)
    const titleStyles = getTitleStyles(size)
    const descriptionStyles = getDescriptionStyles(size)
    const actionStyles = getActionStyles()

    // 渲染图标
    const renderIcon = () => {
      if (!showIcon) return null
      
      if (typeof icon === 'string') {
        return (
          <div className={iconContainerStyles}>
            <EmptyStateIcon type={icon as EmptyStateIconType} className="w-full h-full" />
          </div>
        )
      }
      
      return (
        <div className={iconContainerStyles}>
          {icon}
        </div>
      )
    }

    return (
      <div
        ref={ref}
        className={containerStyles}
        style={style}
        {...props}
      >
        {renderIcon()}
        
        {title && (
          <h3 className={titleStyles}>
            {title}
          </h3>
        )}
        
        {description && (
          <p className={descriptionStyles}>
            {description}
          </p>
        )}
        
        {action && (
          <div className={actionStyles}>
            {action}
          </div>
        )}
      </div>
    )
  }
)

EmptyState.displayName = 'EmptyState'

export default EmptyState
