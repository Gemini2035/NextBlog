export type AboutContentValue = unknown

export interface AboutInitPayload {
  content: Record<string, AboutContentValue>
}

export interface FriendLinkItem {
  icon?: string | null
  name: string
  url: string
}

export interface SocialLinkItem {
  icon?: string | null
  name: string
  url: string
}

export interface BaseInfoContent {
  description: string
  summary: string
}

export interface TechStackItem {
  description: string
  iconBase64?: string | null
  id: number
  isDeprecated: boolean
  name: string
  summary: string
}

export interface ContactLinkItem {
  iconBase64?: string | null
  id: number
  label: string
  type: string
  value: string
}

export interface SkillItem {
  description: string
  id: number
  name: string
}

export interface SkillCategory {
  id: number
  items: SkillItem[]
  name: string
  textColor?: string | null
}

export interface EducationExperienceItem {
  degree: string
  description: string
  id: number
  major?: string | null
  periodEnd?: string | null
  periodStart?: string | null
  school: string
}

export interface SiteProtocolItem {
  category: string
  description: string
  features: string
  iconBase64?: string | null
  id: number
  name: string
  url?: string | null
}
