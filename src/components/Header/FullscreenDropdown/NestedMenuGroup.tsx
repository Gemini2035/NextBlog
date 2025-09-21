'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { SubmenuItem } from '@/constants'

// 样式辅助函数 - 减少三目选择器的使用
function getItemStyles(columnIndex: number) {
  const isPrimaryColumn = columnIndex === 0
  
  return {
    titleClass: `font-semibold text-gray-900 group-hover:text-gray-800 transition-colors duration-200 ${
      isPrimaryColumn ? 'text-lg font-bold' : 'text-base font-normal'
    }`,
    descriptionClass: `text-gray-600 mt-1 group-hover:text-gray-700 transition-colors duration-200 ${
      isPrimaryColumn ? 'text-sm' : 'text-sm'
    }`
  }
}

interface NestedMenuGroupProps {
  items: SubmenuItem[]
  onClose: () => void
  level?: number
  isAnimating?: boolean
}

// 动画变体 - 纯淡入淡出效果
const itemVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 }
}

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.04, // 进一步减少延迟时间
      delayChildren: 0.05 // 减少初始延迟
    }
  }
}

export default function NestedMenuGroup({ items, onClose, level = 0, isAnimating = true }: NestedMenuGroupProps) {
  if (level === 0) {
    // 顶级菜单项，使用苹果风格的三列布局
    // 将items分成三列
    const columns = [
      items.filter((_, index) => index % 3 === 0), // 第一列
      items.filter((_, index) => index % 3 === 1), // 第二列
      items.filter((_, index) => index % 3 === 2)  // 第三列
    ]

    return (
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate={isAnimating ? "visible" : "hidden"}
      >
        {columns.map((columnItems, columnIndex) => (
          <motion.div 
            key={columnIndex}
            className="space-y-6"
            variants={itemVariants}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            {/* 列标题 */}
            <motion.div 
              className="mb-6"
              variants={itemVariants}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
            >
              <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                {columnIndex === 0 ? '主要分类' : columnIndex === 1 ? '快速链接' : '特殊分类'}
              </h3>
            </motion.div>

            {/* 列内容 */}
            <motion.ul 
              className="space-y-3"
              variants={containerVariants}
              transition={{ staggerChildren: 0.05 }}
            >
              {columnItems.map((item, itemIndex) => {
                const styles = getItemStyles(columnIndex)
                
                return (
                  <motion.li
                    key={itemIndex}
                    variants={itemVariants}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                  >
                    <Link
                      href={item.href}
                      className="block group"
                      onClick={onClose}
                      onMouseEnter={(e) => {
                        // 阻止事件冒泡，确保submenu保持打开
                        e.stopPropagation()
                      }}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className={styles.titleClass}>
                            {item.label}
                          </h4>
                          {item.description && (
                            <p className={styles.descriptionClass}>
                              {item.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </Link>

                    {/* 子菜单项 */}
                    {item.items && item.items.length > 0 && (
                      <motion.ul 
                        className="mt-4 space-y-2"
                        variants={itemVariants}
                        transition={{ duration: 0.4, ease: "easeOut", delay: 0.1 }}
                      >
                        {item.items.slice(0, 6).map((subItem, subIndex) => (
                          <li key={subIndex}>
                            <Link
                              href={subItem.href}
                              className="block text-sm text-gray-700 hover:text-gray-800 transition-colors duration-200 leading-relaxed"
                              onClick={onClose}
                              onMouseEnter={(e) => {
                                // 阻止事件冒泡，确保submenu保持打开
                                e.stopPropagation()
                              }}
                            >
                              {subItem.label}
                            </Link>
                          </li>
                        ))}
                        {item.items.length > 6 && (
                          <li className="text-xs text-gray-500 mt-2">
                            还有 {item.items.length - 6} 个...
                          </li>
                        )}
                      </motion.ul>
                    )}
                  </motion.li>
                )
              })}
            </motion.ul>
          </motion.div>
        ))}
      </motion.div>
    )
  }

  // 嵌套级别使用不同的布局 - 减小字体和间距
  return (
    <motion.ul 
      className="space-y-3"
      variants={containerVariants}
      initial="hidden"
      animate={isAnimating ? "visible" : "hidden"}
    >
      {items.map((item, index) => (
        <motion.li 
          key={index} 
          className="border-l-2 border-gray-200 pl-3"
          variants={itemVariants}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <Link
            href={item.href}
            className="block p-2 rounded-md hover:bg-gray-100 transition-colors"
            onClick={onClose}
            onMouseEnter={(e) => {
              // 阻止事件冒泡，确保submenu保持打开
              e.stopPropagation()
            }}
          >
            <h4 className="text-sm font-medium text-gray-900 hover:text-gray-800 transition-colors">
              {item.label}
            </h4>
            {item.description && (
              <p className="text-xs text-gray-600 mt-1">
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
        </motion.li>
      ))}
    </motion.ul>
  )
}