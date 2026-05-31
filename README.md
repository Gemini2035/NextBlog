# NextBlog

NextBlog 是一个基于 Next.js 的前端项目。后端服务已从当前仓库拆出，前端仍通过原有 API 契约访问外部后端。

## 常用命令

```bash
pnpm dev       # 启动前端开发服务
pnpm build     # 构建前端
pnpm lint      # 检查前端代码
pnpm check     # 运行 lint 和 TypeScript 检查
pnpm api:types # 从外部后端 OpenAPI 生成接口类型
```

## API 配置

- 浏览器侧和服务端接口固定请求当前域名下的 `/api`。
- `/api/*` 会通过 Next 代理到 `https://${NEXT_API_PROXY_TAGET}api/*`。
