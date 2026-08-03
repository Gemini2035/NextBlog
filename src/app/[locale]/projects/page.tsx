import ServerComponent from '@/components/ServerComponent'
import ProjectsClient from '@/components/Projects'
import { getProjectsOnServer } from '@/apis/projects/server'
import type { GetProjectsParams } from '@/apis/projects'

interface ProjectsPageProps {
  searchParams?: Promise<Record<string, string | string[] | undefined>>
}

const getSearchParam = (
  searchParams: Record<string, string | string[] | undefined>,
  key: string,
) => {
  const value = searchParams[key]
  return Array.isArray(value) ? value[0] : value
}

const getBooleanSearchParam = (
  searchParams: Record<string, string | string[] | undefined>,
  key: string,
) => {
  const value = getSearchParam(searchParams, key)
  if (value === 'true') return true
  if (value === 'false') return false
  return undefined
}

const getProjectQueryParams = (
  searchParams: Record<string, string | string[] | undefined>,
): GetProjectsParams => ({
  keyword: getSearchParam(searchParams, 'keyword') ?? getSearchParam(searchParams, 'search'),
  pinned: getBooleanSearchParam(searchParams, 'pinned'),
  owned: getBooleanSearchParam(searchParams, 'owned'),
  contributed: getBooleanSearchParam(searchParams, 'contributed'),
  fork: getBooleanSearchParam(searchParams, 'fork'),
  archived: getBooleanSearchParam(searchParams, 'archived'),
  sort: getSearchParam(searchParams, 'sort'),
  page: 1,
  pageSize: 10,
})

async function fetchProjectsOnServer(searchParams: Record<string, string | string[] | undefined>) {
  const payload = await getProjectsOnServer(getProjectQueryParams(searchParams)).catch(() => ({
    projects: [],
    stats: null,
    total: 0,
    page: 1,
    pageSize: 10,
    totalPages: 0,
    rateLimit: null,
  }))

  return {
    projects: payload.projects,
    stats: payload.stats,
    total: payload.total,
    page: payload.page,
    pageSize: payload.pageSize,
    totalPages: payload.totalPages,
    rateLimit: payload.rateLimit ?? null,
  }
}

export default async function ProjectsPage({ searchParams }: ProjectsPageProps) {
  const resolvedSearchParams = await searchParams
  return <ServerComponent dataPromise={fetchProjectsOnServer(resolvedSearchParams ?? {})} ClientComponent={ProjectsClient} />
}
