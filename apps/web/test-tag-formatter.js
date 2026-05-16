// 测试标签格式化功能
function normalizeTagName(tag) {
  if (!tag || typeof tag !== 'string') return ''
  
  // 去除首尾空格
  const trimmed = tag.trim()
  if (!trimmed) return ''
  
  // 分割并过滤空字符串，支持中英文、数字、连字符、下划线
  const parts = trimmed.split(/[^a-zA-Z0-9\u4e00-\u9fa5_-]+/).filter(Boolean)
  if (parts.length === 0) return ''
  
  return parts
    .map((p) => {
      // 如果是中文，直接返回
      if (/[\u4e00-\u9fa5]/.test(p)) return p
      // 如果是英文，首字母大写，其余小写
      return p.charAt(0).toUpperCase() + p.slice(1).toLowerCase()
    })
    .join('')
}

function formatTags(tags) {
  if (!Array.isArray(tags)) return []
  
  return tags
    .map(tag => normalizeTagName(tag))
    .filter(tag => tag.length > 0)
    .filter((tag, index, arr) => arr.indexOf(tag) === index) // 去重
    .sort() // 排序
}

// 测试用例
const testCases = [
  {
    input: ['javascript', 'React', 'next.js', '  nodejs  ', ''],
    expected: ['Javascript', 'Next.js', 'Nodejs', 'React']
  },
  {
    input: ['前端开发', 'React', '前端开发', '  '],
    expected: ['React', '前端开发']
  },
  {
    input: ['web-development', 'Web Development', 'web_development'],
    expected: ['Web-Development']
  },
  {
    input: ['AI/ML', 'ai-ml', 'AI_ML'],
    expected: ['Ai-Ml']
  },
  {
    input: ['TypeScript', 'typescript', 'TypeScript'],
    expected: ['Typescript']
  }
]

console.log('🧪 测试标签格式化功能...\n')

testCases.forEach((testCase, index) => {
  const result = formatTags(testCase.input)
  const passed = JSON.stringify(result) === JSON.stringify(testCase.expected)
  
  console.log(`测试 ${index + 1}: ${passed ? '✅ 通过' : '❌ 失败'}`)
  console.log(`  输入: ${JSON.stringify(testCase.input)}`)
  console.log(`  期望: ${JSON.stringify(testCase.expected)}`)
  console.log(`  实际: ${JSON.stringify(result)}`)
  console.log('')
})

console.log('🎉 标签格式化功能测试完成！')
