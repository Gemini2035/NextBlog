import { useMemo } from 'react'
import { NAVIGATION_ITEMS, NavigationItem, SubmenuItem } from '@/constants'
import { usePosts } from './usePosts'

export function useNavigation() {
  const posts = usePosts()
  
  // 生成带有动态子菜单的导航项
  const navigationItems = useMemo((): NavigationItem[] => {
    try {
      // 获取文章分类数据
      const featuredPost = posts.getFeaturedPost()
      const recentPosts = posts.getRecentPosts()
      
      // 为有submenu的导航项动态填充内容
      return NAVIGATION_ITEMS.map(item => {
        if (item.type === '__blog' && item.submenu) {
          const submenuItems: SubmenuItem[] = []
          
          // 添加置顶文章
          if (featuredPost) {
            submenuItems.push({
              label: 'Featured Articles',
              href: '/posts#featured',
              items: [{
                label: featuredPost.title,
                href: `/posts/${featuredPost.id}`,
              }]
            })
          }
          
          // 添加最新文章
          submenuItems.push({
            label: 'Latest Articles',
            href: '/posts#recent',
            items: recentPosts.slice(0, 10).map(post => ({
              label: post.title,
              href: `/posts/${post.id}`,
            }))
          })
          
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
    } catch {
      // 如果出错，返回静态配置
      return NAVIGATION_ITEMS
    }
  }, [posts])
  
  return {
    navigationItems,
    currentLocale: posts.currentLocale
  }
}
