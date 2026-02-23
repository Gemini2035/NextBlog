/**
 * GitHub GraphQL 服务统一导出
 * 新架构：基于 GraphQL 的清晰分层
 */

// ============ 核心客户端 ============
export { githubGraphQLClient, createGraphQLClient, handleGraphQLError, delay } from './client'

// ============ GraphQL 查询 ============
export { GET_USER_REPOSITORIES } from './queries/repositories.graphql'
export { GET_REPOSITORY_DETAIL } from './queries/repository.graphql'
export { GET_RATE_LIMIT } from './queries/rateLimit.graphql'

// ============ GraphQL 操作 ============
export {
  getUserRepositories,
  getAllUserRepositories,
  getRepositoryDetail,
  batchGetRepositoryDetails,
  getRateLimit,
} from './operations/repositories'

// ============ 数据转换器 ============
export {
  transformRepository,
  transformRepositories,
  filterRepositories as filterRepositoriesByOptions,
} from './transformers/repository'

export {
  categorizeProject,
  generateProjectStats,
  sortProjects,
  filterProjects,
} from './transformers/stats'

// ============ GraphQL 类型 ============
export type {
  GraphQLRepository,
  UserRepositoriesResponse,
  RepositoryDetailResponse,
  RateLimitResponse,
  GetUserRepositoriesVariables,
  GetRepositoryDetailVariables,
  RepositoryAffiliation,
  PageInfo,
  LanguageNode,
  LanguageEdge,
  LanguagesConnection,
  CollaboratorNode,
  CollaboratorsConnection,
  LicenseInfo,
  RepositoryOwner,
  BranchRef,
  TopicNode,
  TopicsConnection,
  RepositoryOrder,
} from './types/graphql'

// ============ 应用数据类型 ============
export type {
  ProcessedRepository,
  LanguageStat,
  ContributorStat,
  ProjectCategory,
  ProjectFilters,
  ProjectSortOption,
  ProjectStats,
} from './types/processed'
