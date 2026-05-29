export type AboutContentValue = unknown

export interface AboutInitPayload {
  content: Record<string, AboutContentValue>
}

export interface FriendLinkItem {
  name: string
  url: string
  icon?: string
}
