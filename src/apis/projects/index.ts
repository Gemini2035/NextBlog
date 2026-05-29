import { httpRequest } from '@/apis/http'
import type { ProjectDetailPayload, ProjectsPayload } from '@/types/api'

export const getProjects = (params?: Record<string, unknown>) => {
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
