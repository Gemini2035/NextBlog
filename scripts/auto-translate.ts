#!/usr/bin/env node

import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { fileURLToPath } from 'url'
import { execSync } from 'child_process'

// 获取当前文件的目录路径
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// 翻译配置类型
interface TranslationConfig {
  translations: {
    [fromLocale: string]: {
      [toLocale: string]: {
        [key: string]: string
      }
    }
  }
}

// 翻译配置
const TRANSLATION_CONFIG: TranslationConfig = {
  translations: {
    'zh': {
      'en': {
        '欢迎来到我的博客': 'Welcome to My Blog',
        '这是我的第一篇博客文章': 'This is my first blog post',
        'Next.js 开发技巧': 'Next.js Development Tips',
        '分享一些 Next.js 开发中的实用技巧': 'Sharing some practical tips for Next.js development',
        '博客': 'Blog',
        '文章': 'Articles',
        '标签': 'Tags',
        '分类': 'Categories',
        '阅读更多': 'Read More',
        '发布时间': 'Published',
        '更新时间': 'Updated',
        '作者': 'Author'
      },
      'ja': {
        '欢迎来到我的博客': '私のブログへようこそ',
        '这是我的第一篇博客文章': 'これは私の最初のブログ記事です',
        'Next.js 开发技巧': 'Next.js 開発のコツ',
        '分享一些 Next.js 开发中的实用技巧': 'Next.js 開発における実用的なコツを共有します',
        '博客': 'ブログ',
        '文章': '記事',
        '标签': 'タグ',
        '分类': 'カテゴリ',
        '阅读更多': '続きを読む',
        '发布时间': '公開日',
        '更新时间': '更新日',
        '作者': '著者'
      }
    },
    'en': {
      'zh': {
        'Welcome to My Blog': '欢迎来到我的博客',
        'This is my first blog post': '这是我的第一篇博客文章',
        'Next.js Development Tips': 'Next.js 开发技巧',
        'Sharing some practical tips for Next.js development': '分享一些 Next.js 开发中的实用技巧',
        'Blog': '博客',
        'Articles': '文章',
        'Tags': '标签',
        'Categories': '分类',
        'Read More': '阅读更多',
        'Published': '发布时间',
        'Updated': '更新时间',
        'Author': '作者'
      },
      'ja': {
        'Welcome to My Blog': '私のブログへようこそ',
        'This is my first blog post': 'これは私の最初のブログ記事です',
        'Next.js Development Tips': 'Next.js 開発のコツ',
        'Sharing some practical tips for Next.js development': 'Next.js 開発における実用的なコツを共有します',
        'Blog': 'ブログ',
        'Articles': '記事',
        'Tags': 'タグ',
        'Categories': 'カテゴリ',
        'Read More': '続きを読む',
        'Published': '公開日',
        'Updated': '更新日',
        'Author': '著者'
      }
    },
    'ja': {
      'zh': {
        '私のブログへようこそ': '欢迎来到我的博客',
        'これは私の最初のブログ記事です': '这是我的第一篇博客文章',
        'Next.js 開発のコツ': 'Next.js 开发技巧',
        'Next.js 開発における実用的なコツを共有します': '分享一些 Next.js 开发中的实用技巧',
        'ブログ': '博客',
        '記事': '文章',
        'タグ': '标签',
        'カテゴリ': '分类',
        '続きを読む': '阅读更多',
        '公開日': '发布时间',
        '更新日': '更新时间',
        '著者': '作者'
      },
      'en': {
        '私のブログへようこそ': 'Welcome to My Blog',
        'これは私の最初のブログ記事です': 'This is my first blog post',
        'Next.js 開発のコツ': 'Next.js Development Tips',
        'Next.js 開発における実用的なコツを共有します': 'Sharing some practical tips for Next.js development',
        'ブログ': 'Blog',
        '記事': 'Articles',
        'タグ': 'Tags',
        'カテゴリ': 'Categories',
        '続きを読む': 'Read More',
        '公開日': 'Published',
        '更新日': 'Updated',
        '著者': 'Author'
      }
    }
  }
}

// 支持的翻译目标语言
const TARGET_LOCALES: string[] = ['zh', 'en', 'ja']

// 内容目录
const CONTENT_DIR = path.join(__dirname, '../content')

// Frontmatter 类型定义
interface Frontmatter {
  title?: string
  description?: string
  tags?: string[]
  locale?: string
  originalSlug?: string
  _path?: string
  [key: string]: any
}

/**
 * 获取 Git 变更的文件列表
 */
function getChangedFiles(): string[] {
  try {
    const output = execSync('git diff --name-only HEAD~1 HEAD', { encoding: 'utf8' })
    return output.trim().split('\n').filter(file => file.length > 0)
  } catch (error) {
    console.log('无法获取 Git 变更，将处理所有文件')
    return []
  }
}

/**
 * 检测变更的文章文件
 */
function detectChangedPosts(changedFiles: string[]): { locale: string; files: string[] }[] {
  const result: { locale: string; files: string[] }[] = []
  
  for (const locale of TARGET_LOCALES) {
    const postFiles = changedFiles.filter(file => 
      file.startsWith(`content/${locale}/posts/`) && file.endsWith('.mdx')
    )
    
    if (postFiles.length > 0) {
      result.push({ locale, files: postFiles })
    }
  }
  
  return result
}

/**
 * 简单的翻译函数
 */
function translateText(text: string, fromLocale: string, toLocale: string): string {
  const translations = TRANSLATION_CONFIG.translations[fromLocale]?.[toLocale]
  if (!translations) return text
  
  // 简单的关键词替换
  let translatedText = text
  for (const [original, translated] of Object.entries(translations)) {
    translatedText = translatedText.replace(new RegExp(original, 'g'), translated)
  }
  
  return translatedText
}

/**
 * 翻译文章内容
 */
function translatePostContent(content: string, fromLocale: string, toLocale: string): string {
  return translateText(content, fromLocale, toLocale)
}

/**
 * 翻译文章的 frontmatter
 */
function translateFrontmatter(frontmatter: Frontmatter, fromLocale: string, toLocale: string): Frontmatter {
  const translated: Frontmatter = { ...frontmatter }
  
  // 翻译标题
  if (frontmatter.title) {
    translated.title = translateText(frontmatter.title, fromLocale, toLocale)
  }
  
  // 翻译描述
  if (frontmatter.description) {
    translated.description = translateText(frontmatter.description, fromLocale, toLocale)
  }
  
  // 翻译标签
  if (frontmatter.tags) {
    translated.tags = frontmatter.tags.map(tag => translateText(tag, fromLocale, toLocale))
  }
  
  // 添加语言标识
  translated.locale = toLocale
  translated.originalSlug = frontmatter.originalSlug || path.basename(frontmatter._path || '', '.mdx')
  
  return translated
}

/**
 * 处理单个文章文件
 */
function processPostFile(filePath: string, fromLocale: string, targetLocales: string[]): void {
  console.log(`处理文章: ${filePath}`)
  
  const content = fs.readFileSync(filePath, 'utf8')
  const { data: frontmatter, content: body } = matter(content)
  
  // 为每个目标语言创建翻译版本
  targetLocales.forEach(toLocale => {
    if (toLocale === fromLocale) return
    
    console.log(`  翻译到 ${toLocale}...`)
    
    const translatedFrontmatter = translateFrontmatter(frontmatter, fromLocale, toLocale)
    const translatedBody = translatePostContent(body, fromLocale, toLocale)
    
    // 创建目标语言目录
    const targetDir = path.join(CONTENT_DIR, toLocale, 'posts')
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true })
    }
    
    // 生成翻译后的文件
    const translatedContent = matter.stringify(translatedBody, translatedFrontmatter)
    const targetPath = path.join(targetDir, path.basename(filePath))
    
    fs.writeFileSync(targetPath, translatedContent)
    console.log(`  ✓ 已创建翻译文件: ${targetPath}`)
  })
}

/**
 * 主函数
 */
function main(): void {
  console.log('开始自动翻译...')
  
  // 获取变更的文件
  const changedFiles = getChangedFiles()
  console.log('变更的文件:', changedFiles)
  
  // 检测变更的文章
  const changedPosts = detectChangedPosts(changedFiles)
  
  if (changedPosts.length === 0) {
    console.log('没有检测到文章变更，跳过翻译')
    return
  }
  
  // 处理每个变更的语言
  changedPosts.forEach(({ locale, files }) => {
    console.log(`\n处理 ${locale} 语言的文章变更:`)
    
    // 确定目标翻译语言
    const targetLocales = TARGET_LOCALES.filter(l => l !== locale)
    
    files.forEach(file => {
      const fullPath = path.join(__dirname, '..', file)
      if (fs.existsSync(fullPath)) {
        processPostFile(fullPath, locale, targetLocales)
      }
    })
  })
  
  console.log('\n自动翻译完成！')
}

// 运行脚本
if (import.meta.url === `file://${process.argv[1]}`) {
  main()
}

export {
  getChangedFiles,
  detectChangedPosts,
  translateText,
  translatePostContent,
  translateFrontmatter,
  processPostFile
}
