import type { ProjectCategory } from './projects'

export type {
  ContributorStat,
  LanguageStat,
  ProjectDetail as ProcessedRepository,
  ProjectStats,
} from './api'
export type { ProjectCategory } from './projects'

export type ProjectFilters = {
  category?: ProjectCategory[]
  languages?: string[]
  topics?: string[]
  minStars?: number
  maxStars?: number
  includeForked?: boolean
  includeArchived?: boolean
  searchText?: string
}

export type ProjectSortOption = 'stars' | 'updated' | 'created' | 'name' | 'weight'
