import type { Post } from '../../../../../.contentlayer/generated'
import { ReactNode } from 'react'

export interface FilterState {
  keyword: string
  selectedTags: string[]
  wordCountSort: 'asc' | 'desc' | null
  featuredFilter: boolean | null
  createTimeSort: 'asc' | 'desc' | null
  updateTimeSort: 'asc' | 'desc' | null
}

export interface PostFilterProps {
  posts: Post[]
  onFilteredPostsChange: (filteredPosts: Post[]) => void
  locale?: string
  initialTag?: string | null
}

export interface FilterSectionProps {
  title: string
  children: ReactNode
  className?: string
}

export interface SortOption {
  value: string
  label: string
}

export interface TagOption {
  value: string
  label: string
  count: number
}
