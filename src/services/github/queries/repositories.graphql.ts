/**
 * GitHub GraphQL 查询 - 仓库列表
 */

/**
 * 获取用户仓库列表（包含完整信息）
 * 一次查询获取：基本信息 + 语言统计 + 贡献者 + Topics
 */
export const GET_USER_REPOSITORIES = `
  query GetUserRepositories(
    $username: String!
    $first: Int!
    $after: String
    $orderBy: RepositoryOrder
    $ownerAffiliations: [RepositoryAffiliation]
  ) {
    user(login: $username) {
      repositories(
        first: $first
        after: $after
        orderBy: $orderBy
        ownerAffiliations: $ownerAffiliations
      ) {
        pageInfo {
          hasNextPage
          endCursor
        }
        totalCount
        nodes {
          # 基本信息
          id
          name
          nameWithOwner
          description
          url
          homepageUrl
          createdAt
          updatedAt
          pushedAt
          
          # 状态
          isPrivate
          isFork
          isArchived
          isTemplate
          isDisabled
          
          # 统计数据
          stargazerCount
          forkCount
          watchers {
            totalCount
          }
          issues(states: OPEN) {
            totalCount
          }
          pullRequests(states: OPEN) {
            totalCount
          }
          
          # 许可证
          licenseInfo {
            name
            spdxId
          }
          
          # 主要语言
          primaryLanguage {
            name
            color
          }
          
          # 所有语言统计（前10个）
          languages(first: 10, orderBy: {field: SIZE, direction: DESC}) {
            totalSize
            edges {
              size
              node {
                name
                color
              }
            }
          }
          
          # 贡献者（前30个）
          collaborators(first: 30) {
            totalCount
            nodes {
              login
              name
              avatarUrl
              url
            }
          }
          
          # 仓库所有者
          owner {
            login
            avatarUrl
            url
          }
          
          # 默认分支
          defaultBranchRef {
            name
          }
          
          # Topics
          repositoryTopics(first: 10) {
            nodes {
              topic {
                name
              }
            }
          }
        }
      }
    }
  }
`

