import type { IBlogPost } from '@/types'
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
  posts: IBlogPost[]
  onFilteredPostsChange: (filteredPosts: IBlogPost[]) => void
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
