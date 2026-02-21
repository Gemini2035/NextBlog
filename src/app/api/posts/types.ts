/**
 * 文章接口前后端数据契约
 * - GET /api/posts、GET /api/posts/[slug] 的请求/响应与消费端统一使用此定义
 */

/** 文章列表项（GET /api/posts 单条；也可用于展示用文章元信息） */
export interface PostListItem {
  id: string
  slug: string
  locale: string
  title: string
  description: string | null
  date: string
  updatedAt: string | null
  published: boolean
  featured: boolean
  tags: string[]
  originalSlug: string | null
  url: string
}

/** 单篇文章详情（GET /api/posts/[slug] 返回） */
export interface PostDetail extends PostListItem {
  /** MDX 原文 */
  bodyRaw: string
  /** 编译后的 MDX 代码，供 getMDXComponent 使用 */
  bodyCode?: string
}
