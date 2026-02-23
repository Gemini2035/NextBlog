// 工具函数

/**
 * 格式化日期
 */
export function formatDate(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return dateObj.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

/**
 * 将日期转为 ISO 字符串，用于 <time dateTime> 等需服务端/客户端一致的场景，避免水合错误
 */
export function toDateISO(value: string | Date | null | undefined): string {
  if (value == null) return ''
  const d = typeof value === 'string' ? new Date(value) : value
  return Number.isNaN(d.getTime()) ? '' : d.toISOString()
}

/**
 * 生成 slug
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/**
 * 截断文本
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength).trim() + '...'
}

/**
 * 获取相对时间
 */
export function getRelativeTime(date: string | Date): string {
  const now = new Date()
  const dateObj = typeof date === 'string' ? new Date(date) : date
  const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000)

  if (diffInSeconds < 60) return '刚刚'
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} 分钟前`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} 小时前`
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} 天前`
  if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)} 个月前`
  return `${Math.floor(diffInSeconds / 31536000)} 年前`
}

/**
 * 合并 CSS 类名
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ')
}

/**
 * 平滑滚动到指定元素
 * @param element 目标元素
 * @param offset 额外的偏移量，默认为0
 * @param behavior 滚动行为，默认为'smooth'
 */
export function smoothScrollToElement(
  element: HTMLElement, 
  offset: number = 0, 
  behavior: ScrollBehavior = 'smooth'
): void {
  const elementRect = element.getBoundingClientRect()
  const scrollTop = window.scrollY + elementRect.top - offset
  
  window.scrollTo({ 
    top: Math.max(0, scrollTop), 
    behavior 
  })
}

/**
 * 平滑滚动到指定ID的元素
 * @param elementId 目标元素的ID
 * @param offset 额外的偏移量，默认为0
 * @param behavior 滚动行为，默认为'smooth'
 */
export function smoothScrollToId(
  elementId: string, 
  offset: number = 0, 
  behavior: ScrollBehavior = 'smooth'
): void {
  const element = document.getElementById(elementId)
  if (element) {
    smoothScrollToElement(element, offset, behavior)
  }
}