export interface SiteSetting {
  id: number
  categoryId: number
  categoryKey?: string | null
  key: string
  value: unknown
  description?: string | null
  isPublic: boolean
  isEnabled: boolean
  createdAt: string
  updatedAt: string
}

export interface SiteConfig {
  title?: string
  description?: string
  author?: string
  url?: string
  baseYear?: number
  cdnUrl?: string
  postsPerPage?: number
  languages?: Array<{
    code: string
    name: string
    nativeName: string
    translations: Record<string, string>
  }>
  socialLink?: Record<string, string>
  contactLink?: Record<string, string>
  mediaLink?: Record<string, string>
  [key: string]: unknown
}

export interface SiteLanguage {
  id: number
  code: string
  name: string
  transKey?: string | null
  translations: Record<string, string>
  isDefault: boolean
  isEnabled: boolean
  sortOrder: number
  createdAt: string
  updatedAt: string
}

export interface SiteNavigationItem {
  id: number
  parentId?: number | null
  type: string
  key: string
  label: string
  description?: string | null
  href: string
  icon?: string | null
  target?: string | null
  dynamicDataKey?: string | null
  sortOrder: number
  items: SiteNavigationItem[]
}

export interface SiteInitPayload {
  siteConfig: SiteConfig
  siteLanguages: SiteLanguage[]
  navigation: SiteNavigationItem[]
}
