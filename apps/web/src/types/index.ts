// 全局类型定义

export interface BlogPost {
  title: string
  slug: string
  date: string
  description?: string
  tags?: string[]
  published: boolean
  content: string
}

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
