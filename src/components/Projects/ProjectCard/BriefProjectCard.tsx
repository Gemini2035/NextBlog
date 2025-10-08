import { useTranslations } from 'next-intl'
import { cn } from '@/utils'
import { ClockIcon, ProjectIcon, StarIcon, ForkIcon, StarFilledIcon } from '@/assets/icons'
import type { ProcessedRepository, ProjectCategory } from '@/services/github'

interface BriefProjectCardProps {
  project: ProcessedRepository
  category?: ProjectCategory
}

/**
 * 项目简要卡片
 * 展示项目名字、描述、创建于、更新于、项目状态
 */
export function BriefProjectCard({ project, category }: BriefProjectCardProps) {
  const t = useTranslations('Projects')
  
  // 格式化日期
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).format(date)
  }

  // 获取分类样式
  const getCategoryStyle = (cat?: ProjectCategory) => {
    switch (cat) {
      case 'featured':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'stable':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'completed':
        return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'archived':
        return 'bg-gray-100 text-gray-600 border-gray-200'
      case 'fork':
        return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'learning':
        return 'bg-pink-100 text-pink-800 border-pink-200'
      default:
        return 'bg-gray-100 text-gray-600 border-gray-200'
    }
  }

  return (
    <div className="space-y-4">
      {/* 项目头部 - 名称和状态 */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <ProjectIcon className="w-5 h-5 text-gray-600 flex-shrink-0" />
          <h3 className="text-lg font-bold text-gray-900 truncate leading-5">
            {project.name}
          </h3>
        </div>
        
        {/* 标签组 - 置顶标签和分类标签 */}
        <div className="flex items-center gap-2">
          {/* 置顶标签 */}
          {project.isPinned && (
            <span className="px-2 py-1 text-xs font-medium rounded border whitespace-nowrap flex items-center gap-1 bg-yellow-100 text-yellow-800 border-yellow-200">
              <StarFilledIcon className="w-3 h-3" />
              {t('project.pinned')}
            </span>
          )}
          
          {/* 分类标签 */}
          {category && (
            <span className={cn(
              'px-2 py-1 text-xs font-medium rounded border whitespace-nowrap flex items-center gap-1',
              getCategoryStyle(category)
            )}>
              {category === 'fork' && <ForkIcon className="w-3 h-3" />}
              {t(`filters.categories.${category}`)}
            </span>
          )}
        </div>
      </div>

      {/* 项目描述 */}
      <p className="text-sm text-gray-600 line-clamp-2 min-h-[2.5rem]">
        {project.description || t('project.noDescription')}
      </p>

      {/* 项目统计 */}
      <div className="flex items-center gap-4 text-xs text-gray-500">
        <div className="flex items-center gap-1">
          <StarIcon className="w-4 h-4" />
          <span>{project.stars}</span>
        </div>
        {project.primaryLanguage && (
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-blue-500" />
            <span>{project.primaryLanguage.name}</span>
          </div>
        )}
      </div>

      {/* 时间信息 */}
      <div className="pt-2 border-t border-gray-100">
        <div className="flex items-center gap-2 text-xs text-gray-500 flex-wrap">
          <ClockIcon className="w-3.5 h-3.5 flex-shrink-0" />
          <span className="whitespace-nowrap">{t('project.created')}: {formatDate(project.createdAt)}</span>
          <span className="text-gray-300">|</span>
          <span className="whitespace-nowrap">{t('project.updated')}: {formatDate(project.updatedAt)}</span>
        </div>
      </div>

      {/* 归档/Fork 状态标识 */}
      {(project.isArchived || project.isFork) && (
        <div className="flex gap-2 text-xs">
          {project.isArchived && (
            <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded">
              {t('project.archived')}
            </span>
          )}
          {project.isFork && (
            <span className="px-2 py-1 bg-orange-100 text-orange-600 rounded">
              {t('project.forked')}
            </span>
          )}
        </div>
      )}
    </div>
  )
}

