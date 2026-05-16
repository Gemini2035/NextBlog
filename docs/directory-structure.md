# Directory Structure

项目采用 monorepo 结构，前端和 Python 后端按应用边界拆分。

```txt
NextBlog/
├── apps/
│   ├── web/                  # Next.js 前端应用
│   │   ├── src/              # 页面、组件、hooks、前端服务层
│   │   ├── content/          # MDX 内容
│   │   ├── locales/          # 国际化文案
│   │   ├── public/           # 静态资源
│   │   └── package.json
│   │
│   └── api/                  # Python 后端应用
│       ├── app/
│       │   ├── main.py       # FastAPI 入口
│       │   ├── api/          # HTTP 路由
│       │   ├── core/         # 配置、环境变量、安全等基础能力
│       │   ├── integrations/ # GitHub、OpenAI 等第三方服务
│       │   ├── models/       # 数据库模型
│       │   ├── repositories/ # 数据访问层
│       │   ├── schemas/      # 请求/响应结构
│       │   └── services/     # 业务逻辑
│       ├── tests/
│       └── pyproject.toml
│
├── docs/                     # 架构和协作文档
├── package.json              # 仓库级脚本入口
├── pnpm-workspace.yaml       # Node workspace 配置
└── pnpm-lock.yaml
```

## 边界约定

- `apps/web` 只负责页面、交互、前端状态和展示层数据适配。
- `apps/api` 负责业务接口、数据库访问、鉴权、后台任务和第三方 API 集成。
- 当前 `apps/web/src/server` 是迁移前已有的 Next BFF 服务层，后续可逐步迁到 `apps/api/app/integrations`、`apps/api/app/services` 或 `apps/api/app/api`。
- 前端调用后端时，建议在 `apps/web/src/lib/api` 或 `apps/web/src/services` 统一封装请求。
