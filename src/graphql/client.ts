import 'server-only'

const GRAPHQL_ENDPOINT =
  process.env.BACKEND_GRAPHQL_URL ??
  (process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}/api/graphql`
    : 'http://localhost:3000/api/graphql')

interface GraphQLResponse<T> {
  data?: T
  errors?: { message: string }[]
}

export async function graphqlRequest<TData, TVariables extends Record<string, unknown> = Record<string, unknown>>(
  query: string,
  variables?: TVariables
): Promise<TData> {
  const response = await fetch(GRAPHQL_ENDPOINT, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      query,
      variables,
    }),
    cache: 'no-store',
  })

  if (!response.ok) {
    throw new Error(`GraphQL 请求失败，状态码：${response.status}`)
  }

  const json = (await response.json()) as GraphQLResponse<TData>

  if (json.errors && json.errors.length > 0) {
    const message = json.errors.map((e) => e.message).join('; ')
    throw new Error(`GraphQL 返回错误：${message}`)
  }

  if (!json.data) {
    throw new Error('GraphQL 响应中缺少 data 字段')
  }

  return json.data
}

