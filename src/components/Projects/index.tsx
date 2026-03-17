'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { categorizeProject } from '@/server/github/transformers/stats'
import type { ProcessedRepository, ProjectStats } from '@/server/github'
import { ExpandableWaterfall } from '@/components/Waterfall'
import { BriefProjectCard, DetailProjectCard } from './ProjectCard'
import { ProjectFilter } from './ProjectFilter'
import { StatsOverview } from './StatsOverview'

interface ProjectsSectionClientProps {
  projects: ProcessedRepository[]
  stats: ProjectStats | null
}

export default function ProjectsSectionClient({
  projects,
  stats,
}: ProjectsSectionClientProps) {
  const t = useTranslations('Projects')
  const searchParams = useSearchParams()

  const [filteredProjects, setFilteredProjects] = useState<ProcessedRepository[]>(projects)

  useEffect(() => {
    setFilteredProjects(projects)
  }, [projects])

  useEffect(() => {
    const hasParams = searchParams.toString().length > 0
    if (hasParams) {
      setTimeout(() => {
        const filterElement = document.getElementById('project-filter')
        if (filterElement) {
          const rect = filterElement.getBoundingClientRect()
          const scrollTop = window.scrollY + rect.top - 100
          window.scrollTo({ top: Math.max(0, scrollTop), behavior: 'smooth' })
        }
      }, 300)
    }
  }, [searchParams])

  const handleFilteredProjectsChange = useCallback((nextProjects: ProcessedRepository[]) => {
    setFilteredProjects(nextProjects)
  }, [])

  const waterfallItems = useMemo(() => {
    return filteredProjects.map((project) => {
      const category = categorizeProject({
        archived: project.isArchived,
        fork: project.isFork,
        updated_at: project.updatedAt.toISOString(),
        name: project.name,
        description: project.description,
      })

      return {
        id: project.id.toString(),
        content: <BriefProjectCard project={project} category={category} />,
        expandedContent: <DetailProjectCard project={project} category={category} />,
        height: 'medium' as const,
        anchorId: `project-${project.id}`,
      }
    })
  }, [filteredProjects])

  return (
    <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 min-h-[calc(100vh-64px)]">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-4xl font-bold mb-2">{t('title')}</h1>
        <p className="text-base sm:text-xl text-gray-600">{t('description')}</p>
      </div>

      {stats && (
        <StatsOverview stats={stats} className="mb-6 sm:mb-8" />
      )}

      <div id="project-filter" className="mb-6 sm:mb-8">
        <ProjectFilter
          projects={projects}
          onFilteredProjectsChange={handleFilteredProjectsChange}
        />
      </div>

      {waterfallItems.length > 0 ? (
        <>
          <div className="block md:hidden">
            <ExpandableWaterfall items={waterfallItems} columns={1} gap={16} />
          </div>
          <div className="hidden md:block">
            <ExpandableWaterfall items={waterfallItems} columns={2} gap={24} />
          </div>
        </>
      ) : (
        <div className="py-12 text-center">
          <p className="text-gray-500 text-base sm:text-lg">暂无项目</p>
        </div>
      )}
    </div>
  )
}


