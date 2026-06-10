'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import type { ProjectListItem, ProjectStats } from '@/types/api'
import { categorizeProject } from '@/types/projects'
import { ExpandableWaterfall } from '@/components/Waterfall'
import { BriefProjectCard, ProjectDetailPanel } from './ProjectCard'
import { ProjectFilter } from './ProjectFilter'
import { StatsOverview } from './StatsOverview'

interface ProjectsClientProps {
  projects: ProjectListItem[]
  stats: ProjectStats | null
}

export default function ProjectsClient({
  projects,
  stats,
}: ProjectsClientProps) {
  const t = useTranslations('Projects')
  const searchParams = useSearchParams()

  const [filteredProjects, setFilteredProjects] = useState<ProjectListItem[]>(projects)

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

  const handleFilteredProjectsChange = useCallback((nextProjects: ProjectListItem[]) => {
    setFilteredProjects(nextProjects)
  }, [])

  const waterfallItems = useMemo(() => {
    return filteredProjects.map((project) => {
      const category = categorizeProject(project)

      return {
        id: project.id.toString(),
        content: <BriefProjectCard project={project} category={category} />,
        expandedContent: <ProjectDetailPanel projectId={project.id} category={category} />,
        height: 'medium' as const,
        anchorId: `project-${project.id}`,
      }
    })
  }, [filteredProjects])

  return (
    <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-14 min-h-[calc(100vh-var(--site-nav-height))] text-[var(--site-text)]">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-4xl font-bold mb-2">{t('title')}</h1>
        <p className="text-base sm:text-xl text-[var(--site-text-muted)]">{t('description')}</p>
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
          <p className="text-[var(--site-text-tertiary)] text-base sm:text-lg">暂无项目</p>
        </div>
      )}
    </div>
  )
}
