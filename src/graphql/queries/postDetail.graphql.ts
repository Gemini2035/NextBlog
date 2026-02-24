/**
 * BFF GraphQL 查询 - 文章详情
 */

export const POST_DETAIL_QUERY = /* GraphQL */ `
  query PostDetail($id: ID!) {
    post(id: $id) {
      id
      locale
      title
      description
      date
      updatedAt
      published
      featured
      tags
      content
      createdAt
    }
  }
`

export interface PostDetailResult {
  post: {
    id: string
    locale: string
    title: string
    description: string | null
    date: string
    updatedAt: string | null
    published: boolean
    featured: boolean
    tags: string[]
    content: string | null
    createdAt: string
  } | null
}
