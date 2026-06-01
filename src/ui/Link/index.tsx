'use client'

import { ReactNode, AnchorHTMLAttributes, MouseEvent } from 'react'
import NextLink from 'next/link'
import { Link as IntlLink } from '@/i18n/navigation'
import { useNavigationLoading } from '@/components/NavigationLoadingProvider'
import { cn } from '@/utils'

interface LinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string
  children: ReactNode
  className?: string
  target?: string
  rel?: string
  external?: boolean
}

const isModifiedClick = (event: MouseEvent<HTMLAnchorElement>) => {
  return event.metaKey || event.ctrlKey || event.shiftKey || event.altKey
}

const shouldStartNavigationLoading = (
  event: MouseEvent<HTMLAnchorElement>,
  external: boolean,
) => {
  if (
    external ||
    event.defaultPrevented ||
    event.button !== 0 ||
    isModifiedClick(event)
  ) {
    return false
  }

  const anchor = event.currentTarget

  if (anchor.target && anchor.target !== '_self') {
    return false
  }

  const href = anchor.getAttribute('href')
  if (!href || href.startsWith('#')) {
    return false
  }

  const url = new URL(anchor.href)
  const currentUrl = new URL(window.location.href)

  if (url.origin !== currentUrl.origin) {
    return false
  }

  return url.pathname !== currentUrl.pathname || url.search !== currentUrl.search
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
  onClick,
  ...props 
}: LinkProps) {
  const { startNavigationLoading } = useNavigationLoading()

  // 使用 cn 管理 className，合并默认样式
  const linkClassName = cn(
    'text-inherit no-underline hover:no-underline cursor-pointer', // 默认样式
    className // 用户自定义样式
  )

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event)

    if (shouldStartNavigationLoading(event, external)) {
      startNavigationLoading()
    }
  }
  
  // 外部链接使用 NextLink
  if (external) {
    return (
      <NextLink
        href={href}
        className={linkClassName}
        target={target}
        rel={rel}
        onClick={handleClick}
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
      target={target}
      rel={rel}
      onClick={handleClick}
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
