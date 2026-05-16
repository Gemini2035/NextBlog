# NextBlog

NextBlog 现在采用 monorepo 结构，前端和后端按应用边界拆分。

```txt
apps/
├── web/   # Next.js 前端应用
└── api/   # Python 后端应用
```

## 常用命令

```bash
pnpm dev       # 启动前端开发服务
pnpm build     # 构建前端
pnpm lint      # 检查前端代码
pnpm api:dev   # 启动 Python API
```

前端项目文档见 `apps/web/README.md`，后端项目文档见 `apps/api/README.md`。
