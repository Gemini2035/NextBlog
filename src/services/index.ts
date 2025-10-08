/**
 * Services 统一导出
 * 提供所有服务的统一入口
 */

// ========================================
// GitHub 服务
// ========================================
export {
  // API 服务
  githubApiService,
  githubApi, // 向后兼容别名
  createGitHubApiService,
  GitHubApiService,
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
} from './github'

export type {
  // GitHub 类型
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
} from './github'

