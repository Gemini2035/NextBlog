export type AboutContentValue = unknown

export interface AboutInitPayload {
  content: Record<string, AboutContentValue>
}

export interface FriendLinkItem {
  name: string
  url: string
  icon?: string
}

export interface TechStackItem {
  description: string
  iconBase64?: string | null
  id: number
  isDeprecated: boolean
  name: string
  summary: string
}
