'use client'

import { useState, type ReactNode } from 'react'
import { cn } from '@/utils'

export interface TabItem {
  key: string
  label: ReactNode
  children: ReactNode
  disabled?: boolean
}

export interface TabProps {
  items: TabItem[]
  defaultActiveKey?: string
  activeKey?: string
  onChange?: (key: string) => void
  className?: string
  tabBarClassName?: string
  tabContentClassName?: string
  size?: 'small' | 'medium' | 'large'
  type?: 'line' | 'card'
}

/**
 * Tab组件 - 参考Ant Design设计
 */
export function Tab({
  items,
  defaultActiveKey,
  activeKey,
  onChange,
  className,
  tabBarClassName,
  tabContentClassName,
  size = 'medium',
  type = 'line'
}: TabProps) {
  const [internalActiveKey, setInternalActiveKey] = useState(
    activeKey || defaultActiveKey || items[0]?.key || ''
  )

  const currentActiveKey = activeKey || internalActiveKey

  const handleTabClick = (key: string, disabled?: boolean) => {
    if (disabled) return
    
    if (!activeKey) {
      setInternalActiveKey(key)
    }
    onChange?.(key)
  }

  const activeItem = items.find(item => item.key === currentActiveKey)

  // 尺寸样式
  const sizeStyles = {
    small: {
      tabBar: 'h-8',
      tab: 'px-3 py-1 text-sm',
      content: 'pt-3'
    },
    medium: {
      tabBar: 'h-10',
      tab: 'px-4 py-2 text-sm',
      content: 'pt-4'
    },
    large: {
      tabBar: 'h-12',
      tab: 'px-6 py-3 text-base',
      content: 'pt-6'
    }
  }

  // 类型样式
  const typeStyles = {
    line: {
      tabBar: 'border-b border-gray-200',
      tab: 'border-b-2 border-transparent hover:text-blue-600 hover:border-blue-300',
      activeTab: 'text-blue-600 border-blue-500',
      content: ''
    },
    card: {
      tabBar: 'bg-gray-50 rounded-lg p-1',
      tab: 'rounded-md hover:bg-white hover:text-blue-600',
      activeTab: 'bg-white text-blue-600 shadow-sm',
      content: 'bg-white rounded-lg border border-gray-200 mt-2'
    }
  }

  return (
    <div className={cn('w-full', className)}>
      {/* Tab导航栏 - 右上角 */}
      <div className={cn(
        'flex items-center justify-end',
        sizeStyles[size].tabBar,
        typeStyles[type].tabBar,
        tabBarClassName
      )}>
        {items.map((item) => {
          const isActive = item.key === currentActiveKey
          const isDisabled = item.disabled

          return (
            <button
              key={item.key}
              onClick={() => handleTabClick(item.key, isDisabled)}
              disabled={isDisabled}
              className={cn(
                'flex items-center justify-center font-medium transition-all duration-200 focus:outline-none',
                sizeStyles[size].tab,
                isActive ? typeStyles[type].activeTab : typeStyles[type].tab,
                isDisabled && 'opacity-50 cursor-not-allowed hover:text-gray-500 hover:border-transparent'
              )}
            >
              {item.label}
            </button>
          )
        })}
      </div>

      {/* Tab内容 */}
      <div className={cn(
        sizeStyles[size].content,
        typeStyles[type].content,
        tabContentClassName
      )}>
        {activeItem?.children}
      </div>
    </div>
  )
}

export default Tab
