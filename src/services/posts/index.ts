import { getApiBaseUrl } from '@/lib/api-base'
import type { PostDetail } from '@/app/api/posts/types'
import { http } from '../http'

/**
 * 服务端：根据文章 id 从 API 获取单篇详情（一个 id 唯一对应一篇 post，无需 locale）
 */
export async function getPostById(id: string): Promise<PostDetail | null> {
  const base = getApiBaseUrl()
  const url = `${base}/api/posts/${encodeURIComponent(id)}`
  try {
    const { data } = await http.get<PostDetail>(url, {
      validateStatus: (status) => status === 200,
    })
    return data
  } catch (err) {
    if ((err as Error & { is404?: boolean }).is404) return null
    throw err
  }
}
