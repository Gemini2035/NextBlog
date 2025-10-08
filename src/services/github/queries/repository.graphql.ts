/**
 * GitHub GraphQL 查询 - 单个仓库
 */

/**
 * 获取单个仓库的详细信息
 */
export const GET_REPOSITORY_DETAIL = `
  query GetRepositoryDetail($owner: String!, $name: String!) {
    repository(owner: $owner, name: $name) {
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
      
      # 所有语言统计
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
      
      # 贡献者
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
      
      # README
      object(expression: "HEAD:README.md") {
        ... on Blob {
          text
        }
      }
    }
  }
`

