import { serverHttpData } from '@/apis/server-http'
import type { AboutInitPayload } from '@/types/about'
import { fallbackAboutInit } from '@/apis/fallbacks'

export const getAboutInit = (locale: string) => {
  return serverHttpData<AboutInitPayload>('/site/about-init', {
    headers: { 'X-Locale': locale },
    cache: 'no-store',
  }).catch(() => fallbackAboutInit)
}
