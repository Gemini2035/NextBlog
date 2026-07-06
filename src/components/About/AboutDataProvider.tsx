'use client'

import { createContext, useContext, type ReactNode } from 'react'
import type {
  AboutInitPayload,
  BaseInfoContent,
  ContactLinkItem,
  EducationExperienceItem,
  FriendLinkItem,
  SiteProtocolItem,
  SkillCategory,
  SocialLinkItem,
} from '@/types/about'

interface AboutDataProviderProps {
  value: AboutInitPayload
  children: ReactNode
}

const AboutDataContext = createContext<AboutInitPayload | null>(null)

export function AboutDataProvider({ value, children }: AboutDataProviderProps) {
  return (
    <AboutDataContext.Provider value={value}>
      {children}
    </AboutDataContext.Provider>
  )
}

export function useAboutData() {
  const value = useContext(AboutDataContext)

  if (!value) {
    throw new Error('useAboutData must be used within AboutDataProvider')
  }

  return value
}

export function useAboutValue<T>(key: string, fallback: T): T {
  const { content } = useAboutData()
  const value = content[key]

  return value === undefined || value === null ? fallback : (value as T)
}

export function useBaseInfo() {
  return useAboutValue<BaseInfoContent>('base_info', {
    description: '',
    summary: '',
  })
}

export function useAboutList<T>(key: string): T[] {
  const { content } = useAboutData()
  const value = content[key]

  return Array.isArray(value) ? (value as T[]) : []
}

export function useSocialLinks() {
  return useAboutList<SocialLinkItem>('social_link')
}

export function useFriendLinks() {
  return useAboutList<FriendLinkItem>('friend_links')
}

export function useContactLinks() {
  return useAboutList<ContactLinkItem>('contact_links')
}

export function useSkillCategories() {
  return useAboutList<SkillCategory>('skills')
}

export function useEducationExperiences() {
  return useAboutList<EducationExperienceItem>('education_experiences')
}

export function useSiteProtocols() {
  return useAboutList<SiteProtocolItem>('site_protocols')
}
