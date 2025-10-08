/**
 * 处理后的应用数据类型
 * 这些类型用于应用内部使用，独立于GraphQL响应
 */

/**
 * 处理后的仓库数据（用于前端展示）
 */
export interface ProcessedRepository {
  // 基本信息
  id: number
  name: string
  fullName: string
  description: string
  url: string
  homepage: string | null

  // 所有者信息
  owner: {
    login: string
    avatarUrl: string
    url: string
  }

  // 统计
  stars: number
  forks: number
  watchers: number
  openIssues: number
  openPullRequests?: number

  // 语言信息
  primaryLanguage: {
    name: string
    color: string
  } | null
  languages?: Record<string, number> // 语言名 -> 字节数
  languageStats?: LanguageStat[]

  // 贡献者信息
  contributors?: ContributorStat[]
  contributorStats?: ContributorStat[]

  // 分类
  topics: string[]
  isFork: boolean
  isArchived: boolean
  isTemplate?: boolean
  isPrivate?: boolean
  isFeatured?: boolean // 是否置顶
  isPinned?: boolean // 别名：是否置顶（向后兼容）

  // 许可证
  license: string | null

  // 默认分支
  defaultBranch?: string

  // 时间
  createdAt: Date
  updatedAt: Date
  pushedAt: Date

  // 活跃度评分（自定义）
  activityScore?: number
  displayWeight?: number
  weight?: number // 综合权重（包含置顶加成）
}

/**
 * 语言统计信息
 */
export interface LanguageStat {
  name: string
  color: string
  percentage: number
  bytes: number
}

/**
 * 贡献者统计信息
 */
export interface ContributorStat {
  login: string
  name?: string
  avatarUrl: string
  profileUrl: string
  contributions: number
  percentage?: number
}

/**
 * 项目分类
 */
export type ProjectCategory =
  | 'featured' // 特色项目
  | 'active' // 活跃项目
  | 'stable' // 稳定维护
  | 'completed' // 已完成
  | 'archived' // 归档
  | 'fork' // Fork项目
  | 'learning' // 学习项目

/**
 * 项目筛选条件
 */
export interface ProjectFilters {
  category?: ProjectCategory[]
  languages?: string[]
  topics?: string[]
  minStars?: number
  maxStars?: number
  includeForked?: boolean
  includeArchived?: boolean
  searchText?: string
}

/**
 * 项目排序选项
 */
export type ProjectSortOption =
  | 'stars' // 按Star数
  | 'updated' // 按更新时间
  | 'created' // 按创建时间
  | 'name' // 按名称
  | 'weight' // 按权重

/**
 * 项目统计概览
 */
export interface ProjectStats {
  totalProjects: number
  totalStars: number
  totalForks: number
  languageDistribution: LanguageStat[]
  categoryDistribution: Record<ProjectCategory, number>
  activeProjects: number
  archivedProjects: number
  // 我创建的项目统计
  ownedStats?: {
    count: number
    stars: number
    forks: number
    languages: number
  }
  // 我参与的项目统计
  contributedStats?: {
    count: number
    stars: number
    forks: number
    languages: number
  }
}

