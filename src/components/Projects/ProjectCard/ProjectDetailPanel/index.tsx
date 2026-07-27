'use client'

import useSWR from 'swr'
import { getProjectDetail } from '@/apis/projects'
import { SiteLoadingIcon } from '@/components/SiteLoadingIcon'
import type { ProjectCategory } from '@/types/projects'
import { DetailProjectCard } from '../DetailProjectCard'

interface ProjectDetailPanelProps {
  projectId: number
  category?: ProjectCategory
}

export function ProjectDetailPanel({ projectId, category }: ProjectDetailPanelProps) {
  const { data, error, isLoading } = useSWR(
    ['project-detail', projectId],
    async () => {
      const response = await getProjectDetail(projectId)
      return response.data.project
    },
    {
      revalidateOnFocus: false,
      shouldRetryOnError: false,
    }
  )

  if (isLoading) {
    return (
      <div className="flex min-h-[420px] items-center justify-center py-12">
        <SiteLoadingIcon className="text-[var(--site-action)]" />
      </div>
    )
  }

  if (error || !data) {
    return <div className="min-h-[220px] py-12 text-center text-sm text-[var(--site-text-tertiary)]">项目详情加载失败</div>
  }

  return (
    <div className="pt-8 sm:pt-10">
      <DetailProjectCard project={data} category={category} />
    </div>
  )
}
