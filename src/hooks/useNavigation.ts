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
      const categories = posts.getCategories()
      
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
                href: `/posts/${featuredPost.slug}`,
              }]
            })
          }
          
          // 添加最新文章
          submenuItems.push({
            label: 'Latest Articles',
            href: '/posts#recent',
            items: recentPosts.slice(0, 10).map(post => ({
              label: post.title,
              href: `/posts/${post.slug}`,
            }))
          })
          
          // 添加技术分类
          const categoryItems: SubmenuItem[] = []
          categories.forEach(category => {
            const categoryPosts = posts.getPostsByCategory(category)
            if (categoryPosts.length > 0) {
              categoryItems.push({
                label: `${category}`,
                href: `/posts#${category.toLowerCase()}`,
              })
            }
          })
          
          if (categoryItems.length > 0) {
            submenuItems.push({
              label: 'Tech Categories',
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
    } catch {
      // 如果出错，返回静态配置
      return NAVIGATION_ITEMS
    }
  }, [posts])

  console.log('navigationItems', navigationItems)
  
  return {
    navigationItems,
    currentLocale: posts.currentLocale
  }
}
