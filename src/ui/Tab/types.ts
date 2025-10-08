import type { ReactNode } from 'react'

export interface TabItem {
  key: string
  label: ReactNode
  children: ReactNode
  disabled?: boolean
}

export interface TabProps {
  items: TabItem[]
  defaultActiveKey?: string
  activeKey?: string
  onChange?: (key: string) => void
  className?: string
  tabBarClassName?: string
  tabContentClassName?: string
  size?: 'small' | 'medium' | 'large'
  type?: 'line' | 'card'
}
