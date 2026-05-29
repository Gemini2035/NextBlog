'use client'

import { createContext, useContext, type ReactNode } from 'react'
import type { AboutInitPayload, FriendLinkItem } from '@/types/about'

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

export function useAboutRecord(key: string): Record<string, string> {
  const { content } = useAboutData()
  const value = content[key]

  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return {}
  }

  return Object.fromEntries(
    Object.entries(value).filter((entry): entry is [string, string] => typeof entry[1] === 'string')
  )
}

export function useAboutList<T>(key: string): T[] {
  const { content } = useAboutData()
  const value = content[key]

  return Array.isArray(value) ? (value as T[]) : []
}

export function useFriendLinks() {
  return useAboutList<FriendLinkItem>('friend_links')
}
