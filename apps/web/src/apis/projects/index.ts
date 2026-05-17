import { httpRequest, getApiBaseUrl } from '@/apis/http'
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

export const getProjectsOnServer = async () => {
  const response = await fetch(`${getApiBaseUrl()}/projects`, {
    cache: 'no-store',
  })

  if (!response.ok) {
    throw new Error(`Projects REST 请求失败，状态码：${response.status}`)
  }

  const json = (await response.json()) as {
    code: number
    message: string
    data: ProjectsPayload
  }

  if (json.code !== 0) {
    throw new Error(json.message || 'Projects REST 返回错误')
  }

  return json.data
}
