// 应用常量

export const SITE_CONFIG = {
  title: '我的博客',
  description: '分享技术见解、开发经验和生活感悟',
  author: '博客作者',
  url: 'https://gemini2035.github.io',
  social: {
    github: 'https://github.com/Gemini2035',
    twitter: undefined,
    linkedin: undefined,
  }
} as const

export const NAVIGATION_ITEMS = [
  { label: '首页', href: '/' },
  { label: '博客', href: '/posts' },
  { label: '关于', href: '/about' },
] as const

export const POSTS_PER_PAGE = 6

export const TAG_COLORS = [
  'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200',
  'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
  'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
] as const
