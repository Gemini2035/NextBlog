/**
 * 统计数据转换器
 * 从 ProcessedRepository 生成各类统计信息
 */

import type { ProcessedRepository, ProjectStats, ProjectCategory, LanguageStat } from '../types/processed'

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
 * 自动分类项目
 */
export function categorizeProject(repo: {
  archived: boolean
  fork: boolean
  updated_at: string
  name: string
  description?: string | null
}): ProjectCategory {
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
        project.primaryLanguage.name,
        (languageMap.get(project.primaryLanguage.name) || 0) + 1
      )
    }
  })

  const languageDistribution: LanguageStat[] = Array.from(languageMap.entries())
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
    })
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
    const ownedLanguages = new Set(
      ownedProjects.map((p) => p.primaryLanguage?.name).filter(Boolean)
    )
    ownedStats = {
      count: ownedProjects.length,
      stars: ownedProjects.reduce((sum, p) => sum + p.stars, 0),
      forks: ownedProjects.reduce((sum, p) => sum + p.forks, 0),
      languages: ownedLanguages.size,
    }

    // 统计我参与的项目
    const contributedLanguages = new Set(
      contributedProjects.map((p) => p.primaryLanguage?.name).filter(Boolean)
    )
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

/**
 * 排序项目
 */
export function sortProjects(
  projects: ProcessedRepository[],
  sortBy: 'stars' | 'updated' | 'created' | 'name' | 'weight',
  direction: 'asc' | 'desc' = 'desc'
): ProcessedRepository[] {
  const sorted = [...projects]

  sorted.sort((a, b) => {
    // 置顶项目始终排在前面
    const aIsPinned = a.isFeatured || a.isPinned
    const bIsPinned = b.isFeatured || b.isPinned
    if (aIsPinned && !bIsPinned) return -1
    if (!aIsPinned && bIsPinned) return 1

    // 如果两者都是置顶或都不是置顶，则按照指定排序
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
        comparison = (a.weight || 0) - (b.weight || 0)
        break
    }

    return direction === 'desc' ? -comparison : comparison
  })

  return sorted
}

/**
 * 筛选项目
 */
export function filterProjects(
  projects: ProcessedRepository[],
  filters: {
    category?: ProjectCategory[]
    languages?: string[]
    topics?: string[]
    minStars?: number
    maxStars?: number
    includeForked?: boolean
    includeArchived?: boolean
    searchText?: string
  }
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
      })
      return filters.category!.includes(category)
    })
  }

  // 筛选语言
  if (filters.languages && filters.languages.length > 0) {
    filtered = filtered.filter((project) => {
      if (!project.primaryLanguage) return false
      return filters.languages!.includes(project.primaryLanguage.name)
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

