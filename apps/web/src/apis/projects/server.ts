import { serverHttpData } from '@/apis/server-http'
import type { ProjectsPayload } from '@/types/api'

export const getProjectsOnServer = async () => {
  return serverHttpData<ProjectsPayload>('/projects', {
    cache: 'no-store',
  })
}
