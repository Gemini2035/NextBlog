import { serverHttpData } from '@/apis/http'
import type { ProjectsPayload } from '@/types/api'
import type { GetProjectsParams } from './index'

export const getProjectsOnServer = async (params?: GetProjectsParams) => {
  return serverHttpData<ProjectsPayload>('/projects', { params })
}
