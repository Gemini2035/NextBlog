#!/usr/bin/env node

import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import OpenAI from 'openai'
import { fileURLToPath } from 'url'

// 获取当前文件的目录路径
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// 配置 OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

// 支持的翻译目标语言
const TARGET_LOCALES: string[] = ['en', 'ja']

// 内容目录
const CONTENT_DIR = path.join(__dirname, '../content')

// 语言映射类型
interface LanguageMap {
  [key: string]: string
}

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
 * 使用 OpenAI 翻译文本
 */
async function translateWithOpenAI(text: string, fromLocale: string, toLocale: string): Promise<string> {
  const languageMap: LanguageMap = {
    'zh': 'Chinese',
    'en': 'English', 
    'ja': 'Japanese'
  }
  
  const fromLanguage = languageMap[fromLocale]
  const toLanguage = languageMap[toLocale]
  
  if (!fromLanguage || !toLanguage) {
    console.error(`不支持的语言: ${fromLocale} -> ${toLocale}`)
    return text
  }
  
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `You are a professional translator. Translate the following ${fromLanguage} text to ${toLanguage}. Maintain the original formatting, markdown syntax, and technical terms. Return only the translated text without any additional explanations.`
        },
        {
          role: "user",
          content: text
        }
      ],
      max_tokens: 2000,
      temperature: 0.3
    })
    
    return response.choices[0].message.content || text
  } catch (error) {
    console.error('翻译错误:', error instanceof Error ? error.message : '未知错误')
    return text // 如果翻译失败，返回原文
  }
}

/**
 * 翻译文章的 frontmatter
 */
async function translateFrontmatter(frontmatter: Frontmatter, fromLocale: string, toLocale: string): Promise<Frontmatter> {
  const translated: Frontmatter = { ...frontmatter }
  
  // 翻译标题
  if (frontmatter.title) {
    translated.title = await translateWithOpenAI(frontmatter.title, fromLocale, toLocale)
  }
  
  // 翻译描述
  if (frontmatter.description) {
    translated.description = await translateWithOpenAI(frontmatter.description, fromLocale, toLocale)
  }
  
  // 翻译标签
  if (frontmatter.tags && Array.isArray(frontmatter.tags)) {
    translated.tags = await Promise.all(
      frontmatter.tags.map(async (tag: string) => 
        await translateWithOpenAI(tag, fromLocale, toLocale)
      )
    )
  }
  
  // 添加语言标识
  translated.locale = toLocale
  translated.originalSlug = frontmatter.originalSlug || path.basename(frontmatter._path || '', '.mdx')
  
  return translated
}

/**
 * 检查目标文件是否已存在
 */
function checkTargetFileExists(filePath: string, toLocale: string): boolean {
  const targetDir = path.join(CONTENT_DIR, toLocale, 'posts')
  const targetPath = path.join(targetDir, path.basename(filePath))
  return fs.existsSync(targetPath)
}

/**
 * 处理单个文章文件
 */
async function processPostFile(filePath: string, fromLocale: string): Promise<void> {
  console.log(`处理文章: ${filePath}`)
  
  const content = fs.readFileSync(filePath, 'utf8')
  const { data: frontmatter, content: body } = matter(content)
  
  // 为每个目标语言创建翻译版本
  for (const toLocale of TARGET_LOCALES) {
    if (toLocale === fromLocale) continue
    
    // 检查目标文件是否已存在
    if (checkTargetFileExists(filePath, toLocale)) {
      console.log(`  ⏭️  跳过 ${toLocale} - 文件已存在`)
      continue
    }
    
    console.log(`  翻译到 ${toLocale}...`)
    
    try {
      const translatedFrontmatter = await translateFrontmatter(frontmatter, fromLocale, toLocale)
      const translatedBody = await translateWithOpenAI(body, fromLocale, toLocale)
      
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
      
      // 添加延迟避免 API 限制
      await new Promise(resolve => setTimeout(resolve, 1000))
      
    } catch (error) {
      console.error(`  翻译到 ${toLocale} 失败:`, error instanceof Error ? error.message : '未知错误')
    }
  }
}

/**
 * 主函数
 */
async function main(): Promise<void> {
  if (!process.env.OPENAI_API_KEY) {
    console.error('请设置 OPENAI_API_KEY 环境变量')
    process.exit(1)
  }
  
  console.log('开始使用 OpenAI 翻译文章...')
  
  // 处理中文文章
  const zhPostsDir = path.join(CONTENT_DIR, 'zh', 'posts')
  if (fs.existsSync(zhPostsDir)) {
    const files = fs.readdirSync(zhPostsDir)
    const mdxFiles = files.filter(file => file.endsWith('.mdx'))
    
    for (const file of mdxFiles) {
      const filePath = path.join(zhPostsDir, file)
      await processPostFile(filePath, 'zh')
    }
  }
  
  console.log('翻译完成！')
}

// 运行脚本
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error)
}

export {
  translateWithOpenAI,
  translateFrontmatter,
  processPostFile,
  checkTargetFileExists
}
