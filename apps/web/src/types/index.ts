// 全局类型定义
import type { BlogPostDetail, BlogPostListItem } from './blog'

export type BlogPost = BlogPostListItem
export type BlogPostContent = BlogPostDetail

export interface Tag {
  name: string
  count: number
  slug: string
}

export interface NavigationItem {
  label: string
  href: string
  external?: boolean
}

export interface SiteConfig {
  title: string
  description: string
  author: string
  url: string
  social: {
    github?: string
    twitter?: string
    linkedin?: string
  }
}
