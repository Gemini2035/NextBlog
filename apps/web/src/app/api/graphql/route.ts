import { createYoga } from 'graphql-yoga'
import { schema } from '@/server/graphql'

const { handleRequest } = createYoga({
  schema,
  graphqlEndpoint: '/api/graphql',
  fetchAPI: { Response },
})

function handleGraphQLRequest(request: Request) {
  return handleRequest(request, {})
}

export { handleGraphQLRequest as GET, handleGraphQLRequest as POST }
