/**
 * GitHub REST API v3 响应类型
 * @see https://docs.github.com/en/rest
 */

export interface RestOwner {
  login: string
  id: number
  avatar_url: string
  url: string
  html_url: string
}

export interface RestParent {
  full_name: string
  stargazers_count: number
  forks_count: number
  html_url: string
}

/** GET /repos/:owner/:repo 列表项（GET /users/:username/repos 单条） */
export interface RestRepoListItem {
  id: number
  node_id: string
  name: string
  full_name: string
  description: string | null
  html_url: string
  homepage: string | null
  private: boolean
  fork: boolean
  archived: boolean
  template_repository?: { full_name: string } | null
  language: string | null
  stargazers_count: number
  forks_count: number
  watchers_count: number
  open_issues_count: number
  created_at: string
  updated_at: string
  pushed_at: string | null
  owner: RestOwner
  parent: RestParent | null
  license: { name: string; spdx_id: string | null } | null
  default_branch: string
  topics?: string[]
}

/** GET /repos/:owner/:repo 详情（与列表项结构兼容并含 topics 等） */
export interface RestRepoDetail extends RestRepoListItem {
  topics?: string[]
}

/** GET /repos/:owner/:repo/languages -> { "Lang": bytes } */
export type RestRepoLanguages = Record<string, number>

/** GET /rate_limit 中 rate 字段 */
export interface RestRateLimit {
  limit: number
  remaining: number
  reset: number
  used: number
}
