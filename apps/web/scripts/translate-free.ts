#!/usr/bin/env node

import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { fileURLToPath } from 'url'
import { execSync } from 'child_process'
import { createHash } from 'crypto'
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
  } catch {
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
  sourceHash?: string  // 源文件内容的哈希值，用于检测变化
  translatedAt?: string  // 翻译时间
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
 * 计算文件内容的哈希值（用于检测内容变化）
 */
function calculateContentHash(content: string): string {
  return createHash('md5').update(content).digest('hex')
}

/**
 * 获取源文件的内容哈希（不包括 frontmatter 中的某些字段）
 */
function getSourceContentHash(filePath: string): string {
  const content = fs.readFileSync(filePath, 'utf8')
  const { data: frontmatter, content: body } = matter(content)
  
  // 只对标题、描述和正文内容计算哈希，忽略日期等元数据
  const contentToHash = JSON.stringify({
    title: frontmatter.title,
    description: frontmatter.description,
    body: body.trim()
  })
  
  return calculateContentHash(contentToHash)
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
 * 代码块占位符接口
 */
interface CodeBlockPlaceholder {
  placeholder: string
  code: string
  language?: string
}

/**
 * 翻译代码块中的注释
 */
async function translateCodeComments(code: string, from: string, to: string): Promise<string> {
  let result = code
  const commentPlaceholders: Array<{ placeholder: string; original: string }> = []
  let placeholderIndex = 0
  
  // 使用占位符替换所有注释，然后翻译占位符内容，最后替换回去
  // 这样可以避免索引偏移问题
  
  // 1. 处理单行注释 // (JavaScript/TypeScript/Java/C/C++/C#/Go等)
  result = result.replace(/(\/\/\s*)(.+?)(?=\n|$)/g, (match, prefix, comment) => {
    // 跳过 URL 和路径
    if (comment.trim().startsWith('http') || comment.includes('://')) {
      return match
    }
    const placeholder = `__COMMENT_SLASH_${placeholderIndex}__`
    commentPlaceholders.push({ placeholder, original: prefix + comment })
    placeholderIndex++
    return placeholder
  })
  
  // 2. 处理单行注释 # (Python/Shell/Ruby/YAML等)
  result = result.replace(/^(#\s*)(.+?)(?=\n|$)/gm, (match, prefix, comment) => {
    // 跳过 shebang 和特殊指令
    if (comment.trim().startsWith('!') || comment.trim().startsWith(' -*-')) {
      return match
    }
    const placeholder = `__COMMENT_HASH_${placeholderIndex}__`
    commentPlaceholders.push({ placeholder, original: prefix + comment })
    placeholderIndex++
    return placeholder
  })
  
  // 3. 处理多行注释 /* */ (JavaScript/TypeScript/Java/C/C++/C#/CSS等)
  result = result.replace(/(\/\*\*?)([\s\S]*?)(\*\/)/g, (match, _start, content) => {
    // 如果注释中包含代码示例或特殊标记，跳过
    if (content.includes('```') || content.includes('@')) {
      return match
    }
    const placeholder = `__COMMENT_MULTI_${placeholderIndex}__`
    commentPlaceholders.push({ placeholder, original: match })
    placeholderIndex++
    return placeholder
  })
  
  // 4. 处理 HTML/XML 注释 <!-- -->
  result = result.replace(/(<!--\s*)([\s\S]*?)(\s*-->)/g, (match) => {
    const placeholder = `__COMMENT_HTML_${placeholderIndex}__`
    commentPlaceholders.push({ placeholder, original: match })
    placeholderIndex++
    return placeholder
  })
  
  // 翻译所有占位符对应的注释
  const translatedComments: Map<string, string> = new Map()
  
  for (const { placeholder, original } of commentPlaceholders) {
    try {
      let commentToTranslate = original
      
      // 提取注释内容（去除注释符号）
      if (original.startsWith('//')) {
        commentToTranslate = original.replace(/^\/\/\s*/, '')
      } else if (original.startsWith('#')) {
        commentToTranslate = original.replace(/^#\s*/, '')
      } else if (original.startsWith('<!--')) {
        commentToTranslate = original.replace(/^<!--\s*/, '').replace(/\s*-->$/, '')
      } else if (original.startsWith('/*')) {
        // 多行注释需要逐行处理
        const lines = original.split('\n')
        const translatedLines: string[] = []
        
        for (const line of lines) {
          // 保留注释符号前的空格和星号
          const indentMatch = line.match(/^(\s*\*?\s*)/)
          const indent = indentMatch ? indentMatch[1] : ''
          const commentText = line.replace(/^\s*\*?\s*/, '').replace(/\*\/$/, '').replace(/^\/\*\*?/, '')
          
          if (commentText.trim()) {
            const translatedCommentText = await translateText(commentText, from, to)
            translatedLines.push(indent + translatedCommentText)
          } else {
            translatedLines.push(line)
          }
          
          await new Promise(resolve => setTimeout(resolve, 200))
        }
        
        // 恢复多行注释格式
        const firstLine = lines[0]
        const lastLine = lines[lines.length - 1]
        const startMatch = firstLine.match(/^(\/\*\*?)/)
        const endMatch = lastLine.match(/(\*\/)$/)
        
        if (startMatch && endMatch) {
          const start = startMatch[1]
          const end = endMatch[1]
          translatedComments.set(placeholder, start + '\n' + translatedLines.join('\n') + '\n' + end)
        } else {
          translatedComments.set(placeholder, original)
        }
        
        await new Promise(resolve => setTimeout(resolve, 300))
        continue
      }
      
      // 翻译注释内容
      const translatedComment = await translateText(commentToTranslate, from, to)
      
      // 恢复注释格式
      if (original.startsWith('//')) {
        translatedComments.set(placeholder, `// ${translatedComment}`)
      } else if (original.startsWith('#')) {
        translatedComments.set(placeholder, `# ${translatedComment}`)
      } else if (original.startsWith('<!--')) {
        translatedComments.set(placeholder, `<!-- ${translatedComment} -->`)
      }
      
      await new Promise(resolve => setTimeout(resolve, 300))
    } catch (error) {
      console.warn(`    警告: 翻译注释失败，保留原文: ${error instanceof Error ? error.message : '未知错误'}`)
      translatedComments.set(placeholder, original)
    }
  }
  
  // 替换所有占位符为翻译后的注释
  for (const [placeholder, translated] of translatedComments.entries()) {
    result = result.replace(placeholder, translated)
  }
  
  return result
}

/**
 * 提取代码块并替换为占位符
 */
function extractCodeBlocks(content: string): { text: string; blocks: CodeBlockPlaceholder[] } {
  const blocks: CodeBlockPlaceholder[] = []
  let blockIndex = 0
  
  // 提取 Markdown 代码块 ```language\n...\n```
  // 匹配格式：```language\ncode\n``` 或 ```\ncode\n```
  const textWithBlockPlaceholders = content.replace(
    /```(\w+)?([\s\S]*?)```/g,
    (match, language, code) => {
      // 移除代码开头和结尾的换行符（如果存在）
      const trimmedCode = code.replace(/^\n+/, '').replace(/\n+$/, '')
      const placeholder = `__CODE_BLOCK_${blockIndex}__`
      blocks.push({
        placeholder,
        code: trimmedCode,
        language: language || undefined
      })
      blockIndex++
      return placeholder
    }
  )
  
  return { text: textWithBlockPlaceholders, blocks }
}

/**
 * 恢复代码块占位符
 */
function restoreCodeBlocks(text: string, blocks: CodeBlockPlaceholder[]): string {
  let result = text
  
  blocks.forEach(({ placeholder, code, language }) => {
    const languageTag = language ? `${language}\n` : ''
    result = result.replace(placeholder, `\`\`\`${languageTag}${code}\n\`\`\``)
  })
  
  return result
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
  
  // 注意：sourceHash 和 translatedAt 将在 processPostFile 中设置

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
  } catch {
    console.log('⚠️  无法获取 Git 变更，将处理所有中文文章')
    console.log('   错误信息:', error instanceof Error ? error.message : '未知错误')
    return getAllZhPosts()
  }
}

/**
 * 检查目标文件是否需要更新
 * @returns { exists: boolean, needsUpdate: boolean, reason?: string }
 */
function checkTargetFileStatus(
  sourceFilePath: string,
  toLocale: string
): { exists: boolean; needsUpdate: boolean; reason?: string } {
  const targetDir = path.join(CONTENT_DIR, toLocale, 'posts')
  const targetPath = path.join(targetDir, path.basename(sourceFilePath))
  
  // 文件不存在，需要翻译
  if (!fs.existsSync(targetPath)) {
    return { exists: false, needsUpdate: true, reason: '文件不存在' }
  }
  
  // 获取源文件的内容哈希
  const sourceHash = getSourceContentHash(sourceFilePath)
  
  // 读取目标文件的 frontmatter
  try {
    const targetContent = fs.readFileSync(targetPath, 'utf8')
    const { data: targetFrontmatter } = matter(targetContent)
    
    // 如果目标文件没有 sourceHash，需要更新
    if (!targetFrontmatter.sourceHash) {
      return { exists: true, needsUpdate: true, reason: '缺少 sourceHash' }
    }
    
    // 比较哈希值
    if (targetFrontmatter.sourceHash !== sourceHash) {
      return { exists: true, needsUpdate: true, reason: '内容已变化' }
    }
    
    // 文件存在且内容未变化
    return { exists: true, needsUpdate: false }
  } catch {
    // 读取失败，需要重新翻译
    return { exists: true, needsUpdate: true, reason: '读取失败' }
  }
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
  
  // 获取源文件的内容哈希
  const sourceHash = getSourceContentHash(fullPath)

  // 为每个目标语言创建翻译版本
  for (const toLocale of TARGET_LOCALES) {
    if (toLocale === fromLocale) continue

    // 检查目标文件状态
    const status = checkTargetFileStatus(filePath, toLocale)
    
    if (status.exists && !status.needsUpdate) {
      console.log(`  ⏭️  跳过 ${toLocale} - 内容未变化`)
      continue
    }
    
    if (status.exists && status.needsUpdate) {
      console.log(`\n  🔄 更新 ${toLocale} 翻译 (${status.reason})...`)
    } else {
      console.log(`\n  🌐 翻译到 ${toLocale}...`)
    }

    try {
      // 翻译 frontmatter
      const translatedFrontmatter = await translateFrontmatter(frontmatter, fromLocale, toLocale)

      // 翻译正文（特殊处理代码块）
      console.log(`  📝 翻译正文...`)
      
      // 提取代码块
      const { text: textWithoutCode, blocks } = extractCodeBlocks(body)
      
      // 翻译普通文本部分
      const translatedText = await translateText(textWithoutCode, fromLocale, toLocale)
      
      // 翻译代码块中的注释
      console.log(`  💻 翻译代码块中的注释...`)
      const translatedBlocks: CodeBlockPlaceholder[] = []
      for (let i = 0; i < blocks.length; i++) {
        const block = blocks[i]
        console.log(`    处理代码块 ${i + 1}/${blocks.length}...`)
        const translatedCode = await translateCodeComments(block.code, fromLocale, toLocale)
        translatedBlocks.push({
          ...block,
          code: translatedCode
        })
      }
      
      // 恢复代码块
      const translatedBody = restoreCodeBlocks(translatedText, translatedBlocks)
      
      // 添加源文件哈希和翻译时间
      translatedFrontmatter.sourceHash = sourceHash
      translatedFrontmatter.translatedAt = new Date().toISOString()

      // 创建目标语言目录
      const targetDir = path.join(CONTENT_DIR, toLocale, 'posts')
      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true })
      }

      // 生成翻译后的文件
      const translatedContent = matter.stringify(translatedBody, translatedFrontmatter)
      const targetPath = path.join(targetDir, path.basename(filePath))

      fs.writeFileSync(targetPath, translatedContent, 'utf8')
      
      if (status.exists) {
        console.log(`  ✅ 已更新翻译文件: ${targetPath}`)
      } else {
        console.log(`  ✅ 已创建翻译文件: ${targetPath}`)
      }

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
  checkTargetFileStatus,
  getSourceContentHash,
  calculateContentHash
}
