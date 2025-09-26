#!/usr/bin/env node

import fs from 'fs'
import path from 'path'

// 类型定义
interface TagStat {
  name: string
  count: number
}

interface TagListData {
  tags: string[]
  tagStats: string
  generatedAt: string
  totalTags: number
  totalPosts: number
  totalTagUsages: number
  averageTagsPerPost: number
  mostUsedTag: TagStat
  leastUsedTag: TagStat
  frequency: {
    high: TagStat[]
    medium: TagStat[]
    low: TagStat[]
  }
}

/**
 * 处理标签名称，移除特殊字符并使用驼峰命名法
 */
function processTagName(tagName: string): string {
  // 移除点号和其他特殊字符，保留字母、数字、中文字符和连字符
  let processed = tagName.replace(/[^\w\u4e00-\u9fa5-]/g, '')
  
  // 将连字符分隔的单词转换为驼峰命名法
  processed = processed.replace(/-([a-z])/g, (match, letter) => letter.toUpperCase())
  
  // 确保首字母大写（PascalCase）
  if (processed.length > 0) {
    processed = processed[0].toUpperCase() + processed.slice(1)
  }
  
  return processed
}

/**
 * 生成全局标签列表
 * 扫描所有 MDX 文件，提取标签并生成 taglist.json
 */
async function generateTagList(): Promise<void> {
  try {
    console.log('🔍 扫描文章文件...')
    
    // 递归扫描所有 MDX 文件
    function findMdxFiles(dir: string): string[] {
      const files: string[] = []
      const items = fs.readdirSync(dir)
      
      for (const item of items) {
        const fullPath = path.join(dir, item)
        const stat = fs.statSync(fullPath)
        
        if (stat.isDirectory()) {
          files.push(...findMdxFiles(fullPath))
        } else if (item.endsWith('.mdx')) {
          files.push(fullPath)
        }
      }
      
      return files
    }
    
    const mdxFiles = findMdxFiles('content')
    console.log(`📄 找到 ${mdxFiles.length} 个 MDX 文件`)
    
    const allTags = new Set<string>()
    const tagCounts = new Map<string, number>()
    
    // 处理每个文件
    for (const filePath of mdxFiles) {
      try {
        const content = fs.readFileSync(filePath, 'utf8')
        
        // 提取 frontmatter 中的标签
        const frontmatterMatch = content.match(/^---\s*\n([\s\S]*?)\n---/)
        if (frontmatterMatch) {
          const frontmatter = frontmatterMatch[1]
          const tagsMatch = frontmatter.match(/^tags:\s*\[(.*?)\]/m)
          
          if (tagsMatch) {
            // 解析标签数组
            const tagsString = tagsMatch[1]
            const tags = tagsString
              .split(',')
              .map(tag => tag.trim().replace(/['"]/g, ''))
              .filter(tag => tag.length > 0)
            
            // 处理并添加到集合中
            tags.forEach(tag => {
              const processedTag = processTagName(tag)
              if (processedTag) {
                allTags.add(processedTag)
                tagCounts.set(processedTag, (tagCounts.get(processedTag) || 0) + 1)
              }
            })
          }
        }
      } catch (error: unknown) {
        console.warn(`⚠️  处理文件 ${filePath} 时出错:`, error instanceof Error ? error.message : String(error))
      }
    }
    
    // 转换为数组并排序
    const tagList = Array.from(allTags).sort()
    
    // 生成标签统计信息
    const tagStats = tagList.map(tag => ({
      name: tag,
      count: tagCounts.get(tag) || 0
    })).sort((a, b) => b.count - a.count)
    
    // 计算更多统计信息
    const totalTagUsages = Array.from(tagCounts.values()).reduce((sum, count) => sum + count, 0)
    const averageTagsPerPost = totalTagUsages / mdxFiles.length
    const mostUsedTag = tagStats[0]
    const leastUsedTag = tagStats[tagStats.length - 1]
    
    // 创建输出目录
    const outputDir = path.join(process.cwd(), 'content')
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true })
    }
    
    // 生成 taglist.json
    const taglistData: TagListData = {
      tags: tagList,
      tagStats: JSON.stringify(tagStats), // 存储为 JSON 字符串
      generatedAt: new Date().toISOString(),
      totalTags: tagList.length,
      totalPosts: mdxFiles.length,
      totalTagUsages: totalTagUsages,
      averageTagsPerPost: Math.round(averageTagsPerPost * 100) / 100,
      mostUsedTag: mostUsedTag,
      leastUsedTag: leastUsedTag,
      // 按使用频率分类
      frequency: {
        high: tagStats.filter(stat => stat.count >= 5),
        medium: tagStats.filter(stat => stat.count >= 2 && stat.count < 5),
        low: tagStats.filter(stat => stat.count === 1)
      }
    }
    
    const outputPath = path.join(outputDir, 'taglist.json')
    fs.writeFileSync(outputPath, JSON.stringify(taglistData, null, 2))
    
    console.log('✅ 标签列表生成完成!')
    console.log(`📊 统计信息:`)
    console.log(`   - 总标签数: ${tagList.length}`)
    console.log(`   - 总文章数: ${mdxFiles.length}`)
    console.log(`   - 总标签使用次数: ${totalTagUsages}`)
    console.log(`   - 平均每篇文章标签数: ${averageTagsPerPost}`)
    console.log(`   - 输出文件: ${outputPath}`)
    
    // 显示频率分布
    console.log(`\n📈 标签使用频率分布:`)
    console.log(`   - 高频标签 (≥5次): ${taglistData.frequency.high.length} 个`)
    console.log(`   - 中频标签 (2-4次): ${taglistData.frequency.medium.length} 个`)
    console.log(`   - 低频标签 (1次): ${taglistData.frequency.low.length} 个`)
    
    // 显示最常用和最少用的标签
    console.log(`\n🏆 标签使用情况:`)
    console.log(`   - 最常用: ${mostUsedTag.name} (${mostUsedTag.count} 次)`)
    console.log(`   - 最少用: ${leastUsedTag.name} (${leastUsedTag.count} 次)`)
    
    // 显示最常用的标签
    console.log('\n🏷️  最常用标签 (前10个):')
    tagStats.slice(0, 10).forEach((tag, index) => {
      console.log(`   ${index + 1}. ${tag.name} (${tag.count} 次)`)
    })
    
  } catch (error) {
    console.error('❌ 生成标签列表时出错:', error)
    process.exit(1)
  }
}

// 运行脚本
generateTagList()
