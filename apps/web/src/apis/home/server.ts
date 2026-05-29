import { serverHttpData } from '@/apis/server-http'
import type { HomeInitPayload } from '@/types/home'
import { fallbackHomeInit } from '@/apis/fallbacks'

export const getHomeInit = (locale: string) => {
  return serverHttpData<HomeInitPayload>('/site/home-init', {
    headers: { 'X-Locale': locale },
    cache: 'no-store',
  }).catch(() => fallbackHomeInit)
}
