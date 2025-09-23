'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import clsx from 'clsx'
import { SubmenuItem } from '@/constants'
import { useTranslations } from 'next-intl'

// 辅助函数 - 减少三目运算符的使用
function getFlexClasses(columnCount: number): string {
  if (columnCount === 1) {
    return 'flex-col'
  }
  if (columnCount === 2) {
    return 'flex-col md:flex-row'
  }
  return 'flex-col md:flex-row lg:flex-row'
}

function getAnimationState(isAnimating: boolean): "visible" | "hidden" {
  return isAnimating ? "visible" : "hidden"
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
  const t = useTranslations('Navigation')
  
  
  if (level === 0) {
    // 顶级菜单项，使用基于JSON分类的布局
    // 每个分类作为一列，左对齐分布
    const columnCount = Math.min(items.length, 3) // 最多3列
    const flexClasses = getFlexClasses(columnCount)
    const animationState = getAnimationState(isAnimating)

    return (
      <motion.div 
        className={clsx('flex gap-24 max-w-6xl', flexClasses)}
        variants={containerVariants}
        initial="hidden"
        animate={animationState}
      >
        {items.map((item, columnIndex) => (
          <motion.div 
            key={columnIndex}
            className="space-y-6"
            variants={itemVariants}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            {/* 分类标题 */}
            <motion.div 
              className="mb-4"
              variants={itemVariants}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
            >
              <h3 className="text-sm font-semibold text-gray-900 mb-1">
                {t(item.label)}
              </h3>
              {item.description && (
                <p className="text-xs text-gray-600">
                  {t(item.description)}
                </p>
              )}
            </motion.div>

            {/* 分类内容 */}
            <motion.ul 
              className="space-y-3"
              variants={containerVariants}
              transition={{ staggerChildren: 0.05 }}
            >
              {item.items && item.items.map((subItem, itemIndex) => (
                <motion.li
                  key={itemIndex}
                  variants={itemVariants}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                >
                  <Link
                    href={subItem.href}
                    className="block group"
                    onClick={onClose}
                    onMouseEnter={(e) => {
                      // 阻止事件冒泡，确保submenu保持打开
                      e.stopPropagation()
                    }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="text-base font-medium text-gray-900 group-hover:text-gray-800 transition-colors duration-200">
                          {subItem.label}
                        </h4>
                        {subItem.description && (
                          <p className="text-sm text-gray-600 mt-1 group-hover:text-gray-700 transition-colors duration-200">
                            {subItem.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </Link>

                  {/* 子菜单项 */}
                  {subItem.items && subItem.items.length > 0 && (
                    <motion.ul 
                      className="mt-3 space-y-2"
                      variants={itemVariants}
                      transition={{ duration: 0.4, ease: "easeOut", delay: 0.1 }}
                    >
                      {subItem.items.slice(0, 6).map((subSubItem, subIndex) => (
                        <li key={subIndex}>
                          <Link
                            href={subSubItem.href}
                            className="block text-sm text-gray-700 hover:text-gray-800 transition-colors duration-200 leading-relaxed pl-2"
                            onClick={onClose}
                            onMouseEnter={(e) => {
                              // 阻止事件冒泡，确保submenu保持打开
                              e.stopPropagation()
                            }}
                          >
                            {t(subSubItem.label)}
                          </Link>
                        </li>
                      ))}
                      {subItem.items.length > 6 && (
                        <li className="text-xs text-gray-500 mt-2 pl-2">
                          {`还有 ${subItem.items.length - 6} 个...`}
                        </li>
                      )}
                    </motion.ul>
                  )}
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>
        ))}
      </motion.div>
    )
  }

  // 嵌套级别使用不同的布局 - 减小字体和间距
  const animationState = getAnimationState(isAnimating)
  
  return (
    <motion.ul 
      className="space-y-3"
      variants={containerVariants}
      initial="hidden"
      animate={animationState}
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
              {t(item.label)}
            </h4>
            {item.description && (
              <p className="text-xs text-gray-600 mt-1">
                {t(item.description)}
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