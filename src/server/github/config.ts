import { prisma } from '@/server/prisma'

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
  token: string
  fetchOptions?: GithubFetchOptions
}

export async function getGithubThirdPartyConfig(): Promise<GithubThirdPartyConfig> {
  const record = await prisma.thirdPartyConfig.findFirst({
    where: { name: 'github' },
  })

  if (!record) {
    throw new Error('未找到 GitHub 第三方配置（ThirdPartyConfig.name = "github"）')
  }

  const value = record.value as GithubThirdPartyConfig | null

  if (!value || !value.username || !value.token) {
    throw new Error('GitHub 第三方配置中缺少 username 或 token')
  }

  return value
}

