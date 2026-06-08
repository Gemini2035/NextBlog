import { serverHttpData } from '@/apis/http'
import type { HomeInitPayload } from '@/types/home'
import { fallbackHomeInit } from '@/apis/fallbacks'

export const getHomeInit = (locale: string) => {
  return serverHttpData<HomeInitPayload>('/site/home-init', {
    headers: { 'X-Locale': locale },
  }).catch(() => fallbackHomeInit)
}
