/**
 * GitHub数据处理工具
 * 将GitHub API原始数据转换为适合展示的格式
 */

import type {
  GitHubRepository,
  GitHubContributor,
  GitHubLanguages,
  ProcessedRepository,
  LanguageStat,
  ContributorStat,
  ProjectCategory,
  ProjectStats,
  ProjectFilters,
  ProjectSortOption,
} from '@/types/github'

/**
 * 语言颜色映射（GitHub官方颜色）
 */
const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: '#3178c6',
  JavaScript: '#f1e05a',
  Python: '#3572A5',
  Java: '#b07219',
  Go: '#00ADD8',
  Rust: '#dea584',
  C: '#555555',
  'C++': '#f34b7d',
  'C#': '#178600',
  Ruby: '#701516',
  PHP: '#4F5D95',
  Swift: '#F05138',
  Kotlin: '#A97BFF',
  Shell: '#89e051',
  HTML: '#e34c26',
  CSS: '#563d7c',
  Vue: '#41b883',
  Dart: '#00B4AB',
  Lua: '#000080',
  R: '#198CE7',
}

/**
 * 处理语言统计数据
 */
export function processLanguages(languages: GitHubLanguages): LanguageStat[] {
  const totalBytes = Object.values(languages).reduce((sum, bytes) => sum + bytes, 0)

  if (totalBytes === 0) {
    return []
  }

  const languageStats = Object.entries(languages)
    .map(([name, bytes]) => ({
      name,
      bytes,
      percentage: (bytes / totalBytes) * 100,
      color: LANGUAGE_COLORS[name] || '#858585',
    }))
    .sort((a, b) => b.bytes - a.bytes)

  return languageStats
}

/**
 * 处理贡献者统计数据
 */
export function processContributors(contributors: GitHubContributor[]): {
  stats: ContributorStat[]
  totalContributions: number
} {
  const totalContributions = contributors.reduce((sum, c) => sum + c.contributions, 0)

  const stats = contributors.map((contributor) => ({
    login: contributor.login,
    avatarUrl: contributor.avatar_url,
    profileUrl: contributor.html_url,
    contributions: contributor.contributions,
    percentage: totalContributions > 0 ? (contributor.contributions / totalContributions) * 100 : 0,
  }))

  return { stats, totalContributions }
}

/**
 * 计算项目活跃度评分
 * 基于更新时间和Star数
 */
export function calculateActivityScore(repo: GitHubRepository): number {
  const now = new Date()
  const updatedAt = new Date(repo.updated_at)
  const daysSinceUpdate = Math.floor((now.getTime() - updatedAt.getTime()) / (1000 * 60 * 60 * 24))

  // 更新时间评分（越近越高，满分100）
  let timeScore = 0
  if (daysSinceUpdate <= 30) {
    timeScore = 100
  } else if (daysSinceUpdate <= 90) {
    timeScore = 80
  } else if (daysSinceUpdate <= 180) {
    timeScore = 60
  } else if (daysSinceUpdate <= 365) {
    timeScore = 40
  } else {
    timeScore = 20
  }

  // Star数评分（对数评分，避免极端值）
  const starScore = Math.min(100, Math.log10(repo.stargazers_count + 1) * 20)

  // 综合评分（70%时间 + 30%Star）
  return timeScore * 0.7 + starScore * 0.3
}

/**
 * 计算项目展示权重
 * 用于排序和推荐
 */
export function calculateDisplayWeight(repo: GitHubRepository): number {
  const stars = repo.stargazers_count
  const forks = repo.forks_count
  const now = new Date()
  const updatedAt = new Date(repo.updated_at)
  const daysSinceUpdate = Math.floor((now.getTime() - updatedAt.getTime()) / (1000 * 60 * 60 * 24))

  // 权重计算公式
  // Star权重40%，Fork权重20%，更新时间权重30%，是否原创10%
  const starWeight = stars * 0.4
  const forkWeight = forks * 0.2
  const updateWeight = Math.max(0, (365 - daysSinceUpdate)) * 0.3
  const originalWeight = repo.fork ? 0 : 10

  return starWeight + forkWeight + updateWeight + originalWeight
}

/**
 * 自动分类项目
 */
export function categorizeProject(repo: GitHubRepository): ProjectCategory {
  if (repo.archived) {
    return 'archived'
  }

  if (repo.fork) {
    return 'fork'
  }

  const now = new Date()
  const updatedAt = new Date(repo.updated_at)
  const daysSinceUpdate = Math.floor((now.getTime() - updatedAt.getTime()) / (1000 * 60 * 60 * 24))

  // 判断是否为学习项目
  const learningKeywords = ['learn', 'tutorial', 'practice', 'demo', 'example', 'study', 'exercise']
  const isLearning = learningKeywords.some(
    (keyword) =>
      repo.name.toLowerCase().includes(keyword) ||
      (repo.description?.toLowerCase() || '').includes(keyword)
  )

  if (isLearning) {
    return 'learning'
  }

  // 根据更新时间判断状态
  if (daysSinceUpdate <= 90) {
    return 'active'
  } else if (daysSinceUpdate <= 180) {
    return 'stable'
  } else {
    return 'completed'
  }
}

/**
 * 处理单个仓库数据
 */
export function processRepository(
  repo: GitHubRepository,
  languages?: GitHubLanguages,
  contributors?: GitHubContributor[]
): ProcessedRepository {
  return {
    id: repo.id,
    name: repo.name,
    fullName: repo.full_name,
    description: repo.description || 'No description provided',
    url: repo.html_url,
    homepage: repo.homepage,
    
    stars: repo.stargazers_count,
    forks: repo.forks_count,
    watchers: repo.watchers_count,
    openIssues: repo.open_issues_count,
    
    primaryLanguage: repo.language,
    languages: languages ? processLanguages(languages) : undefined,
    
    contributors: contributors ? processContributors(contributors).stats : undefined,
    totalContributions: contributors ? processContributors(contributors).totalContributions : undefined,
    
    topics: repo.topics || [],
    isFork: repo.fork,
    isArchived: repo.archived,
    
    license: repo.license?.name || null,
    
    createdAt: new Date(repo.created_at),
    updatedAt: new Date(repo.updated_at),
    pushedAt: new Date(repo.pushed_at),
    
    activityScore: calculateActivityScore(repo),
    displayWeight: calculateDisplayWeight(repo),
  }
}

/**
 * 批量处理仓库数据
 */
export function processRepositories(
  repos: GitHubRepository[],
  detailsMap?: Map<string, { languages?: GitHubLanguages; contributors?: GitHubContributor[] }>
): ProcessedRepository[] {
  return repos.map((repo) => {
    const details = detailsMap?.get(repo.full_name)
    return processRepository(repo, details?.languages, details?.contributors)
  })
}

/**
 * 筛选项目
 */
export function filterProjects(
  projects: ProcessedRepository[],
  filters: ProjectFilters
): ProcessedRepository[] {
  let filtered = [...projects]

  // 筛选分类
  if (filters.category && filters.category.length > 0) {
    filtered = filtered.filter((project) => {
      const category = categorizeProject({
        archived: project.isArchived,
        fork: project.isFork,
        updated_at: project.updatedAt.toISOString(),
        name: project.name,
        description: project.description,
      } as GitHubRepository)
      return filters.category!.includes(category)
    })
  }

  // 筛选语言
  if (filters.languages && filters.languages.length > 0) {
    filtered = filtered.filter((project) => {
      if (!project.primaryLanguage) return false
      return filters.languages!.includes(project.primaryLanguage)
    })
  }

  // 筛选主题
  if (filters.topics && filters.topics.length > 0) {
    filtered = filtered.filter((project) =>
      filters.topics!.some((topic) => project.topics.includes(topic))
    )
  }

  // Star数范围
  if (filters.minStars !== undefined) {
    filtered = filtered.filter((project) => project.stars >= filters.minStars!)
  }
  if (filters.maxStars !== undefined) {
    filtered = filtered.filter((project) => project.stars <= filters.maxStars!)
  }

  // 是否包含Fork项目
  if (filters.includeForked === false) {
    filtered = filtered.filter((project) => !project.isFork)
  }

  // 是否包含归档项目
  if (filters.includeArchived === false) {
    filtered = filtered.filter((project) => !project.isArchived)
  }

  // 搜索文本
  if (filters.searchText) {
    const searchLower = filters.searchText.toLowerCase()
    filtered = filtered.filter(
      (project) =>
        project.name.toLowerCase().includes(searchLower) ||
        project.description.toLowerCase().includes(searchLower) ||
        project.topics.some((topic) => topic.toLowerCase().includes(searchLower))
    )
  }

  return filtered
}

/**
 * 排序项目
 */
export function sortProjects(
  projects: ProcessedRepository[],
  sortBy: ProjectSortOption,
  direction: 'asc' | 'desc' = 'desc'
): ProcessedRepository[] {
  const sorted = [...projects]

  sorted.sort((a, b) => {
    let comparison = 0

    switch (sortBy) {
      case 'stars':
        comparison = a.stars - b.stars
        break
      case 'updated':
        comparison = a.updatedAt.getTime() - b.updatedAt.getTime()
        break
      case 'created':
        comparison = a.createdAt.getTime() - b.createdAt.getTime()
        break
      case 'name':
        comparison = a.name.localeCompare(b.name)
        break
      case 'weight':
        comparison = (a.displayWeight || 0) - (b.displayWeight || 0)
        break
    }

    return direction === 'desc' ? -comparison : comparison
  })

  return sorted
}

/**
 * 生成项目统计信息
 */
export function generateProjectStats(projects: ProcessedRepository[], username?: string): ProjectStats {
  const totalStars = projects.reduce((sum, p) => sum + p.stars, 0)
  const totalForks = projects.reduce((sum, p) => sum + p.forks, 0)

  // 语言分布统计
  const languageMap = new Map<string, number>()
  projects.forEach((project) => {
    if (project.primaryLanguage) {
      languageMap.set(
        project.primaryLanguage,
        (languageMap.get(project.primaryLanguage) || 0) + 1
      )
    }
  })

  const languageDistribution = Array.from(languageMap.entries())
    .map(([name, count]) => ({
      name,
      bytes: count,
      percentage: (count / projects.length) * 100,
      color: LANGUAGE_COLORS[name] || '#858585',
    }))
    .sort((a, b) => b.bytes - a.bytes)

  // 分类分布统计
  const categoryDistribution: Record<ProjectCategory, number> = {
    featured: 0,
    active: 0,
    stable: 0,
    completed: 0,
    archived: 0,
    fork: 0,
    learning: 0,
  }

  projects.forEach((project) => {
    const category = categorizeProject({
      archived: project.isArchived,
      fork: project.isFork,
      updated_at: project.updatedAt.toISOString(),
      name: project.name,
      description: project.description,
    } as GitHubRepository)
    categoryDistribution[category]++
  })

  const activeProjects = projects.filter((p) => !p.isArchived && !p.isFork).length
  const archivedProjects = projects.filter((p) => p.isArchived).length

  // 计算"我创建的"和"我参与的"统计
  let ownedStats, contributedStats
  
  if (username) {
    // 我创建的项目（非fork且owner是当前用户）
    const ownedProjects = projects.filter((p) => {
      const ownerName = p.fullName.split('/')[0]
      return ownerName.toLowerCase() === username.toLowerCase() && !p.isFork
    })
    
    // 我参与的项目（fork的项目或owner不是当前用户的项目）
    const contributedProjects = projects.filter((p) => {
      const ownerName = p.fullName.split('/')[0]
      return ownerName.toLowerCase() !== username.toLowerCase() || p.isFork
    })

    // 统计我创建的项目
    const ownedLanguages = new Set(ownedProjects.map(p => p.primaryLanguage).filter(Boolean))
    ownedStats = {
      count: ownedProjects.length,
      stars: ownedProjects.reduce((sum, p) => sum + p.stars, 0),
      forks: ownedProjects.reduce((sum, p) => sum + p.forks, 0),
      languages: ownedLanguages.size,
    }

    // 统计我参与的项目
    const contributedLanguages = new Set(contributedProjects.map(p => p.primaryLanguage).filter(Boolean))
    contributedStats = {
      count: contributedProjects.length,
      stars: contributedProjects.reduce((sum, p) => sum + p.stars, 0),
      forks: contributedProjects.reduce((sum, p) => sum + p.forks, 0),
      languages: contributedLanguages.size,
    }
  }

  return {
    totalProjects: projects.length,
    totalStars,
    totalForks,
    languageDistribution,
    categoryDistribution,
    activeProjects,
    archivedProjects,
    ownedStats,
    contributedStats,
  }
}

