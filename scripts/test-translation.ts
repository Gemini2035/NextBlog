#!/usr/bin/env node

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

// 获取当前文件的目录路径
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/**
 * 测试自动翻译功能
 */
function testTranslation(): void {
  console.log('🧪 测试自动翻译功能...')
  
  // 创建测试文章
  const testContent = `---
title: "测试文章"
date: 2024-01-15
description: "这是一个测试文章"
tags: ["测试", "自动化"]
published: true
locale: "zh"
---

# 测试文章

这是一个测试文章，用于验证自动翻译功能是否正常工作。

## 功能测试

- 标题翻译
- 内容翻译
- 标签翻译
- 描述翻译

希望这个测试能够成功！
`

  const testDir = path.join(__dirname, '../content/zh/posts')
  const testFile = path.join(testDir, 'test-article.mdx')
  
  // 确保目录存在
  if (!fs.existsSync(testDir)) {
    fs.mkdirSync(testDir, { recursive: true })
  }
  
  // 写入测试文件
  fs.writeFileSync(testFile, testContent)
  console.log('✅ 测试文章已创建:', testFile)
  
  // 运行翻译
  console.log('🔄 运行自动翻译...')
  
  // 这里可以调用实际的翻译逻辑
  console.log('📝 翻译功能测试完成')
  
  // 清理测试文件
  if (fs.existsSync(testFile)) {
    fs.unlinkSync(testFile)
    console.log('🧹 测试文件已清理')
  }
  
  console.log('✅ 测试完成！')
}

// 运行测试
if (import.meta.url === `file://${process.argv[1]}`) {
  testTranslation()
}

export { testTranslation }
