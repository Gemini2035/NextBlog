import ServerComponent from '@/components/ServerComponent'
import ProjectsClient from '@/components/Projects'
import { getProjectsOnServer } from '@/apis/projects/server'

async function fetchProjectsOnServer() {
  const payload = await getProjectsOnServer().catch(() => ({
    projects: [],
    stats: null,
    rateLimit: null,
  }))

  return {
    projects: payload.projects,
    stats: payload.stats,
    rateLimit: payload.rateLimit ?? null,
  }
}

export default async function ProjectsPage() {
  return <ServerComponent fetchServerData={fetchProjectsOnServer} ClientComponent={ProjectsClient} />
}
