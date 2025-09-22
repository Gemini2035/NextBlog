import Fuse, { FuseResultMatch, IFuseOptions } from 'fuse.js'
import { allPosts, Post } from '../../../../../.contentlayer/generated'
import { NAVIGATION_ITEMS } from '@/constants'
import { getRecentPosts, getFeaturedPost } from '@/lib/posts'

// 搜索项类型定义
export interface SearchableItem {
  id: string
  type: 'post' | 'link' | 'category'
  title: string
  description?: string
  href: string
  tags?: string[]
  content?: string
  priority: number
  category?: string
}

// 搜索结果类型
export interface SearchResult {
  item: SearchableItem
  score?: number
  matches?: FuseResultMatch[]
}

// 搜索结果分组
export interface SearchResultsGroup {
  title: string
  items: SearchResult[]
  type: 'posts' | 'links' | 'categories'
}

// 推荐内容类型
export interface RecommendedContent {
  featuredPosts: SearchableItem[]
  recentPosts: SearchableItem[]
  navigationLinks: SearchableItem[]
}

class SearchService {
  private fuse!: Fuse<SearchableItem>
  private searchableItems: SearchableItem[] = []

  constructor() {
    this.initializeSearchData()
    this.setupFuse()
  }

  // 初始化搜索数据
  private initializeSearchData() {
    const items: SearchableItem[] = []

    // 1. 添加博客文章
    const publishedPosts = allPosts.filter((post: Post) => post.published !== false)
    publishedPosts.forEach((post: Post) => {
      items.push({
        id: `post-${post.slug}`,
        type: 'post',
        title: post.title,
        description: post.description,
        href: `/posts/${post.slug}`,
        tags: post.tags,
        content: post.body?.raw || '',
        priority: post.featured ? 10 : 5,
        category: '博客文章'
      })
    })

    // 2. 添加导航链接
    NAVIGATION_ITEMS.forEach(navItem => {
      if (navItem.type !== '__search' && navItem.type !== '__language') {
        items.push({
          id: `nav-${navItem.type}`,
          type: 'link',
          title: navItem.label,
          description: navItem.submenu?.description,
          href: navItem.href,
          priority: 8,
          category: '导航链接'
        })

        // 添加子菜单项
        navItem.submenu?.items.forEach(subItem => {
          items.push({
            id: `nav-${navItem.type}-${subItem.label}`,
            type: 'link',
            title: subItem.label,
            description: subItem.description,
            href: subItem.href,
            priority: 6,
            category: '导航链接'
          })

          // 添加三级菜单项
          subItem.items?.forEach(thirdItem => {
            items.push({
              id: `nav-${navItem.type}-${subItem.label}-${thirdItem.label}`,
              type: 'link',
              title: thirdItem.label,
              description: thirdItem.description,
              href: thirdItem.href,
              priority: 4,
              category: '导航链接'
            })
          })
        })
      }
    })

    this.searchableItems = items
  }

  // 配置Fuse.js
  private setupFuse() {
    const options: IFuseOptions<SearchableItem> = {
      keys: [
        { name: 'title', weight: 0.4 },
        { name: 'description', weight: 0.3 },
        { name: 'tags', weight: 0.2 },
        { name: 'content', weight: 0.1 }
      ],
      threshold: 0.3, // 匹配阈值，越小越严格
      includeScore: true,
      includeMatches: true,
      minMatchCharLength: 2,
      ignoreLocation: true, // 忽略位置，提高匹配率
      findAllMatches: true
    }

    this.fuse = new Fuse(this.searchableItems, options)
  }

  // 执行搜索
  search(query: string, getTranslation: (key: string) => string): SearchResultsGroup[] {
    if (!query.trim()) {
      return []
    }

    const results = this.fuse.search(query)
    
    // 按类型分组
    const groupedResults: { [key: string]: SearchResult[] } = {
      posts: [],
      links: [],
      categories: []
    }

    results.forEach(result => {
      const searchResult: SearchResult = {
        item: result.item,
        score: result.score,
        matches: result.matches as FuseResultMatch[]
      }

      if (result.item.type === 'post') {
        groupedResults.posts.push(searchResult)
      } else if (result.item.type === 'link') {
        groupedResults.links.push(searchResult)
      } else if (result.item.type === 'category') {
        groupedResults.categories.push(searchResult)
      }
    })

    // 转换为分组格式
    const searchGroups: SearchResultsGroup[] = []

    if (groupedResults.posts.length > 0) {
      searchGroups.push({
        title: getTranslation('searchResults.blogPosts'),
        items: groupedResults.posts.slice(0, 5), // 限制显示数量
        type: 'posts'
      })
    }

    if (groupedResults.links.length > 0) {
      searchGroups.push({
        title: getTranslation('searchResults.navigationLinks'),
        items: groupedResults.links.slice(0, 5),
        type: 'links'
      })
    }

    if (groupedResults.categories.length > 0) {
      searchGroups.push({
        title: getTranslation('searchResults.categories'),
        items: groupedResults.categories.slice(0, 5),
        type: 'categories'
      })
    }

    return searchGroups
  }

  // 获取推荐内容
  getRecommendedContent(): RecommendedContent {
    const featuredPost = getFeaturedPost()
    const recentPosts = getRecentPosts()

    // 置顶文章
    const featuredPosts: SearchableItem[] = featuredPost ? [{
      id: `post-${featuredPost.slug}`,
      type: 'post',
      title: featuredPost.title,
      description: featuredPost.description,
      href: `/posts/${featuredPost.slug}`,
      tags: featuredPost.tags,
      priority: 10,
      category: '博客文章'
    }] : []

    // 最新文章
    const recentPostsItems: SearchableItem[] = recentPosts.slice(0, 5).map(post => ({
      id: `post-${post.slug}`,
      type: 'post',
      title: post.title,
      description: post.description,
      href: `/posts/${post.slug}`,
      tags: post.tags,
      priority: 7,
      category: '博客文章'
    }))

    // 导航链接（header中的四个主要链接）
    const navigationLinks: SearchableItem[] = NAVIGATION_ITEMS
      .filter(item => item.type !== '__search' && item.type !== '__language')
      .slice(0, 4)
      .map(navItem => ({
        id: `nav-${navItem.type}`,
        type: 'link',
        title: navItem.label,
        description: navItem.submenu?.description,
        href: navItem.href,
        priority: 8,
        category: '导航链接'
      }))

    return {
      featuredPosts,
      recentPosts: recentPostsItems,
      navigationLinks
    }
  }

  // 获取所有搜索项（用于调试）
  getAllItems(): SearchableItem[] {
    return this.searchableItems
  }
}

// 创建单例实例
export const searchService = new SearchService()

// 导出便捷方法
export const search = (query: string, getTranslation: (key: string) => string) => searchService.search(query, getTranslation)
export const getRecommendedContent = () => searchService.getRecommendedContent()
