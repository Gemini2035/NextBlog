'use server'

import { getRelatedPosts } from '@/services/posts'
import type { IBlogPost } from '@/types'

const FETCH_LIMIT = 12

function shuffle<T>(arr: T[]): T[] {
  const out = [...arr]
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[out[i], out[j]] = [out[j], out[i]]
  }
  return out
}

export async function fetchRelatedPosts(
  postId: string,
  locale: 'zh' | 'en' | 'ja',
  count: number
): Promise<IBlogPost[]> {
  const list = await getRelatedPosts({ id: postId, locale }, FETCH_LIMIT)
  const shuffled = shuffle(list)
  return shuffled.slice(0, Math.min(Math.max(1, count), 10))
}
