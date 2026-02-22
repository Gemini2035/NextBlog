/**
 * GitHub REST API 服务统一导出
 */

// ============ 核心客户端 ============
export {
  getRestUserRepos,
  getRestRepoDetail,
  getRestRepoLanguages,
  getRestRateLimit,
  handleGitHubError,
  delay,
} from './client'

// ============ 操作 ============
export {
  getUserRepositories,
  getAllUserRepositories,
  getRepositoryDetail,
  batchGetRepositoryDetails,
  getRateLimit,
} from './operations/repositories'
export type { RepositoryAffiliation } from './operations/repositories'

// ============ 数据转换器 ============
export {
  transformRestRepoToProcessed,
  filterRepositories as filterRepositoriesByOptions,
} from './transformers/repository'

export {
  categorizeProject,
  generateProjectStats,
  sortProjects,
  filterProjects,
} from './transformers/stats'

// ============ REST 类型 ============
export type {
  RestRepoListItem,
  RestRepoDetail,
  RestRepoLanguages,
  RestRateLimit,
  RestOwner,
} from './types/rest'

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
