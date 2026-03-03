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

  """
  GitHub 项目主要语言
  """
  type GithubPrimaryLanguage {
    name: String!
    color: String!
  }

  """
  GitHub 项目语言占比
  """
  type GithubLanguageStat {
    name: String!
    color: String!
    percentage: Float!
    bytes: Int!
  }

  """
  GitHub 仓库所有者
  """
  type GithubOwner {
    login: String!
    avatarUrl: String!
    url: String!
  }

  """
  处理后的 GitHub 项目信息（用于前端展示）
  日期字段使用 ISO 字符串，由前端自行转为 Date
  """
  type GithubProject {
    id: Int!
    name: String!
    fullName: String!
    description: String!
    url: String!
    homepage: String

    owner: GithubOwner!

    stars: Int!
    forks: Int!
    watchers: Int!
    openIssues: Int!

    primaryLanguage: GithubPrimaryLanguage
    languages: [String!]
    languageStats: [GithubLanguageStat!]

    topics: [String!]!
    isFork: Boolean!
    isArchived: Boolean!
    isTemplate: Boolean
    isPrivate: Boolean
    isFeatured: Boolean
    isPinned: Boolean

    license: String
    defaultBranch: String

    createdAt: String!
    updatedAt: String!
    pushedAt: String!

    activityScore: Float
    displayWeight: Float
    weight: Float
  }

  """
  GitHub 项目统计信息
  """
  type GithubProjectStats {
    totalProjects: Int!
    totalStars: Int!
    totalForks: Int!
    languageDistribution: [GithubLanguageStat!]!
    activeProjects: Int!
    archivedProjects: Int!
  }

  """
  GitHub API 速率限制信息
  """
  type GithubRateLimit {
    limit: Int!
    remaining: Int!
    resetAt: String!
    used: Int!
  }

  """
  GitHub 项目查询结果
  """
  type GithubProjectsResult {
    projects: [GithubProject!]!
    stats: GithubProjectStats!
    rateLimit: GithubRateLimit
    error: String
  }

  type Query {
    post(id: ID!): Post
    relatedPosts(id: ID!, limit: Int!): [Post!]!
    featuredPosts: [Post!]!
    recentPosts(limit: Int): [Post!]!
    postsList(
      page: Int
      pageSize: Int
      keyword: String
      sortBy: String
      sortOrder: String
    ): PostListResult!

    """
    GitHub 项目列表（参数全部由后端配置与数据库控制）
    """
    githubProjects: GithubProjectsResult!
  }
`
