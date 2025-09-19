import { allPosts, Post } from '../../.contentlayer/generated'

export function getAllPosts(): Post[] {
  return allPosts
    .filter((post) => post.published !== false)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export function getPostBySlug(slug: string): Post | undefined {
  return allPosts.find((post) => post.slug === slug)
}

export function getPostsByTag(tag: string): Post[] {
  return allPosts
    .filter((post) => post.published !== false && post.tags?.includes(tag))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export function getAllTags(): string[] {
  const tags = allPosts
    .filter((post) => post.published !== false)
    .flatMap((post) => post.tags || [])
  
  return Array.from(new Set(tags)).sort()
}
