/**
 * 数据转换器 - 将 GitHub REST API 响应转换为应用数据格式
 */

import type {
  RestRepoDetail,
  RestRepoLanguages,
} from '../types/rest'
import type { ProcessedRepository, LanguageStat } from '../types/processed'

/** 常见语言颜色（REST API 不返回颜色，使用默认） */
const LANGUAGE_COLORS: Record<string, string> = {
  JavaScript: '#f1e05a',
  TypeScript: '#3178c6',
  Vue: '#41b883',
  HTML: '#e34c26',
  CSS: '#563d7c',
  Python: '#3572A5',
  Rust: '#dea584',
  Go: '#00ADD8',
  Java: '#b07219',
  Kotlin: '#A97BFF',
  Swift: '#F05138',
  C: '#555555',
  'C++': '#f34b7d',
  Shell: '#89e051',
  Ruby: '#701516',
  PHP: '#4F5D95',
}

function getLanguageColor(name: string): string {
  return LANGUAGE_COLORS[name] ?? '#cccccc'
}

/**
 * 将 REST 仓库数据转换为 ProcessedRepository
 */
export function transformRestRepoToProcessed(
  repo: RestRepoDetail,
  languages?: RestRepoLanguages | null,
  isFeatured: boolean = false
): ProcessedRepository {
  const totalBytes = languages
    ? Object.values(languages).reduce((a, b) => a + b, 0)
    : 0
  const languageStats: LanguageStat[] = languages
    ? Object.entries(languages).map(([name, bytes]) => ({
        name,
        color: getLanguageColor(name),
        percentage: totalBytes > 0 ? (bytes / totalBytes) * 100 : 0,
        bytes,
      }))
    : []

  return {
    id: repo.id,
    name: repo.name,
    fullName: repo.full_name,
    description: repo.description ?? '',
    url: repo.html_url,
    homepage: repo.homepage ?? null,
    owner: {
      login: repo.owner.login,
      avatarUrl: repo.owner.avatar_url,
      url: repo.owner.html_url,
    },
    stars: repo.parent && repo.fork ? repo.parent.stargazers_count : repo.stargazers_count,
    forks: repo.parent && repo.fork ? repo.parent.forks_count : repo.forks_count,
    watchers: repo.watchers_count,
    openIssues: repo.open_issues_count,
    openPullRequests: undefined,
    primaryLanguage: repo.language
      ? { name: repo.language, color: getLanguageColor(repo.language) }
      : null,
    languages: languages ?? undefined,
    languageStats: languageStats.length ? languageStats : undefined,
    topics: repo.topics ?? [],
    isFork: repo.fork,
    isArchived: repo.archived,
    isTemplate: !!repo.template_repository,
    isPrivate: repo.private,
    isFeatured,
    isPinned: isFeatured,
    license: repo.license?.spdx_id ?? repo.license?.name ?? null,
    defaultBranch: repo.default_branch,
    createdAt: new Date(repo.created_at),
    updatedAt: new Date(repo.updated_at),
    pushedAt: repo.pushed_at ? new Date(repo.pushed_at) : new Date(repo.updated_at),
  }
}

/**
 * 筛选仓库
 */
export function filterRepositories(
  repos: ProcessedRepository[],
  options: {
    includeForked?: boolean
    includeArchived?: boolean
    minStars?: number
    maxProjects?: number
  }
): ProcessedRepository[] {
  let filtered = repos

  if (!options.includeForked) {
    filtered = filtered.filter((repo) => !repo.isFork)
  }

  if (!options.includeArchived) {
    filtered = filtered.filter((repo) => !repo.isArchived)
  }

  if (options.minStars !== undefined && options.minStars > 0) {
    filtered = filtered.filter((repo) => repo.stars >= options.minStars!)
  }

  if (options.maxProjects !== undefined) {
    filtered = filtered.slice(0, options.maxProjects)
  }

  return filtered
}
