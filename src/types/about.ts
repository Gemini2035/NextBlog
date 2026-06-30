export type AboutContentValue = unknown

export interface AboutInitPayload {
  content: Record<string, AboutContentValue>
}

export interface FriendLinkItem {
  iconBase64?: string | null
  name: string
  url: string
}

export interface TechStackItem {
  description: string
  iconBase64?: string | null
  id: number
  isDeprecated: boolean
  name: string
  summary: string
}
