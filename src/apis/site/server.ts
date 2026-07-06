import { serverHttpData } from '@/apis/http'
import type { SiteInitPayload } from '@/types/site'

export const getSiteInit = (locale: string) => {
  return serverHttpData<SiteInitPayload>('/site-init', {
    headers: { 'X-Locale': locale },
  })
}
