import { serverHttpData } from '@/apis/http'
import type { AboutInitPayload } from '@/types/about'
import { fallbackAboutInit } from '@/apis/fallbacks'

export const getAboutInit = (locale: string) => {
  return serverHttpData<AboutInitPayload>('/site/about-init', {
    headers: { 'X-Locale': locale },
  }).catch(() => fallbackAboutInit)
}
