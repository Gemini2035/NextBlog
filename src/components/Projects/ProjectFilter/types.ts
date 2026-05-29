import type { ProjectListItem } from '@/types/api'

export interface ProjectFilterState {
  keyword: string
  showPinned: boolean | null
  showOwned: boolean | null
  showContributed: boolean | null
  showFork: boolean | null
  showArchived: boolean | null
  starSort: 'asc' | 'desc' | null
  forkSort: 'asc' | 'desc' | null
  weightSort: 'asc' | 'desc' | null
  createTimeSort: 'asc' | 'desc' | null
  updateTimeSort: 'asc' | 'desc' | null
  pushTimeSort: 'asc' | 'desc' | null
}

export interface ProjectFilterProps {
  projects: ProjectListItem[]
  onFilteredProjectsChange: (filteredProjects: ProjectListItem[]) => void
}

export interface SortOption {
  value: string
  label: string
}
