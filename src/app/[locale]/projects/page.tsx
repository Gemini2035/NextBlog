import { ProcessedRepository, ProjectStats } from '@/server'
import { graphqlRequest } from '@/graphql'
import { GithubProjectsResultDto, GITHUB_PROJECTS_QUERY } from '@/graphql/queries/githubProjects.graphql'
import ServerComponent from '@/components/ServerComponent'
import ProjectsClient from '@/components/Projects'

async function fetchProjectsOnServer() {
  const data = await graphqlRequest<GithubProjectsResultDto>(GITHUB_PROJECTS_QUERY)

  const payload = data.githubProjects

  if (!payload) {
    throw new Error('GitHub GraphQL 响应中缺少 data.githubProjects 字段')
  }

  if (payload.error) {
    throw new Error(payload.error)
  }

  const projects: ProcessedRepository[] = payload.projects.map((p) => ({
    id: p.id,
    name: p.name,
    fullName: p.fullName,
    description: p.description,
    url: p.url,
    homepage: p.homepage,
    owner: {
      login: p.owner.login,
      avatarUrl: p.owner.avatarUrl,
      url: p.owner.url,
    },
    stars: p.stars,
    forks: p.forks,
    watchers: p.watchers,
    openIssues: p.openIssues,
    primaryLanguage: p.primaryLanguage
      ? {
          name: p.primaryLanguage.name,
          color: p.primaryLanguage.color,
        }
      : null,
    languages: p.languages.reduce<Record<string, number>>((acc, name) => {
      acc[name] = 0
      return acc
    }, {}),
    languageStats: p.languageStats.map((lang) => ({
      name: lang.name,
      color: lang.color,
      percentage: lang.percentage,
      bytes: lang.bytes,
    })),
    topics: p.topics,
    isFork: p.isFork,
    isArchived: p.isArchived,
    isTemplate: p.isTemplate ?? false,
    isPrivate: p.isPrivate ?? false,
    isFeatured: p.isFeatured ?? false,
    isPinned: p.isPinned ?? false,
    license: p.license,
    defaultBranch: p.defaultBranch ?? 'main',
    createdAt: new Date(p.createdAt),
    updatedAt: new Date(p.updatedAt),
    pushedAt: new Date(p.pushedAt),
    activityScore: p.activityScore ?? undefined,
    displayWeight: p.displayWeight ?? undefined,
    weight: p.weight ?? undefined,
  }))

  const stats: ProjectStats = {
    totalProjects: payload.stats.totalProjects,
    totalStars: payload.stats.totalStars,
    totalForks: payload.stats.totalForks,
    activeProjects: payload.stats.activeProjects,
    archivedProjects: payload.stats.archivedProjects,
    languageDistribution: (payload.stats.languageDistribution ?? []).map((lang) => ({
      name: lang.name,
      color: lang.color,
      percentage: lang.percentage,
      bytes: lang.bytes,
    })),
    categoryDistribution: {} as ProjectStats['categoryDistribution'],
  }

  return {
    projects,
    stats,
    rateLimit: payload.rateLimit,
  }
}

export default async function ProjectsPage() {
  return <ServerComponent fetchServerData={fetchProjectsOnServer} ClientComponent={ProjectsClient} />
}



