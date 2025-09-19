# 个人博客

一个使用 Next.js + Contentlayer + MDX + Tailwind CSS 构建的现代化个人博客，支持 GitHub Pages 部署。

## ✨ 特性

- 🚀 **Next.js 15** - 最新的 React 全栈框架
- 📝 **Contentlayer** - 内容管理系统，支持 MDX
- 🎨 **Tailwind CSS** - 实用优先的 CSS 框架
- 📱 **响应式设计** - 支持移动端和深色模式
- ⚡ **静态站点生成** - 快速加载和 SEO 友好
- 🔧 **TypeScript** - 类型安全开发
- 📦 **路径别名** - 清晰的模块导入
- 🚀 **GitHub Pages** - 自动部署

## 🔧 环境要求

本项目需要以下环境支持：

| 工具 | 版本 | 说明 |
|------|------|------|
| **Node.js** | `v20.18.0+` | JavaScript 运行时环境 |
| **npm** | `v10.2.4+` | Node.js 包管理器 |
| **pnpm** | `v10.17.0+` | 快速、节省磁盘空间的包管理器 |

### 推荐使用 pnpm

本项目推荐使用 `pnpm` 作为包管理器，因为它：
- 🚀 安装速度更快
- 💾 节省磁盘空间
- 🔒 更严格的依赖管理

### 安装 pnpm

```bash
# 使用 npm 安装 pnpm
npm install -g pnpm

# 或使用 corepack（Node.js 16.13+）
corepack enable
corepack prepare pnpm@latest --activate
```

### 验证环境

运行以下命令验证环境是否正确配置：

```bash
# 检查 Node.js 版本
node --version
# 输出: v18.19.1

# 检查 npm 版本
npm --version
# 输出: 10.2.4

# 检查 pnpm 版本
pnpm --version
# 输出: 10.17.0
```

### 成功运行验证

当环境配置正确时，运行 `pnpm dev` 后应该看到类似以下的输出：

```
> blog@0.1.0 dev
> next dev
  ▲ Next.js 15.5.3
  - Local:        http://localhost:3000
  - Network:      http://192.168.31.137:3000
 ✓ Starting...
Contentlayer config change detected. Updating type definitions and data...
Generated 2 documents in .contentlayer
 ✓ Ready in 3.1s
```

访问以下链接验证功能：
- 首页：http://localhost:3000
- 文章列表：http://localhost:3000/posts
- 具体文章：http://localhost:3000/posts/welcome

## 🚀 快速开始

### 安装依赖

```bash
pnpm install
```

### 启动开发服务器

```bash
pnpm dev
```

在浏览器中打开 [http://localhost:3000](http://localhost:3000) 查看结果。

### 构建项目

```bash
pnpm build
```

### 导出静态文件

```bash
pnpm export
```

## 📁 项目结构

```
├── .github/workflows/     # GitHub Actions 工作流
├── content/posts/         # MDX 博客内容
├── public/               # 静态资源
├── src/
│   ├── app/              # Next.js App Router 页面
│   │   ├── about/        # 关于页面
│   │   ├── posts/        # 博客页面
│   │   │   └── [slug]/   # 动态博客文章页面
│   │   ├── globals.css   # 全局样式
│   │   ├── layout.tsx    # 根布局
│   │   └── page.tsx      # 首页
│   ├── assets/           # 静态资源（图标等）
│   ├── components/       # React 组件
│   │   ├── Header.tsx    # 头部组件
│   │   ├── Footer.tsx    # 页脚组件
│   │   └── PostCard.tsx  # 博客卡片组件
│   ├── constants/        # 常量定义
│   ├── hooks/           # 自定义 React Hooks
│   ├── lib/             # 工具库
│   │   └── posts.ts     # 博客数据处理
│   ├── styles/          # 样式文件
│   ├── types/           # TypeScript 类型定义
│   └── utils/           # 工具函数
├── .contentlayer/        # Contentlayer 生成的文件
├── contentlayer.config.ts # Contentlayer 配置
├── next.config.ts        # Next.js 配置
├── package.json          # 项目依赖
├── tsconfig.json         # TypeScript 配置
└── tailwind.config.ts    # Tailwind 配置
```

## 📦 路径别名配置

本项目配置了完整的路径别名系统，让模块导入更加清晰和便捷：

### 配置的别名

| 别名 | 路径 | 说明 |
|------|------|------|
| `@/*` | `./src/*` | 通用的 src 目录别名 |
| `@/components/*` | `./src/components/*` | 组件文件 |
| `@/lib/*` | `./src/lib/*` | 库文件和工具函数 |
| `@/app/*` | `./src/app/*` | Next.js App Router 页面 |
| `@/content/*` | `./content/*` | MDX 内容文件 |
| `@/types/*` | `./src/types/*` | TypeScript 类型定义 |
| `@/utils/*` | `./src/utils/*` | 工具函数 |
| `@/styles/*` | `./src/styles/*` | 样式文件 |
| `@/assets/*` | `./src/assets/*` | 静态资源 |
| `@/hooks/*` | `./src/hooks/*` | React 自定义 Hooks |
| `@/constants/*` | `./src/constants/*` | 常量定义 |

### 使用示例

#### 导入组件
```typescript
// 使用别名
import Header from '@/components/Header'
import PostCard from '@/components/PostCard'

// 不使用别名（相对路径）
import Header from '../components/Header'
import PostCard from '../components/PostCard'
```

#### 导入工具函数
```typescript
// 使用别名
import { formatDate, truncateText } from '@/utils'
import { SITE_CONFIG } from '@/constants'

// 不使用别名
import { formatDate, truncateText } from '../utils'
import { SITE_CONFIG } from '../constants'
```

#### 导入类型定义
```typescript
// 使用别名
import type { BlogPost, Tag } from '@/types'

// 不使用别名
import type { BlogPost, Tag } from '../types'
```

#### 导入资源文件
```typescript
// 使用别名
import { GitHubIcon, TwitterIcon } from '@/assets/icons'

// 不使用别名
import { GitHubIcon, TwitterIcon } from '../assets/icons'
```

### 路径别名的优势

1. **更清晰的导入路径** - 避免复杂的相对路径
2. **更好的可维护性** - 文件移动时不需要更新导入路径
3. **更简洁的代码** - 减少路径长度
4. **更好的 IDE 支持** - 自动补全和跳转功能
5. **团队协作友好** - 统一的导入风格

## 📝 添加新文章

1. 在 `content/posts/` 目录下创建新的 `.mdx` 文件
2. 添加 frontmatter 元数据：
   ```yaml
   ---
   title: "文章标题"
   date: "2024-01-15"
   description: "文章描述"
   tags: ["标签1", "标签2"]
   published: true
   ---
   ```
3. 编写文章内容
4. 提交到 Git 仓库

## 🚀 部署到 GitHub Pages

项目已配置 GitHub Actions 自动部署：

1. 将代码推送到 GitHub 仓库
2. 在仓库设置中启用 GitHub Pages
3. 每次推送代码到 `main` 分支时自动构建和部署

### 本地预览部署版本

```bash
pnpm build
pnpm export
```

## 🛠️ 自定义配置

- **站点配置**: 修改 `src/constants/index.ts` 中的 `SITE_CONFIG`
- **导航菜单**: 更新 `src/constants/index.ts` 中的 `NAVIGATION_ITEMS`
- **主题配置**: 调整 `tailwind.config.ts` 中的配置

## 🔧 故障排除

### 常见问题

#### 1. Contentlayer 警告
如果看到以下警告：
```
Contentlayer (Warning): Importing from `contentlayer/generated` might not work.
```

**解决方案**: 已在 `tsconfig.json` 中配置了路径别名，警告应该自动消失。

#### 2. 404 错误
如果文章页面返回 404 错误，检查：
- Contentlayer 是否正确生成了数据
- 文章 slug 是否与 URL 路径匹配

#### 3. 500 错误
如果出现 500 错误，尝试：
```bash
# 清理缓存
rm -rf .next .contentlayer

# 重新安装依赖
pnpm install

# 重新启动开发服务器
pnpm dev
```

#### 4. 静态导出问题
项目配置为开发模式使用普通 Next.js 服务器，生产模式使用静态导出。如果遇到静态导出相关错误，确保：
- 开发时使用 `pnpm dev`
- 生产构建使用 `pnpm build`

## 📚 学习资源

- [Next.js 文档](https://nextjs.org/docs) - 了解 Next.js 特性和 API
- [Contentlayer 文档](https://contentlayer.dev) - 内容管理系统
- [Tailwind CSS 文档](https://tailwindcss.com/docs) - CSS 框架
- [MDX 文档](https://mdxjs.com) - Markdown + JSX

## 🤝 贡献

欢迎提交 Issue 和 Pull Request 来改进这个项目！

## 📄 许可证

MIT License
