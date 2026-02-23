// 全局类型定义
export interface IBlogPost {
  title: string
  description: string | null
  featured: boolean
  id: string
  tags?: string[]
  published: boolean
  updatedAt: Date | null
  createdAt: Date | null
  content: { raw?: string; code?: string } | null
  locale: "zh" | "en" | "ja"
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
