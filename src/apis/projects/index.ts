import { httpRequest } from '@/apis/http'
import type { ProjectDetailPayload, ProjectsPayload } from '@/types/api'

export interface GetProjectsParams {
  keyword?: string
  search?: string
  pinned?: boolean | null
  owned?: boolean | null
  contributed?: boolean | null
  fork?: boolean | null
  archived?: boolean | null
  sort?: string | null
  page?: number
  pageSize?: number
}

export const getProjects = (params?: GetProjectsParams) => {
  return httpRequest<ProjectsPayload>({
    url: '/projects',
    method: 'GET',
    params,
  })
}

export const getProjectDetail = (projectId: number | string) => {
  return httpRequest<ProjectDetailPayload>({
    url: `/projects/${projectId}`,
    method: 'GET',
  })
}
