'use client'

import { useTranslations } from 'next-intl'
import { EmptyState, Button } from '@/ui'

/**
 * 空状态组件使用示例
 * 展示如何在筛选器中使用空状态组件
 */
export function EmptyStateExample() {
  const t = useTranslations('EmptyState')

  return (
    <div className="space-y-6">
      {/* 基础空状态 */}
      <EmptyState
        icon="search"
        title={t('noResults')}
        description={t('noResultsDescription')}
      />

      {/* 带操作按钮的空状态 */}
      <EmptyState
        icon="folder"
        title={t('noPosts')}
        description={t('noPostsDescription')}
        action={
          <Button type="primary" size="sm">
            清除筛选条件
          </Button>
        }
      />

      {/* 大尺寸卡片样式 */}
      <EmptyState
        size="lg"
        variant="card"
        icon="users"
        title={t('noUsers')}
        description={t('noUsersDescription')}
        action={
          <div className="flex gap-2">
            <Button type="primary" size="sm">
              创建用户
            </Button>
            <Button type="secondary" size="sm">
              刷新
            </Button>
          </div>
        }
      />

      {/* 错误状态 */}
      <EmptyState
        icon="error"
        title={t('error')}
        description={t('errorDescription')}
        action={
          <Button type="primary" size="sm">
            重试
          </Button>
        }
      />

      {/* 加载状态 */}
      <EmptyState
        icon="info"
        title={t('loading')}
        description={t('loadingDescription')}
      />

      {/* 自定义图标 */}
      <EmptyState
        icon={
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-full h-full">
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5" />
            <path d="M2 12l10 5 10-5" />
          </svg>
        }
        title="自定义图标"
        description="使用自定义SVG图标"
      />
    </div>
  )
}
