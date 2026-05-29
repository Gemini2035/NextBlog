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

- 浏览器侧接口默认请求 `/api`。
- 服务端请求可通过 `API_BASE_URL` 或 `NEXT_PUBLIC_API_BASE_URL` 指向外部后端。
- 本地开发时 `/api/*` 默认代理到 `https://admin.apodidae2035.com/api/*`，可用 `API_PROXY_TARGET` 覆盖。
