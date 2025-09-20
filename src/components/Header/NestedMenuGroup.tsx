'use client'

import Link from 'next/link'
import { SubmenuItem } from '@/constants'

interface NestedMenuGroupProps {
  items: SubmenuItem[]
  onClose: () => void
  level?: number
}

export default function NestedMenuGroup({ items, onClose, level = 0 }: NestedMenuGroupProps) {
  if (level === 0) {
    // 顶级菜单项，使用网格布局 - 减小字体和间距
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item, index) => (
          <div key={index} className="group">
            {/* 主菜单项 */}
            <Link
              href={item.href}
              className="block p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300 border border-transparent hover:border-gray-200 dark:hover:border-gray-700 hover:shadow-lg"
              onClick={onClose}
            >
              <div className="mb-3">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-2">
                  {item.label}
                </h3>
                {item.description && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors">
                    {item.description}
                  </p>
                )}
              </div>
              
              <div className="flex items-center text-blue-600 dark:text-blue-400 group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors">
                <span className="text-sm font-medium">
                  {item.items && item.items.length > 0 ? '查看详情' : '了解更多'}
                </span>
                <svg className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>

            {/* 子菜单项 */}
            {item.items && item.items.length > 0 && (
              <div className="mt-3 pl-2 border-l-2 border-gray-200 dark:border-gray-700">
                <h4 className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {item.label} - 子分类
                </h4>
                <div className="space-y-1">
                  {item.items.map((subItem, subIndex) => (
                    <Link
                      key={subIndex}
                      href={subItem.href}
                      className="block p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      onClick={onClose}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h5 className="text-sm font-medium text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                            {subItem.label}
                          </h5>
                          {subItem.description && (
                            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                              {subItem.description}
                            </p>
                          )}
                        </div>
                        <svg className="ml-2 h-3 w-3 text-gray-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    )
  }

  // 嵌套级别使用不同的布局 - 减小字体和间距
  return (
    <div className="space-y-3">
      {items.map((item, index) => (
        <div key={index} className="border-l-2 border-gray-200 dark:border-gray-700 pl-3">
          <Link
            href={item.href}
            className="block p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            onClick={onClose}
          >
            <h4 className="text-sm font-medium text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              {item.label}
            </h4>
            {item.description && (
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                {item.description}
              </p>
            )}
          </Link>
          
          {/* 递归渲染更深层的嵌套 */}
          {item.items && item.items.length > 0 && (
            <div className="mt-2 ml-3">
              <NestedMenuGroup 
                items={item.items} 
                onClose={onClose} 
                level={level + 1} 
              />
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
