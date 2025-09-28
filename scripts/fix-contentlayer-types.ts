#!/usr/bin/env tsx

import fs from 'fs'
import path from 'path'

/**
 * 修复 Contentlayer 生成的类型文件中 formattedTags 的类型定义
 * 将 'formattedTags: list' 修正为 'formattedTags: string[]'
 */
function fixContentlayerTypes() {
  const typesFilePath = path.join(process.cwd(), '.contentlayer/generated/types.d.ts')
  
  try {
    // 检查文件是否存在
    if (!fs.existsSync(typesFilePath)) {
      console.log('⚠️  类型文件不存在，跳过修复')
      return
    }

    // 读取文件内容
    const content = fs.readFileSync(typesFilePath, 'utf-8')
    
    // 检查是否需要修复
    if (!content.includes('formattedTags: list')) {
      console.log('✅ 类型文件无需修复')
      return
    }

    // 执行修复
    const fixedContent = content.replace(
      /formattedTags:\s*list/g,
      'formattedTags: string[]'
    )

    // 写回文件
    fs.writeFileSync(typesFilePath, fixedContent, 'utf-8')
    
    console.log('✅ 已修复 Contentlayer 类型定义: formattedTags: list → formattedTags: string[]')
    
  } catch (error) {
    console.error('❌ 修复类型文件时出错:', error)
    process.exit(1)
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  fixContentlayerTypes()
}

export { fixContentlayerTypes }
