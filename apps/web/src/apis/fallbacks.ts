import type { AboutInitPayload } from '@/types/about'
import type { HomeInitPayload } from '@/types/home'
import type { SiteInitPayload } from '@/types/site'

export const fallbackSiteInit: SiteInitPayload = {
  siteConfig: {},
  siteLanguages: [],
  navigation: [],
}

export const fallbackHomeInit: HomeInitPayload = {
  posts: {
    floating: [],
    popularTags: [],
  },
}

export const fallbackAboutInit: AboutInitPayload = {
  content: {},
}
