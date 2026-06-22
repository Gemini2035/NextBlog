export interface DevelopmentHistoryTerm {
  id: number
  key: string
  name: string
  textColor?: string | null
  backgroundColor?: string | null
}

export interface DevelopmentHistoryItem {
  id: number | string
  title: string
  version?: string | null
  periodStart?: string | null
  periodEnd?: string | null
  isCurrent: boolean
  tags: DevelopmentHistoryTerm[]
  status: DevelopmentHistoryTerm
  summary?: string | null
  description?: string | null
  children?: DevelopmentHistoryItem[]
}
