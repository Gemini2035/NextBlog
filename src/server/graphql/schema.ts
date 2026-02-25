export const typeDefs = /* GraphQL */ `
  type Post {
    id: ID!
    locale: String!
    title: String!
    description: String
    date: String!
    updatedAt: String
    published: Boolean!
    featured: Boolean!
    tags: [String!]!
    content: String
    createdAt: String!
  }

  type PostListPagination {
    total: Int!
    page: Int!
    pageSize: Int!
    totalPages: Int!
    hasNextPage: Boolean!
    hasPrevPage: Boolean!
  }

  type PostListMetaData {
    pagination: PostListPagination!
  }

  type PostListResult {
    list: [Post!]!
    metaData: PostListMetaData!
  }

  type Query {
    post(id: ID!): Post
    relatedPosts(id: ID!, locale: String!, limit: Int!): [Post!]!
    featuredPosts(locale: String!): [Post!]!
    recentPosts(locale: String!, limit: Int): [Post!]!
    postsList(
      locale: String!
      page: Int
      pageSize: Int
      keyword: String
      sortBy: String
      sortOrder: String
    ): PostListResult!
  }
`
