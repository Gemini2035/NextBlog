export { graphqlRequest } from './client'
export {
  POST_DETAIL_QUERY,
  RELATED_POSTS_QUERY,
  POST_LIST_QUERY,
  FEATURED_POSTS_QUERY,
  RECENT_POSTS_QUERY,
  mapGqlPostToBlogPost,
  mapGqlRelatedPostToBlogPost,
  mapGqlListPostToBlogPost,
} from './operations'
export type {
  PostDetailResult,
  RelatedPostsResult,
  PostListResult,
  PostListMetaData,
  FeaturedPostsResult,
  RecentPostsResult,
} from './operations'
