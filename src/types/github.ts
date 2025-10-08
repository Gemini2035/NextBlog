/**
 * GitHub API 类型定义
 */

/**
 * GitHub仓库信息
 */
export interface GitHubRepository {
  id: number
  name: string
  full_name: string
  description: string | null
  html_url: string
  homepage: string | null
  
  // 所有者信息
  owner: {
    login: string
    avatar_url: string
    html_url: string
  }
  
  // 统计信息
  stargazers_count: number
  watchers_count: number
  forks_count: number
  open_issues_count: number
  size: number
  
  // 语言和主题
  language: string | null
  topics: string[]
  
  // 状态
  fork: boolean
  archived: boolean
  disabled: boolean
  private: boolean
  
  // 许可证
  license: {
    key: string
    name: string
    spdx_id: string
    url: string
  } | null
  
  // 时间
  created_at: string
  updated_at: string
  pushed_at: string
  
  // URLs
  git_url: string
  ssh_url: string
  clone_url: string
  svn_url: string
  
  // 其他
  default_branch: string
  has_issues: boolean
  has_projects: boolean
  has_downloads: boolean
  has_wiki: boolean
  has_pages: boolean
}

/**
 * GitHub贡献者信息
 */
export interface GitHubContributor {
  login: string
  id: number
  avatar_url: string
  html_url: string
  contributions: number
  type: string
}

/**
 * GitHub语言统计
 * key: 语言名称
 * value: 字节数
 */
export type GitHubLanguages = Record<string, number>

/**
 * GitHub仓库查询参数
 */
export interface GitHubRepoQueryParams {
  type?: 'all' | 'owner' | 'public' | 'private' | 'member'
  sort?: 'created' | 'updated' | 'pushed' | 'full_name'
  direction?: 'asc' | 'desc'
  per_page?: number
  page?: number
}

/**
 * GitHub API速率限制信息
 */
export interface GitHubRateLimit {
  limit: number
  remaining: number
  reset: number // Unix timestamp
  used: number
}

/**
 * GitHub API响应头
 */
export interface GitHubResponseHeaders {
  'x-ratelimit-limit'?: string
  'x-ratelimit-remaining'?: string
  'x-ratelimit-reset'?: string
  'x-ratelimit-used'?: string
  link?: string // 分页链接
}

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
  
  // 统计
  stars: number
  forks: number
  watchers: number
  openIssues: number
  
  // 语言信息
  primaryLanguage: string | null
  languages?: LanguageStat[]
  
  // 贡献者信息
  contributors?: ContributorStat[]
  totalContributions?: number
  
  // 分类
  topics: string[]
  isFork: boolean
  isArchived: boolean
  
  // 许可证
  license: string | null
  
  // 时间
  createdAt: Date
  updatedAt: Date
  pushedAt: Date
  
  // 活跃度评分（自定义）
  activityScore?: number
  displayWeight?: number
}

/**
 * 语言统计信息
 */
export interface LanguageStat {
  name: string
  bytes: number
  percentage: number
  color?: string // 语言对应的颜色
}

/**
 * 贡献者统计信息
 */
export interface ContributorStat {
  login: string
  avatarUrl: string
  profileUrl: string
  contributions: number
  percentage: number
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
}

