import { postResolvers } from './posts'

export const resolvers = {
  Query: {
    ...postResolvers,
  },
}
