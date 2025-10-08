import type { ProcessedRepository } from '@/types/github'

export interface ProjectFilterState {
  keyword: string
  showPinned: boolean | null
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
  projects: ProcessedRepository[]
  onFilteredProjectsChange: (filteredProjects: ProcessedRepository[]) => void
}

export interface SortOption {
  value: string
  label: string
}

