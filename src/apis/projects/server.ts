import { serverHttpData } from '@/apis/http'
import type { ProjectsPayload } from '@/types/api'

export const getProjectsOnServer = async () => {
  return serverHttpData<ProjectsPayload>('/projects')
}
