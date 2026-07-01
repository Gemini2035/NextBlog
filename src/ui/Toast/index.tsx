'use client'

import type { ComponentType } from 'react'
import {
  ToastContainer as GeminiToastContainer,
  toast,
  type ToastClassNames,
  type ToastContainerProps as GeminiToastContainerProps,
  type ToastStateTheme,
  type ToastTheme,
} from 'gemini-uis'
import { cn } from '@/utils'

export type {
  ToastClassNames,
  ToastMethodOptions,
  ToastOptions,
  ToastPosition,
  ToastStateTheme,
  ToastTheme,
  ToastType,
  ToastInstance,
} from 'gemini-uis'

type SiteToastTheme = ToastTheme & {
  topOffset?: string
}

export type ToastContainerProps = Omit<GeminiToastContainerProps, 'theme'> & {
  theme?: SiteToastTheme
  classNames?: ToastClassNames
}

const siteToastTheme: SiteToastTheme = {
  background: 'var(--site-canvas)',
  border: 'var(--site-border)',
  mutedText: 'var(--site-text-tertiary)',
  text: 'var(--site-text)',
  topOffset: 'calc(var(--site-nav-height) + 12px)',
  success: {
    background: 'color-mix(in srgb, #16a34a 8%, var(--site-canvas))',
    border: 'color-mix(in srgb, #16a34a 28%, var(--site-border))',
    text: '#15803d',
  },
  error: {
    background: 'color-mix(in srgb, #d93025 5%, var(--site-canvas))',
    text: 'color-mix(in srgb, #b42318 85%, var(--site-text))',
  },
  warning: {
    background: 'color-mix(in srgb, #f59e0b 6%, var(--site-canvas))',
    text: 'color-mix(in srgb, #92400e 88%, var(--site-text))',
  },
  info: {
    background: 'color-mix(in srgb, var(--site-action) 6%, var(--site-canvas))',
    text: 'var(--site-action)',
  },
}

const mergeStateTheme = (baseTheme: ToastStateTheme | undefined, overrideTheme?: ToastStateTheme) => ({
  ...baseTheme,
  ...overrideTheme,
})

const SiteGeminiToastContainer = GeminiToastContainer as ComponentType<ToastContainerProps>

const ToastContainer = ({
  maxCount = 3,
  position = 'top-center',
  theme,
  classNames,
  ...props
}: ToastContainerProps) => {
  const { success, error, warning, info, ...themeBase } = theme ?? {}

  const resolvedTheme = {
    ...siteToastTheme,
    ...themeBase,
    success: mergeStateTheme(siteToastTheme.success, success),
    error: mergeStateTheme(siteToastTheme.error, error),
    warning: mergeStateTheme(siteToastTheme.warning, warning),
    info: mergeStateTheme(siteToastTheme.info, info),
  }

  const resolvedClassNames = {
    ...classNames,
    stack: cn('items-center gap-0', classNames?.stack),
    toast: cn(
      'w-fit max-w-[calc(100vw-2rem)] items-center rounded-full px-5 py-2.5 shadow-[0_1px_2px_rgba(0,0,0,0.04)] backdrop-blur-sm',
      classNames?.toast
    ),
    icon: cn('!mt-0 self-center', classNames?.icon),
    content: cn('flex-none leading-5', classNames?.content),
    closeButton: cn('self-center', classNames?.closeButton),
  }

  return (
    <SiteGeminiToastContainer
      {...props}
      classNames={resolvedClassNames}
      maxCount={maxCount}
      position={position}
      theme={resolvedTheme}
    />
  )
}

export default ToastContainer
export { toast }
