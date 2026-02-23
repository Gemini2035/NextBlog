/**
 * 数据转换器 - 将 GraphQL 响应转换为应用数据格式
 */

import type { GraphQLRepository } from '../types/graphql'
import type { ProcessedRepository, LanguageStat, ContributorStat } from '../types/processed'

/**
 * 生成稳定的数字ID（基于字符串的简单hash）
 */
function generateStableId(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32bit integer
  }
  return Math.abs(hash)
}

/**
 * 将 GraphQL 仓库数据转换为 ProcessedRepository
 */
export function transformRepository(
  repo: GraphQLRepository,
  isFeatured: boolean = false
): ProcessedRepository {
  // 转换语言数据
  const languages = transformLanguages(repo.languages)
  const languageStats = calculateLanguageStats(repo.languages)

  // 转换贡献者数据
  const contributorStats = transformContributors(repo.collaborators)

  // 提取 topics
  const topics = repo.repositoryTopics.nodes.map((node) => node.topic.name)

  // 生成稳定的数字ID（使用fullName的hash）
  const stableId = generateStableId(repo.nameWithOwner)
  
  // 调试日志：检查原始数据
  if (process.env.NODE_ENV === 'development') {
    console.log(`📊 转换仓库数据: ${repo.nameWithOwner}`, {
      stargazerCount: repo.stargazerCount,
      forkCount: repo.forkCount,
      watchers: repo.watchers.totalCount,
    })
  }
  
  return {
    // 基本信息
    id: stableId,
    name: repo.name,
    fullName: repo.nameWithOwner,
    description: repo.description || '',
    url: repo.url,
    homepage: repo.homepageUrl || null,

    // 所有者信息
    owner: {
      login: repo.owner.login,
      avatarUrl: repo.owner.avatarUrl,
      url: repo.owner.url,
    },

    // 状态标志
    isPrivate: repo.isPrivate,
    isFork: repo.isFork,
    isArchived: repo.isArchived,
    isTemplate: repo.isTemplate,
    isFeatured,
    isPinned: isFeatured, // 别名：向后兼容

    // 统计数据
    // 如果是 fork 项目，显示原仓库的 star 数
    stars: repo.isFork && repo.parent ? repo.parent.stargazerCount : repo.stargazerCount,
    forks: repo.isFork && repo.parent ? repo.parent.forkCount : repo.forkCount,
    watchers: repo.watchers.totalCount,
    openIssues: repo.issues.totalCount,
    openPullRequests: repo.pullRequests.totalCount,

    // 语言信息
    primaryLanguage: repo.primaryLanguage
      ? {
          name: repo.primaryLanguage.name,
          color: repo.primaryLanguage.color || '#cccccc',
        }
      : null,
    languages,
    languageStats,

    // 贡献者信息
    contributorStats,

    // 时间信息
    createdAt: new Date(repo.createdAt),
    updatedAt: new Date(repo.updatedAt),
    pushedAt: repo.pushedAt ? new Date(repo.pushedAt) : new Date(repo.updatedAt),

    // 许可证
    license: repo.licenseInfo?.name || null,

    // 默认分支
    defaultBranch: repo.defaultBranchRef?.name || 'main',

    // Topics
    topics,
  }
}

/**
 * 批量转换仓库数据
 */
export function transformRepositories(
  repos: GraphQLRepository[],
  featuredRepos: string[] = []
): ProcessedRepository[] {
  return repos.map((repo) => {
    const isFeatured = featuredRepos.includes(repo.name)
    return transformRepository(repo, isFeatured)
  })
}

/**
 * 将 GraphQL 语言数据转换为 Record 格式
 */
function transformLanguages(
  languagesConnection: GraphQLRepository['languages']
): Record<string, number> {
  const languages: Record<string, number> = {}

  languagesConnection.edges.forEach((edge) => {
    languages[edge.node.name] = edge.size
  })

  return languages
}

/**
 * 计算语言统计
 */
function calculateLanguageStats(
  languagesConnection: GraphQLRepository['languages']
): LanguageStat[] {
  const totalSize = languagesConnection.totalSize

  if (totalSize === 0) {
    return []
  }

  return languagesConnection.edges.map((edge) => ({
    name: edge.node.name,
    color: edge.node.color || '#cccccc',
    percentage: (edge.size / totalSize) * 100,
    bytes: edge.size,
  }))
}

/**
 * 转换贡献者数据
 */
function transformContributors(
  collaboratorsConnection: GraphQLRepository['collaborators']
): ContributorStat[] {
  if (!collaboratorsConnection) {
    return []
  }

  return collaboratorsConnection.nodes.map((node) => ({
    login: node.login,
    name: node.name || node.login,
    avatarUrl: node.avatarUrl,
    profileUrl: node.url,
    contributions: 0, // GraphQL API 不直接提供贡献次数
  }))
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

