/**
 * 服务层统一导出
 */

export { setOn404, type On404Callback } from './http'

// GitHub 服务
export * from './github'

// 文章 API 服务端请求
export { getPostById } from './posts'
