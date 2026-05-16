import { createSchema } from 'graphql-yoga'
import { typeDefs } from './schema'
import { resolvers } from './resolvers'

export const schema = createSchema({
  typeDefs,
  resolvers,
})

export { typeDefs } from './schema'
export { resolvers } from './resolvers'
