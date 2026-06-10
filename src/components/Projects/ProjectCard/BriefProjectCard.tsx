import { useTranslations } from 'next-intl'
import { cn } from '@/utils'
import { ClockIcon, ProjectIcon, StarIcon, ForkIcon, StarFilledIcon } from '@/assets/icons'
import type { ProjectListItem } from '@/types/api'
import type { ProjectCategory } from '@/types/projects'

interface BriefProjectCardProps {
  project: ProjectListItem
  category?: ProjectCategory
}

/**
 * 项目简要卡片
 * 展示项目名字、描述、创建于、更新于、项目状态
 */
export function BriefProjectCard({ project, category }: BriefProjectCardProps) {
  const t = useTranslations('Projects')
  
  // 格式化日期
  const formatDate = (date: string) => {
    return new Intl.DateTimeFormat('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).format(new Date(date))
  }

  // 获取分类样式
  const getCategoryStyle = (cat?: ProjectCategory) => {
    return cat === 'featured'
      ? 'bg-[var(--site-surface)] text-[var(--site-action)] border-[var(--site-action)]'
      : 'bg-[var(--site-surface)] text-[var(--site-text-muted)] border-[var(--site-border)]'
  }

  return (
    <div className="space-y-4">
      {/* 项目头部 - 名称和状态 */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <ProjectIcon className="w-5 h-5 text-[var(--site-text-muted)] shrink-0" />
          <h3 className="text-lg font-semibold text-[var(--site-text)] truncate leading-5">
            {project.name}
          </h3>
        </div>
        
        {/* 标签组 - 置顶标签和分类标签 */}
        <div className="flex items-center gap-2">
          {/* 置顶标签 */}
          {project.isPinned && (
            <span className="px-2 py-1 text-xs font-normal rounded-[var(--site-radius-chip)] border whitespace-nowrap flex items-center gap-1 bg-[var(--site-surface)] text-[var(--site-action)] border-[var(--site-action)]">
              <StarFilledIcon className="w-3 h-3" />
              {t('project.pinned')}
            </span>
          )}
          
          {/* 分类标签 */}
          {category && (
            <span className={cn(
                'px-2 py-1 text-xs font-normal rounded-[var(--site-radius-chip)] border whitespace-nowrap flex items-center gap-1',
              getCategoryStyle(category)
            )}>
              {category === 'fork' && <ForkIcon className="w-3 h-3" />}
              {t(`filters.categories.${category}`)}
            </span>
          )}
        </div>
      </div>

      {/* 项目描述 */}
      <p className="text-sm text-[var(--site-text-muted)] line-clamp-2 min-h-10">
        {project.description || t('project.noDescription')}
      </p>

      {/* 项目统计 */}
      <div className="flex items-center gap-4 text-xs text-[var(--site-text-tertiary)]">
        <div className="flex items-center gap-1">
          <StarIcon className="w-4 h-4" />
          <span>{project.stars}</span>
        </div>
        {project.primaryLanguage && (
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-[var(--site-action)]" />
            <span>{project.primaryLanguage.name}</span>
          </div>
        )}
      </div>

      {/* 时间信息 */}
      <div className="pt-2 border-t border-[var(--site-border)]">
        <div className="flex items-center gap-2 text-xs text-[var(--site-text-tertiary)] flex-wrap">
          <ClockIcon className="w-3.5 h-3.5 shrink-0" />
          <span className="whitespace-nowrap">{t('project.created')}: {formatDate(project.createdAt)}</span>
          <span className="text-[var(--site-border)]">|</span>
          <span className="whitespace-nowrap">{t('project.updated')}: {formatDate(project.updatedAt)}</span>
        </div>
      </div>

      {/* 归档/Fork 状态标识 */}
      {(project.isArchived || project.isFork) && (
        <div className="flex gap-2 text-xs">
          {project.isArchived && (
            <span className="px-2 py-1 bg-[var(--site-surface)] text-[var(--site-text-tertiary)] rounded-[var(--site-radius-chip)]">
              {t('project.archived')}
            </span>
          )}
          {project.isFork && (
            <span className="px-2 py-1 bg-[var(--site-surface)] text-[var(--site-text-tertiary)] rounded-[var(--site-radius-chip)]">
              {t('project.forked')}
            </span>
          )}
        </div>
      )}
    </div>
  )
}
