/**
 * GitHub 类型统一导出
 * 重新导出新的 GraphQL 类型，保持向后兼容
 */

// 从新的 services/github 导出所有类型
export type {
  ProcessedRepository,
  LanguageStat,
  ContributorStat,
  ProjectCategory,
  ProjectFilters,
  ProjectSortOption,
  ProjectStats,
} from '@/services/github'

// 保留一些旧的类型用于向后兼容
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
  id?: number
  avatar_url: string
  html_url: string
  contributions: number
  type?: string
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
