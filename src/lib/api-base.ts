/** 服务端请求 API 时的 base URL，客户端用相对路径；本地必用 http 避免 SSL 错误 */
export function getApiBaseUrl(): string {
  if (typeof window !== 'undefined') {
    return ''
  }
  let url =
    process.env.NEXT_PUBLIC_APP_URL ??
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000')
  if (!url.startsWith('http')) {
    url = `http://${url}`
  }
  if (url.includes('localhost') || url.includes('127.0.0.1')) {
    return url.replace(/^https:\/\//, 'http://')
  }
  return url
}
