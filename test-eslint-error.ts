// 这个文件故意包含 ESLint 错误来测试 pre-commit 钩子
const unusedVariable = 'test'
let reassignedVariable = 'test'
reassignedVariable = 'changed'

export function testFunction() {
  console.log('This function has no return type annotation')
  return 'test'
}
