// 应用常量 - 从JSON配置文件加载

import siteConfigData from './site-config.json'

export const SITE_CONFIG = siteConfigData.site
export const APP_CONFIG = siteConfigData.app
export const HEADER_CONFIG = siteConfigData.app.header

// 导航项类型定义
export interface SubmenuItem {
  label: string
  href: string
  description?: string
  icon?: string
  items?: SubmenuItem[]
}

export interface NavigationItem {
  type: '__blog' | '__about' | '__projects' | '__resources' | '__search' | '__language' // 唯一标识符，用于程序逻辑判断
  label: string
  href: string
  submenu?: {
    title: string
    description: string
    items: SubmenuItem[]
  }
}

export const NAVIGATION_ITEMS: NavigationItem[] = siteConfigData.app.header.navigation as NavigationItem[]


export const POSTS_PER_PAGE = siteConfigData.app.postsPerPage
export const TAG_COLORS = siteConfigData.app.tagColors

// 语言配置
export const LANGUAGES = siteConfigData.app.languages
