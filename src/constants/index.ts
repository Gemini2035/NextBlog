// 应用常量 - 从JSON配置文件加载

import siteConfigData from './site-config.json'
import { getFeaturedPost, getRecentPosts, getPostsByCategory, getCategories } from '@/lib/posts'

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

// 生成带有动态子菜单的导航项
export function getNavigationItemsWithSubmenus(): NavigationItem[] {
  try {
    // 获取文章分类数据
    const featuredPost = getFeaturedPost()
    const recentPosts = getRecentPosts()
    const categories = getCategories()
    
    // 为有submenu的导航项动态填充内容
    return NAVIGATION_ITEMS.map(item => {
      if (item.type === '__blog' && item.submenu) {
        const submenuItems: SubmenuItem[] = []
        
        // 添加置顶文章
        if (featuredPost) {
          submenuItems.push({
            label: '置顶文章',
            href: '/posts#featured',
            items: [{
              label: featuredPost.title,
              href: `/posts/${featuredPost.slug}`,
            }]
          })
        }
        
        // 添加最新文章
          submenuItems.push({
            label: '最新文章',
            href: '/posts#recent',
            items: recentPosts.slice(0, 10).map(post => ({
              label: post.title,
              href: `/posts/${post.slug}`,
            }))
          })
        
        // 添加技术分类
        const categoryItems: SubmenuItem[] = []
        categories.forEach(category => {
          const categoryPosts = getPostsByCategory(category)
          if (categoryPosts.length > 0) {
            categoryItems.push({
              label: `${category}`,
              href: `/posts#${category.toLowerCase()}`,
            })
          }
        })
        
        if (categoryItems.length > 0) {
          submenuItems.push({
            label: '技术分类',
            href: '/posts#categories',
            items: categoryItems
          })
        }
        
        return {
          ...item,
          submenu: {
            ...item.submenu,
            items: submenuItems
          }
        }
      }
      return item
    })
  } catch (error) {
    // 如果出错，返回静态配置
    return NAVIGATION_ITEMS
  }
}

export const POSTS_PER_PAGE = siteConfigData.app.postsPerPage
export const TAG_COLORS = siteConfigData.app.tagColors

// 语言配置
export const LANGUAGES = siteConfigData.app.languages
