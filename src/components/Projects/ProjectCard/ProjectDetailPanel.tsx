'use client'

import useSWR from 'swr'
import { getProjectDetail } from '@/apis/projects'
import type { ProjectCategory } from '@/types/projects'
import { DetailProjectCard } from './DetailProjectCard'

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
    return <div className="py-10 text-center text-sm text-gray-500">加载中...</div>
  }

  if (error || !data) {
    return <div className="py-10 text-center text-sm text-red-500">项目详情加载失败</div>
  }

  return <DetailProjectCard project={data} category={category} />
}
