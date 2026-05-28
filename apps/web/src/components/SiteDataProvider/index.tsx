'use client'

import { createContext, useContext, type ReactNode } from 'react'
import { SITE_CONFIG as DEFAULT_SITE_CONFIG } from '@/constants'
import type { SiteConfig, SiteInitPayload } from '@/types/site'

interface SiteDataProviderProps {
  value: SiteInitPayload
  children: ReactNode
}

const SiteDataContext = createContext<SiteInitPayload | null>(null)

export function SiteDataProvider({ value, children }: SiteDataProviderProps) {
  return (
    <SiteDataContext.Provider value={value}>
      {children}
    </SiteDataContext.Provider>
  )
}

export function useSiteData() {
  const value = useContext(SiteDataContext)

  if (!value) {
    throw new Error('useSiteData must be used within SiteDataProvider')
  }

  return value
}

export function useSiteConfig(): SiteConfig {
  const { siteConfig, siteLanguages } = useSiteData()
  return {
    ...DEFAULT_SITE_CONFIG,
    ...siteConfig,
    languages: siteLanguages.map((language) => ({
      code: language.code,
      name: language.name,
      nativeName: language.translations[language.code] ?? language.name,
      translations: language.translations,
    })),
  }
}
