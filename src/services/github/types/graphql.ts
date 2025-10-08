/**
 * GitHub GraphQL API 响应类型
 * 直接对应 GraphQL schema
 */

/**
 * GraphQL 响应基础结构
 */
export interface GraphQLResponse<T> {
  data?: T
  errors?: Array<{
    message: string
    locations?: Array<{
      line: number
      column: number
    }>
    path?: string[]
  }>
}

/**
 * 分页信息
 */
export interface PageInfo {
  hasNextPage: boolean
  endCursor: string | null
}

/**
 * 语言节点
 */
export interface LanguageNode {
  name: string
  color: string | null
}

/**
 * 语言边
 */
export interface LanguageEdge {
  size: number
  node: LanguageNode
}

/**
 * 语言连接
 */
export interface LanguagesConnection {
  totalSize: number
  edges: LanguageEdge[]
}

/**
 * 贡献者节点
 */
export interface CollaboratorNode {
  login: string
  name: string | null
  avatarUrl: string
  url: string
}

/**
 * 贡献者连接
 */
export interface CollaboratorsConnection {
  totalCount: number
  nodes: CollaboratorNode[]
}

/**
 * 许可证信息
 */
export interface LicenseInfo {
  name: string
  spdxId: string | null
}

/**
 * 仓库所有者
 */
export interface RepositoryOwner {
  login: string
  avatarUrl: string
  url: string
}

/**
 * 分支引用
 */
export interface BranchRef {
  name: string
}

/**
 * Topic 信息
 */
export interface TopicNode {
  topic: {
    name: string
  }
}

/**
 * Topics 连接
 */
export interface TopicsConnection {
  nodes: TopicNode[]
}

/**
 * 仓库节点（GraphQL 查询结果）
 */
export interface GraphQLRepository {
  id: string
  name: string
  nameWithOwner: string
  description: string | null
  url: string
  homepageUrl: string | null
  createdAt: string
  updatedAt: string
  pushedAt: string | null
  
  isPrivate: boolean
  isFork: boolean
  isArchived: boolean
  isTemplate: boolean
  isDisabled: boolean
  
  stargazerCount: number
  forkCount: number
  watchers: {
    totalCount: number
  }
  issues: {
    totalCount: number
  }
  pullRequests: {
    totalCount: number
  }
  
  licenseInfo: LicenseInfo | null
  primaryLanguage: LanguageNode | null
  languages: LanguagesConnection
  collaborators: CollaboratorsConnection | null
  
  owner: RepositoryOwner
  defaultBranchRef: BranchRef | null
  repositoryTopics: TopicsConnection
  
  // Fork 源仓库
  parent: {
    nameWithOwner: string
    stargazerCount: number
    forkCount: number
    url: string
  } | null
}

/**
 * 仓库连接
 */
export interface RepositoriesConnection {
  pageInfo: PageInfo
  totalCount: number
  nodes: GraphQLRepository[]
}

/**
 * 用户查询响应
 */
export interface UserRepositoriesResponse {
  user: {
    repositories: RepositoriesConnection
  }
}

/**
 * 单个仓库查询响应
 */
export interface RepositoryDetailResponse {
  repository: GraphQLRepository & {
    object?: {
      text?: string
    }
  }
}

/**
 * 速率限制响应
 */
export interface RateLimitResponse {
  rateLimit: {
    limit: number
    remaining: number
    resetAt: string
    used: number
  }
}

/**
 * 仓库排序选项
 */
export interface RepositoryOrder {
  field: 'CREATED_AT' | 'UPDATED_AT' | 'PUSHED_AT' | 'NAME' | 'STARGAZERS'
  direction: 'ASC' | 'DESC'
}

/**
 * 仓库关联类型
 */
export type RepositoryAffiliation = 'OWNER' | 'COLLABORATOR' | 'ORGANIZATION_MEMBER'

/**
 * GraphQL 查询变量
 */
export interface GetUserRepositoriesVariables {
  username: string
  first: number
  after?: string | null
  orderBy?: RepositoryOrder
  ownerAffiliations?: RepositoryAffiliation[]
  [key: string]: unknown // 允许额外的属性
}

/**
 * 获取单个仓库变量
 */
export interface GetRepositoryDetailVariables {
  owner: string
  name: string
  [key: string]: unknown // 允许额外的属性
}

