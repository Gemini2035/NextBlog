export { graphqlRequest } from './client'
export {
  POST_DETAIL_QUERY,
  RELATED_POSTS_QUERY,
  mapGqlPostToBlogPost,
  mapGqlRelatedPostToBlogPost,
} from './operations'
export type { PostDetailResult, RelatedPostsResult } from './operations'
