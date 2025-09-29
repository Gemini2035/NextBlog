import React from 'react'
import NextLink from 'next/link'
import { Link as IntlLink } from '@/i18n/navigation'
import clsx from 'clsx'

interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string
  children: React.ReactNode
  className?: string
  target?: string
  rel?: string
  external?: boolean
}

/**
 * 智能 Link 组件
 * 根据 external 属性判断使用 NextLink 还是 next-intl Link
 * 
 * 判断规则：
 * - external=true: 使用 NextLink（标准 Next.js 链接）
 * - external=false: 使用 next-intl Link（支持国际化）
 */
export default function Link({ 
  href, 
  children, 
  className, 
  target, 
  rel,
  external = false,
  ...props 
}: LinkProps) {
  // 使用 clsx 管理 className，合并默认样式
  const linkClassName = clsx(
    'text-inherit no-underline hover:no-underline cursor-pointer', // 默认样式
    className // 用户自定义样式
  )
  
  // 外部链接使用 NextLink
  if (external) {
    return (
      <NextLink
        href={href}
        className={linkClassName}
        target={target}
        rel={rel}
        {...props}
      >
        {children}
      </NextLink>
    )
  }
  
  // 内部链接使用 next-intl Link（支持国际化）
  return (
    <IntlLink
      href={href}
      className={linkClassName}
      {...props}
    >
      {children}
    </IntlLink>
  )
}

/**
 * 导出类型定义
 */
export type { LinkProps }
