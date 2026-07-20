import { serverHttpData } from '@/apis/http'
import type { HomeInitPayload } from '@/types/home'

export const getHomeInit = (locale: string) => {
  return serverHttpData<HomeInitPayload>('/site/home-init', {
    headers: { 'X-Locale': locale },
    next: { revalidate: 60 },
  })
}
