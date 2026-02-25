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

/** 列表/卡片用文章项：兼容 contentlayer Post（含 url、_id）与 GraphQL IBlogPost（用 id+locale 拼链接） */
export type IPostCardItem = Pick<
  IBlogPost,
  'id' | 'locale' | 'title' | 'description' | 'featured' | 'tags' | 'published' | 'updatedAt' | 'createdAt'
> & {
  date?: Date | string
  url?: string
  _id?: string
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
