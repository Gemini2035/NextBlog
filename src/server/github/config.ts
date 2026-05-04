import { GITHUB_CONFIG } from '@/constants'

export type GithubRepoType = 'all' | 'owner' | 'member' | 'public'

export interface GithubFetchOptions {
  repoType?: GithubRepoType
  includeForked?: boolean
  includeArchived?: boolean
  includeLanguages?: boolean
  includeContributors?: boolean
  minStars?: number
  sortBy?: 'updated' | 'created' | 'pushed' | 'stars' | 'name'
  maxProjects?: number
  maxPages?: number
  featuredRepos?: string[]
  excludeRepos?: string[]
}

export interface GithubThirdPartyConfig {
  username: string
  token?: string
  fetchOptions?: GithubFetchOptions
}

const REPO_TYPES: readonly GithubRepoType[] = ['all', 'owner', 'member', 'public']
const SORT_BY_OPTIONS: readonly NonNullable<GithubFetchOptions['sortBy']>[] = [
  'updated',
  'created',
  'pushed',
  'stars',
  'name',
]

export function getGithubThirdPartyConfig(): GithubThirdPartyConfig {
  const username = GITHUB_CONFIG?.username

  if (!username) {
    throw new Error('GitHub 配置中缺少 username')
  }

  const fetchOptions = GITHUB_CONFIG.fetchOptions
  const repoType = REPO_TYPES.includes(fetchOptions.repoType as GithubRepoType)
    ? (fetchOptions.repoType as GithubRepoType)
    : 'owner'
  const sortBy = SORT_BY_OPTIONS.includes(fetchOptions.sortBy as NonNullable<GithubFetchOptions['sortBy']>)
    ? (fetchOptions.sortBy as NonNullable<GithubFetchOptions['sortBy']>)
    : 'updated'

  return {
    username,
    token: process.env.NEXT_PUBLIC_GITHUB_TOKEN,
    fetchOptions: {
      ...fetchOptions,
      repoType,
      sortBy,
      featuredRepos: GITHUB_CONFIG.featuredRepos,
      excludeRepos: GITHUB_CONFIG.excludeRepos,
    },
  }
}
