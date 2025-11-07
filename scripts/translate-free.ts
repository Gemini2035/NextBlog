#!/usr/bin/env node

import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { fileURLToPath } from 'url'
import { execSync } from 'child_process'
import { HttpsProxyAgent } from 'https-proxy-agent'
import { config } from 'dotenv'

import { translate } from '@vitalets/google-translate-api'

// 获取当前文件的目录路径
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// 加载 .env 文件（如果存在）
const envPath = path.join(__dirname, '..', '.env')
if (fs.existsSync(envPath)) {
  config({ path: envPath })
}

// 内容目录
const CONTENT_DIR = path.join(__dirname, '../content')

// 支持的翻译目标语言
const TARGET_LOCALES: string[] = ['en', 'ja']

// 检测是否在 CI/CD 环境（GitHub Actions, GitLab CI 等）
const isCI = process.env.CI === 'true' || process.env.GITHUB_ACTIONS === 'true'

// 代理配置
// 在 CI 环境中不使用代理，在本地开发时从环境变量读取
function getProxyUrl(): string | undefined {
  // CI 环境不使用代理
  if (isCI) {
    return undefined
  }
  
  // 本地环境：按优先级读取代理配置
  // 1. TRANSLATE_PROXY 环境变量（专门用于翻译脚本）
  // 2. HTTP_PROXY 或 HTTPS_PROXY 环境变量
  // 3. 如果都没有，返回 undefined（不使用代理）
  return (
    process.env.TRANSLATE_PROXY ||
    process.env.HTTP_PROXY ||
    process.env.HTTPS_PROXY ||
    undefined
  )
}

// 创建代理 agent（如果需要）
function getProxyAgent() {
  const proxyUrl = getProxyUrl()
  
  if (!proxyUrl) {
    return undefined
  }
  
  try {
    return new HttpsProxyAgent(proxyUrl)
  } catch (error) {
    console.warn('⚠️  代理配置失败，将不使用代理:', error)
    return undefined
  }
}

// Frontmatter 类型定义
interface Frontmatter {
  title?: string
  description?: string
  tags?: string[]
  locale?: string
  originalSlug?: string
  date?: string
  published?: boolean
  featured?: boolean
  updatedAt?: string
  _path?: string
  [key: string]: unknown
}

/**
 * 转换语言代码为 Google Translate 支持的格式
 */
function normalizeLangCode(locale: string): string {
  const langMap: Record<string, string> = {
    'zh': 'zh-CN',
    'en': 'en',
    'ja': 'ja'
  }
  return langMap[locale] || locale
}

/**
 * 格式化标题（首字母大写，保留其他格式）
 */
function formatTitle(title: string): string {
  if (!title || title.length === 0) return title
  
  // 如果标题全是大写或全是小写，进行智能格式化
  const isAllUpper = title === title.toUpperCase() && title.length > 1
  const isAllLower = title === title.toLowerCase()
  
  if (isAllUpper) {
    // 全大写：转换为标题格式（每个单词首字母大写）
    return title
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }
  
  if (isAllLower) {
    // 全小写：首字母大写
    return title.charAt(0).toUpperCase() + title.slice(1)
  }
  
  // 已有混合大小写，保持原样
  return title
}

/**
 * 将长文本分割成小块（避免翻译超时）
 */
function splitTextIntoChunks(text: string, maxLength: number): string[] {
  const chunks: string[] = []
  const paragraphs = text.split('\n\n')
  let currentChunk = ''

  for (const para of paragraphs) {
    if (currentChunk.length + para.length > maxLength) {
      if (currentChunk) chunks.push(currentChunk)
      currentChunk = para
    } else {
      currentChunk += (currentChunk ? '\n\n' : '') + para
    }
  }

  if (currentChunk) chunks.push(currentChunk)

  return chunks.length > 0 ? chunks : [text]
}

/**
 * 使用免费的 Google 翻译（带重试机制）
 */
async function translateText(text: string, from: string, to: string, retries = 3): Promise<string> {
  const fromLang = normalizeLangCode(from)
  const toLang = normalizeLangCode(to)
  const agent = getProxyAgent()
  const fetchOptions = agent ? { agent } : undefined

  const translateWithRetry = async (textToTranslate: string): Promise<string> => {
    let lastError: Error | null = null
    
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const result = await translate(textToTranslate, { 
          from: fromLang, 
          to: toLang,
          fetchOptions 
        })
        return result.text
      } catch (error) {
        lastError = error instanceof Error ? error : new Error('未知错误')
        
        // 如果是限流错误，等待后重试
        if (error instanceof Error && (
          error.message.includes('429') || 
          error.message.includes('TooManyRequests') ||
          error.message.includes('ETIMEDOUT')
        )) {
          const waitTime = attempt * 2000 // 递增等待时间：2s, 4s, 6s
          console.log(`    ⚠️  翻译失败（尝试 ${attempt}/${retries}），${waitTime/1000}秒后重试...`)
          await new Promise(resolve => setTimeout(resolve, waitTime))
          continue
        }
        
        // 其他错误直接抛出
        throw error
      }
    }
    
    throw lastError || new Error('翻译失败：超过最大重试次数')
  }

  try {
    // 如果文本较短，直接翻译
    if (text.length < 4000) {
      return await translateWithRetry(text)
    }

    // 长文本分段翻译
    const chunks = splitTextIntoChunks(text, 4000)
    const translatedChunks: string[] = []

    for (let i = 0; i < chunks.length; i++) {
      console.log(`    翻译片段 ${i + 1}/${chunks.length}...`)
      const translated = await translateWithRetry(chunks[i])
      translatedChunks.push(translated)

      // 添加延迟避免被限流（除了最后一块）
      if (i < chunks.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 1500))
      }
    }

    return translatedChunks.join('\n\n')
  } catch (error) {
    console.error('翻译失败:', error instanceof Error ? error.message : '未知错误')
    throw error
  }
}

/**
 * 翻译 frontmatter
 */
async function translateFrontmatter(
  frontmatter: Frontmatter,
  from: string,
  to: string
): Promise<Frontmatter> {
  const translated: Frontmatter = { ...frontmatter }

  // 翻译标题
  if (frontmatter.title) {
    console.log(`  📝 翻译标题...`)
    const translatedTitle = await translateText(frontmatter.title, from, to)
    // 格式化标题（首字母大写等）
    translated.title = formatTitle(translatedTitle)
    // 添加延迟
    await new Promise(resolve => setTimeout(resolve, 500))
  }

  // 翻译描述
  if (frontmatter.description) {
    console.log(`  📝 翻译描述...`)
    translated.description = await translateText(frontmatter.description, from, to)
    // 添加延迟
    await new Promise(resolve => setTimeout(resolve, 500))
  }

  // 保留其他字段
  translated.locale = to
  translated.originalSlug = frontmatter.originalSlug || path.basename(frontmatter._path || '', '.mdx')
  translated.date = frontmatter.date
  translated.tags = frontmatter.tags
  translated.published = frontmatter.published
  translated.featured = frontmatter.featured
  translated.updatedAt = frontmatter.updatedAt

  return translated
}

/**
 * 获取所有中文文章
 */
function getAllZhPosts(): string[] {
  const zhPostsDir = path.join(CONTENT_DIR, 'zh', 'posts')
  if (!fs.existsSync(zhPostsDir)) {
    console.log('⚠️  中文文章目录不存在')
    return []
  }

  return fs.readdirSync(zhPostsDir)
    .filter(file => file.endsWith('.mdx'))
    .map(file => `content/zh/posts/${file}`)
}

/**
 * 获取变更的文件
 */
function getChangedFiles(): string[] {
  try {
    const output = execSync('git diff --name-only HEAD~1 HEAD', { encoding: 'utf8' })
    const files = output.trim().split('\n').filter(file => file.length > 0)
    
    if (files.length === 0) {
      console.log('ℹ️  没有检测到 Git 变更，将处理所有中文文章')
      return getAllZhPosts()
    }
    
    return files
  } catch (error) {
    console.log('⚠️  无法获取 Git 变更，将处理所有中文文章')
    console.log('   错误信息:', error instanceof Error ? error.message : '未知错误')
    return getAllZhPosts()
  }
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
  console.log(`\n📄 处理文章: ${filePath}`)

  const fullPath = path.join(__dirname, '..', filePath)
  if (!fs.existsSync(fullPath)) {
    console.log('  ⏭️  文件不存在，跳过')
    return
  }

  const content = fs.readFileSync(fullPath, 'utf8')
  const { data: frontmatter, content: body } = matter(content)

  // 为每个目标语言创建翻译版本
  for (const toLocale of TARGET_LOCALES) {
    if (toLocale === fromLocale) continue

    // 检查目标文件是否已存在
    if (checkTargetFileExists(filePath, toLocale)) {
      console.log(`  ⏭️  跳过 ${toLocale} - 文件已存在`)
      continue
    }

    console.log(`\n  🌐 翻译到 ${toLocale}...`)

    try {
      // 翻译 frontmatter
      const translatedFrontmatter = await translateFrontmatter(frontmatter, fromLocale, toLocale)

      // 翻译正文
      console.log(`  📝 翻译正文...`)
      const translatedBody = await translateText(body, fromLocale, toLocale)

      // 创建目标语言目录
      const targetDir = path.join(CONTENT_DIR, toLocale, 'posts')
      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true })
      }

      // 生成翻译后的文件
      const translatedContent = matter.stringify(translatedBody, translatedFrontmatter)
      const targetPath = path.join(targetDir, path.basename(filePath))

      fs.writeFileSync(targetPath, translatedContent, 'utf8')
      console.log(`  ✅ 已创建翻译文件: ${targetPath}`)

      // 添加延迟避免 API 限制
      await new Promise(resolve => setTimeout(resolve, 1000))

    } catch (error) {
      console.error(`  ❌ 翻译到 ${toLocale} 失败:`, error instanceof Error ? error.message : '未知错误')
    }
  }
}

/**
 * 主函数
 */
async function main(): Promise<void> {
  const envInfo = isCI ? '🌐 CI/CD 环境（不使用代理）' : '💻 本地环境'
  const proxyUrl = getProxyUrl()
  const proxyInfo = proxyUrl ? `使用代理: ${proxyUrl}` : '未配置代理'
  
  console.log(`🚀 开始免费翻译（Google Translate）...`)
  console.log(`   ${envInfo}`)
  if (!isCI) {
    console.log(`   ${proxyInfo}`)
  }
  console.log()

  // 检查命令行参数，支持 --all 强制处理所有文章
  const forceAll = process.argv.includes('--all') || process.argv.includes('-a')

  // 获取需要处理的文件
  let zhFiles: string[]
  
  if (forceAll) {
    console.log('📋 使用 --all 参数，处理所有中文文章\n')
    zhFiles = getAllZhPosts()
  } else {
    const changedFiles = getChangedFiles()
    zhFiles = changedFiles.filter(file =>
      file.startsWith('content/zh/posts/') && file.endsWith('.mdx')
    )
  }

  if (zhFiles.length === 0) {
    console.log('ℹ️  没有找到需要处理的中文文章')
    console.log('   提示: 使用 --all 参数可以强制处理所有文章')
    return
  }

  console.log(`📋 发现 ${zhFiles.length} 个需要处理的文章:`)
  zhFiles.forEach(file => console.log(`   - ${file}`))
  console.log()

  // 处理每个文章
  for (const file of zhFiles) {
    await processPostFile(file, 'zh')
  }

  console.log('\n✨ 翻译完成！')
}

// 运行脚本
// 当通过 tsx 直接运行时执行
if (import.meta.url.startsWith('file:') && process.argv[1]) {
  main().catch(console.error)
}

export {
  translateText,
  translateFrontmatter,
  processPostFile,
  checkTargetFileExists
}

