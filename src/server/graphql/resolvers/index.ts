import { postResolvers } from './posts'
import { githubResolvers } from './github'

export const resolvers = {
  Query: {
    ...postResolvers,
    ...githubResolvers,
  },
}
