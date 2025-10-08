/**
 * GitHub 服务层统一导出
 */

// API 服务
export {
  githubApiService,
  githubApi, // 向后兼容别名
  createGitHubApiService,
  GitHubApiService,
} from './api'

// 数据处理
export {
  processLanguages,
  processContributors,
  calculateActivityScore,
  calculateDisplayWeight,
  categorizeProject,
  processRepository,
  processRepositories,
  filterProjects,
  sortProjects,
  generateProjectStats,
} from './processor'

// 类型
export type {
  GitHubRepository,
  GitHubContributor,
  GitHubLanguages,
  GitHubRepoQueryParams,
  GitHubRateLimit,
  GitHubResponseHeaders,
  ProcessedRepository,
  LanguageStat,
  ContributorStat,
  ProjectCategory,
  ProjectFilters,
  ProjectSortOption,
  ProjectStats,
} from './types'

