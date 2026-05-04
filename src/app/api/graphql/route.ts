import { createYoga } from 'graphql-yoga'
import { schema } from '@/server/graphql'

const SUPPORTED_LOCALES: readonly string[] = ['zh', 'en', 'ja']

const { handleRequest } = createYoga({
  schema,
  graphqlEndpoint: '/api/graphql',
  fetchAPI: { Response },
  context: async ({ request }) => {
    const headerLocale =
      request.headers.get('x-locale') ??
      request.headers
        .get('accept-language')
        ?.split(',')[0]
        .split('-')[0]

    const locale = SUPPORTED_LOCALES.includes(headerLocale ?? '')
      ? headerLocale
      : 'zh'

    return {
      locale,
    }
  },
})

export { handleRequest as GET, handleRequest as POST }
