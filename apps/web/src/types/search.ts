export interface SearchableItem {
  id: string
  type: 'post' | 'link' | 'category'
  title: string
  description?: string
  href: string
}

export interface SearchResultItem {
  id: string
  type: 'post' | 'link'
  title: string
  description?: string | null
  href: string
}

export interface SearchResultsGroup {
  type: 'posts' | 'links' | 'categories'
  items: SearchResultItem[]
}

export interface RecommendedContent {
  items: SearchResultItem[]
}
