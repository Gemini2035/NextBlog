import type { components } from './api.generated'

export type LanguageStat = components['schemas']['LanguageStat']
export type ContributorStat = components['schemas']['ContributorStat']
export type PrimaryLanguage = components['schemas']['PrimaryLanguage']
export type ProjectOwner = components['schemas']['ProjectOwner']
export type ProjectStatsGroup = components['schemas']['ProjectStatsGroup']
export type ProjectStats = components['schemas']['ProjectStats']
export type RateLimit = components['schemas']['RateLimit']
export type ProjectListItem = components['schemas']['ProjectListItem']
export type ProjectDetail = components['schemas']['ProjectDetail']
export type ProjectsPayload = components['schemas']['ProjectsPayload']
export type ProjectDetailPayload = components['schemas']['ProjectDetailPayload']

export type ApiResponse<TData> = {
  code: number
  message: string
  data: TData
}
