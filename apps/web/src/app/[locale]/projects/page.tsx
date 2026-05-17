import ServerComponent from '@/components/ServerComponent'
import ProjectsClient from '@/components/Projects'
import { getProjectsOnServer } from '@/apis/projects'

async function fetchProjectsOnServer() {
  const payload = await getProjectsOnServer()

  return {
    projects: payload.projects,
    stats: payload.stats,
    rateLimit: payload.rateLimit ?? null,
  }
}

export default async function ProjectsPage() {
  return <ServerComponent fetchServerData={fetchProjectsOnServer} ClientComponent={ProjectsClient} />
}
