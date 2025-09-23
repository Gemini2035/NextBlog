#!/usr/bin/env node

import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { fileURLToPath } from 'url'

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
  // 这里可以配置翻译 API，比如 Google Translate API 或其他翻译服务
  // 为了演示，我们使用简单的映射
  translations: {
    'zh': {
      'en': {
        '欢迎来到我的博客': 'Welcome to My Blog',
        '这是我的第一篇博客文章': 'This is my first blog post',
        'Next.js 开发技巧': 'Next.js Development Tips',
        '分享一些 Next.js 开发中的实用技巧': 'Sharing some practical tips for Next.js development'
      },
      'ja': {
        '欢迎来到我的博客': '私のブログへようこそ',
        '这是我的第一篇博客文章': 'これは私の最初のブログ記事です',
        'Next.js 开发技巧': 'Next.js 開発のコツ',
        '分享一些 Next.js 开发中的实用技巧': 'Next.js 開発における実用的なコツを共有します'
      }
    }
  }
}

// 支持的翻译目标语言
const TARGET_LOCALES: string[] = ['en', 'ja']

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
 * 简单的翻译函数（实际项目中应该使用真实的翻译 API）
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
  // 这里可以实现更复杂的翻译逻辑
  // 比如使用 OpenAI API、Google Translate API 等
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
  
  // 翻译标签（这里保持原样，但可以添加翻译逻辑）
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
function processPostFile(filePath: string, fromLocale: string): void {
  console.log(`处理文章: ${filePath}`)
  
  const content = fs.readFileSync(filePath, 'utf8')
  const { data: frontmatter, content: body } = matter(content)
  
  // 为每个目标语言创建翻译版本
  TARGET_LOCALES.forEach(toLocale => {
    if (toLocale === fromLocale) return
    
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
    console.log(`✓ 已创建翻译文件: ${targetPath}`)
  })
}

/**
 * 主函数
 */
function main(): void {
  console.log('开始翻译文章...')
  
  // 处理中文文章
  const zhPostsDir = path.join(CONTENT_DIR, 'zh', 'posts')
  if (fs.existsSync(zhPostsDir)) {
    const files = fs.readdirSync(zhPostsDir)
    const mdxFiles = files.filter(file => file.endsWith('.mdx'))
    
    mdxFiles.forEach(file => {
      const filePath = path.join(zhPostsDir, file)
      processPostFile(filePath, 'zh')
    })
  }
  
  console.log('翻译完成！')
}

// 运行脚本
if (import.meta.url === `file://${process.argv[1]}`) {
  main()
}

export {
  translateText,
  translatePostContent,
  translateFrontmatter,
  processPostFile
}
