import type { BlogPostListItem } from './blog'

export interface HomePostsPayload {
  floating: BlogPostListItem[]
  popularTags: string[]
}

export interface HomeInitPayload {
  posts: HomePostsPayload
}
