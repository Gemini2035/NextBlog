export { POST_DETAIL_QUERY, type PostDetailResult } from './postDetail.graphql'
export { RELATED_POSTS_QUERY, type RelatedPostsResult } from './relatedPosts.graphql'
export {
  POST_LIST_QUERY,
  type PostListResult,
  type PostListMetaData,
} from './postList.graphql'
export {
  FEATURED_POSTS_QUERY,
  type FeaturedPostsResult,
} from './featuredPosts.graphql'
export {
  RECENT_POSTS_QUERY,
  type RecentPostsResult,
} from './recentPosts.graphql'
export {
  mapGqlPostToBlogPost,
  mapGqlRelatedPostToBlogPost,
  mapGqlListPostToBlogPost,
} from '../utils'
