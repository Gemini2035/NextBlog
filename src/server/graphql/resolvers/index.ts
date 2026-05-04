import { githubResolvers } from './github'

export const resolvers = {
  Query: {
    ...githubResolvers,
  },
}
