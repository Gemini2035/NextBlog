/**
 * BFF GraphQL 查询 - 文章列表（分页 + 模糊搜索）
 */

export const POST_LIST_QUERY = /* GraphQL */ `
  query PostList(
    $locale: String!
    $page: Int
    $pageSize: Int
    $keyword: String
    $sortBy: String
    $sortOrder: String
  ) {
    postsList(
      locale: $locale
      page: $page
      pageSize: $pageSize
      keyword: $keyword
      sortBy: $sortBy
      sortOrder: $sortOrder
    ) {
      list {
        id
        locale
        title
        description
        date
        updatedAt
        published
        featured
        tags
        createdAt
      }
      metaData {
        pagination {
          total
          page
          pageSize
          totalPages
          hasNextPage
          hasPrevPage
        }
      }
    }
  }
`

export interface PostListPagination {
  total: number
  page: number
  pageSize: number
  totalPages: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

export interface PostListMetaData {
  pagination: PostListPagination
}

export interface PostListResult {
  postsList: {
    list: Array<{
      id: string
      locale: string
      title: string
      description: string | null
      date: string
      updatedAt: string | null
      published: boolean
      featured: boolean
      tags: string[]
      createdAt: string
    }>
    metaData: PostListMetaData
  }
}
