# 国际化个人博客

一个使用 Next.js + Contentlayer + MDX + Tailwind CSS 构建的现代化多语言个人博客，支持自动翻译和 GitHub Pages 部署。

## ✨ 特性

- 🚀 **Next.js 15** - 最新的 React 全栈框架
- 📝 **Contentlayer** - 内容管理系统，支持 MDX
- 🎨 **Tailwind CSS** - 实用优先的 CSS 框架
- 📱 **响应式设计** - 支持移动端和深色模式
- ⚡ **静态站点生成** - 快速加载和 SEO 友好
- 🔧 **TypeScript** - 类型安全开发
- 📦 **路径别名** - 清晰的模块导入
- 🌍 **多语言支持** - 支持中文、英文、日文
- 🤖 **自动翻译** - 智能检测变更并自动翻译文章
- 🚀 **GitHub Pages** - 自动部署

## 🔧 环境要求

本项目需要以下环境支持：

| 工具        | 版本        | 说明                         |
| ----------- | ----------- | ---------------------------- |
| **Node.js** | `v20.18.0+` | JavaScript 运行时环境        |
| **npm**     | `v10.2.4+`  | Node.js 包管理器             |
| **pnpm**    | `v10.17.0+` | 快速、节省磁盘空间的包管理器 |

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
├── .github/
│   ├── workflows/        # GitHub Actions 工作流
│   │   └── deploy.yml    # 自动翻译和部署工作流
│   └── AUTO_TRANSLATE_SETUP.md # 自动翻译设置指南
├── content/              # 多语言内容目录
│   ├── zh/posts/         # 中文文章（源语言）
│   ├── en/posts/         # 英文文章（自动生成）
│   └── ja/posts/         # 日文文章（自动生成）
├── locales/              # 国际化文本
│   ├── zh/common.json    # 中文翻译
│   ├── en/common.json    # 英文翻译
│   └── ja/common.json    # 日文翻译
├── scripts/              # TypeScript 脚本
│   ├── translate-free.ts # 免费翻译脚本（Google Translate，支持代码块注释翻译）
│   └── README.md         # 脚本使用说明
├── public/               # 静态资源
├── src/
│   ├── app/              # Next.js App Router 页面
│   │   ├── [locale]/     # 多语言路由
│   │   │   ├── about/    # 关于页面
│   │   │   ├── posts/    # 博客页面
│   │   │   │   └── [slug]/ # 动态博客文章页面
│   │   │   ├── layout.tsx # 多语言布局
│   │   │   └── page.tsx  # 首页
│   │   ├── globals.css   # 全局样式
│   │   ├── layout.tsx    # 根布局
│   │   └── page.tsx      # 首页
│   ├── assets/           # 静态资源（图标等）
│   ├── components/       # React 组件
│   │   ├── Header/       # 头部组件（包含搜索、语言切换等）
│   │   ├── Footer.tsx    # 页脚组件
│   │   └── PostCard.tsx  # 博客卡片组件
│   ├── constants/        # 常量定义
│   ├── hooks/           # 自定义 React Hooks
│   ├── i18n/            # 国际化配置
│   │   ├── navigation.ts # 导航配置
│   │   ├── request.ts    # 请求配置
│   │   └── routing.ts    # 路由配置
│   ├── lib/             # 工具库
│   │   └── posts.ts     # 博客数据处理
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

| 别名             | 路径                 | 说明                    |
| ---------------- | -------------------- | ----------------------- |
| `@/*`            | `./src/*`            | 通用的 src 目录别名     |
| `@/components/*` | `./src/components/*` | 组件文件                |
| `@/lib/*`        | `./src/lib/*`        | 库文件和工具函数        |
| `@/app/*`        | `./src/app/*`        | Next.js App Router 页面 |
| `@/content/*`    | `./content/*`        | MDX 内容文件            |
| `@/types/*`      | `./src/types/*`      | TypeScript 类型定义     |
| `@/utils/*`      | `./src/utils/*`      | 工具函数                |
| `@/styles/*`     | `./src/styles/*`     | 样式文件                |
| `@/assets/*`     | `./src/assets/*`     | 静态资源                |
| `@/hooks/*`      | `./src/hooks/*`      | React 自定义 Hooks      |

### 使用示例

#### 导入组件

```typescript
// 使用别名
import Header from "@/components/Header";
import PostCard from "@/components/PostCard";

// 不使用别名（相对路径）
import Header from "../components/Header";
import PostCard from "../components/PostCard";
```

#### 导入工具函数

```typescript
// 使用别名
import { formatDate, truncateText } from "@/utils";

// 不使用别名
import { formatDate, truncateText } from "../utils";
```

#### 导入类型定义

```typescript
// 使用别名
import type { BlogPost, Tag } from "@/types";

// 不使用别名
import type { BlogPost, Tag } from "../types";
```

#### 导入资源文件

```typescript
// 使用别名
import { GitHubIcon, TwitterIcon } from "@/assets/icons";

// 不使用别名
import { GitHubIcon, TwitterIcon } from "../assets/icons";
```

### 路径别名的优势

1. **更清晰的导入路径** - 避免复杂的相对路径
2. **更好的可维护性** - 文件移动时不需要更新导入路径
3. **更简洁的代码** - 减少路径长度
4. **更好的 IDE 支持** - 自动补全和跳转功能
5. **团队协作友好** - 统一的导入风格

## 📝 添加新文章

### 方法一：创建中文文章（推荐）

1. 在 `content/zh/posts/` 目录下创建新的 `.mdx` 文件
2. 添加 frontmatter 元数据：
   ```yaml
   ---
   title: "文章标题"
   date: "2024-01-15"
   description: "文章描述"
   tags: ["标签1", "标签2"]
   published: true
   featured: false
   updatedAt: "2024-01-20"
   locale: "zh"
   ---
   ```
3. 编写文章内容
4. 提交到 Git 仓库
5. **自动翻译**：GitHub Actions 会自动翻译为英文和日文

### 方法二：手动创建多语言文章

在对应的语言目录下创建文章文件：

```
content/zh/posts/my-article.mdx
content/en/posts/my-article.mdx
content/ja/posts/my-article.mdx
```

### 文章 frontmatter 字段说明

| 字段           | 类型     | 必需 | 说明                        |
| -------------- | -------- | ---- | --------------------------- |
| `title`        | string   | ✅   | 文章标题                    |
| `date`         | string   | ✅   | 发布日期                    |
| `description`  | string   | ❌   | 文章描述                    |
| `tags`         | string[] | ❌   | 标签数组                    |
| `published`    | boolean  | ❌   | 是否发布（默认 true）       |
| `featured`     | boolean  | ❌   | 是否置顶（默认 false）      |
| `updatedAt`    | string   | ❌   | 更新时间                    |
| `locale`       | string   | ✅   | 文章语言（zh/en/ja）        |
| `originalSlug` | string   | ❌   | 原始 slug（用于跨语言链接） |

## 🚀 部署到 Vercel

项目已配置 GitHub Actions 自动翻译和 Vercel 部署：

### 自动部署流程

1. **推送代码**：将代码推送到 GitHub 仓库
2. **自动翻译**：每次推送文章到任何语言目录时自动翻译
3. **自动部署**：构建并部署到 Vercel

### 部署触发条件

- 推送到 `main`、`master` 或 `production` 分支
- 修改了 `content/zh/posts/`、`content/en/posts/` 或 `content/ja/posts/` 目录下的文件
- 修改了源代码文件（`src/`、`package.json`、配置文件等）

### Vercel 部署配置

#### 1. 在 Vercel 中创建项目

1. 访问 [Vercel Dashboard](https://vercel.com/dashboard)
2. 点击 "New Project"
3. 选择你的 GitHub 仓库
4. 配置项目设置：
   - **Framework Preset**: Next.js
   - **Root Directory**: `./` (根目录)
   - **Build Command**: `pnpm run contentlayer && pnpm run build`
   - **Output Directory**: `.next`

#### 2. 获取必要的 Secrets

在 Vercel 项目设置中获取以下信息，然后在 GitHub 仓库的 Settings > Secrets and variables > Actions 中添加：

**必需的 Secrets:**

- `VERCEL_TOKEN`: 在 Vercel 账户设置中生成
- `ORG_ID`: 在 Vercel 项目设置中找到
- `PROJECT_ID`: 在 Vercel 项目设置中找到
- `VERCEL_SCOPE`: 通常是你的用户名或组织名

#### 3. 配置步骤

**获取 VERCEL_TOKEN:**

1. 访问 [Vercel Tokens](https://vercel.com/account/tokens)
2. 点击 "Create Token"
3. 输入名称并选择适当的权限
4. 复制生成的 token

**获取 ORG_ID 和 PROJECT_ID:**

1. 在 Vercel 项目设置中
2. 查看 "General" 标签页
3. 找到 "Project ID" 和 "Team ID" (ORG_ID)

**获取 VERCEL_SCOPE:**

1. 在 Vercel 账户设置中
2. 查看你的用户名或组织名

#### 4. 添加 GitHub Secrets

在 GitHub 仓库中：

1. 进入 Settings > Secrets and variables > Actions
2. 点击 "New repository secret"
3. 添加以下 secrets:
   - `VERCEL_TOKEN`
   - `ORG_ID`
   - `PROJECT_ID`
   - `VERCEL_SCOPE`

### Vercel 部署优势

- ✅ 支持 Next.js middleware
- ✅ 支持国际化路由
- ✅ 自动部署
- ✅ 全球 CDN
- ✅ 自动 HTTPS
- ✅ 预览部署

### 本地预览部署版本

```bash
# 构建项目
pnpm run contentlayer
pnpm run build

# 启动生产服务器
pnpm start
```

## 🛠️ 自定义配置

### 基础配置

- **站点配置**: 通过后端数据库中的 site settings 维护
- **导航菜单**: 通过后端数据库中的 site navigation 维护
- **主题配置**: 调整 `tailwind.config.ts` 中的配置

### 国际化配置

- **支持语言**: 修改 `src/i18n/routing.ts` 中的语言配置
- **翻译文本**: 更新 `locales/` 目录下的翻译文件
- **翻译脚本**: 自定义 `scripts/` 目录下的翻译逻辑

### 翻译配置

- **代理配置**: 设置 `TRANSLATE_PROXY`、`HTTP_PROXY` 或 `HTTPS_PROXY` 环境变量（仅本地开发需要）
- **翻译质量**: 调整翻译脚本中的重试次数和延迟参数
- **代码块处理**: 脚本会自动识别代码块并只翻译注释，无需额外配置

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
- 语言路径是否正确（如 `/zh/posts/article`）

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

#### 5. 翻译问题

如果翻译功能不工作，检查：

- 文章是否在正确的语言目录下
- 文章格式是否正确（需要 frontmatter）
- GitHub Actions 权限是否正确配置
- 翻译脚本是否正确安装依赖

#### 6. 国际化问题

如果多语言功能不工作，检查：

- `locales/` 目录下是否有对应的翻译文件
- `src/i18n/` 配置是否正确
- 文章是否包含正确的 `locale` 字段

## 📚 学习资源

- [Next.js 文档](https://nextjs.org/docs) - 了解 Next.js 特性和 API
- [Contentlayer 文档](https://contentlayer.dev) - 内容管理系统
- [Tailwind CSS 文档](https://tailwindcss.com/docs) - CSS 框架
- [MDX 文档](https://mdxjs.com) - Markdown + JSX

## 🤝 贡献

欢迎提交 Issue 和 Pull Request 来改进这个项目！

## 🌍 国际化功能

### 多语言支持

本项目支持以下语言：

- 🇨🇳 **中文** (zh) - 默认语言
- 🇺🇸 **英文** (en) - 自动翻译
- 🇯🇵 **日文** (ja) - 自动翻译

### 路由结构

- `/zh/posts/welcome` - 中文文章
- `/en/posts/welcome` - 英文文章
- `/ja/posts/welcome` - 日文文章

### 文章目录结构

```
content/
├── zh/posts/          # 中文文章（源语言）
├── en/posts/          # 英文文章（自动生成）
└── ja/posts/          # 日文文章（自动生成）
```

### 文章 frontmatter 格式

```yaml
---
title: "文章标题"
date: 2024-01-15
description: "文章描述"
tags: ["标签1", "标签2"]
published: true
featured: false
updatedAt: 2024-01-20
locale: "zh" # 文章语言
originalSlug: "article-slug" # 原始 slug（用于跨语言链接）
---
```

## 🤖 自动翻译系统

### 智能翻译功能

项目集成了智能自动翻译系统，支持：

1. **自动检测变更** - 当您推送文章到任何语言目录时，自动检测变更
2. **智能翻译** - 自动将文章翻译到其他支持的语言
3. **自动提交** - 将翻译后的文章自动提交到仓库
4. **自动部署** - 构建并部署到 GitHub Pages

### 翻译逻辑

- **中文文章变更** → 自动翻译为英文和日文
- **英文文章变更** → 自动翻译为中文和日文
- **日文文章变更** → 自动翻译为中文和英文

### 使用方法

1. **创建中文文章**：

   ```bash
   # 在 content/zh/posts/ 目录下创建文章
   echo "---" > content/zh/posts/my-article.mdx
   echo "title: 我的文章" >> content/zh/posts/my-article.mdx
   echo "date: 2024-01-15" >> content/zh/posts/my-article.mdx
   echo "---" >> content/zh/posts/my-article.mdx
   echo "" >> content/zh/posts/my-article.mdx
   echo "这是文章内容..." >> content/zh/posts/my-article.mdx
   ```

2. **提交并推送**：

   ```bash
   git add content/zh/posts/my-article.mdx
   git commit -m "添加新文章"
   git push origin main
   ```

3. **自动翻译和部署**：
   - GitHub Actions 会自动检测到中文文章变更
   - 自动翻译为英文和日文
   - 自动提交翻译文件
   - 自动构建并部署到 GitHub Pages

## 📝 翻译脚本

### 免费翻译脚本（Google Translate）

项目使用 `translate-free.ts` 脚本进行自动翻译，该脚本具有以下特性：

- **免费使用**：基于 Google Translate API，无需 API 密钥
- **智能检测**：自动检测 Git 变更，只翻译新增或修改的文章
- **代码块保护**：自动识别代码块，只翻译注释部分，保留代码本身
- **内容哈希**：使用内容哈希检测文件变化，避免重复翻译
- **代理支持**：支持配置代理以访问 Google Translate

#### 使用方法

```bash
# 翻译所有中文文章
pnpm run translate -- --all

# 只翻译 Git 变更的文章（默认）
pnpm run translate
```

#### 脚本功能

- **代码块处理**：
  - 自动提取 Markdown 代码块（`language\ncode\n`）
  - 只翻译代码块中的注释（`//`, `#`, `/* */`, `<!-- -->`）
  - 保留所有代码语法和结构
- **智能更新**：通过内容哈希检测源文件变化，只更新需要更新的翻译文件
- **重试机制**：自动处理 API 限流和网络错误，带重试机制
- **分段翻译**：长文本自动分段翻译，避免超时

## 🚀 GitHub Actions 集成

### 自动翻译工作流

项目已配置 GitHub Actions 自动翻译和部署工作流：

- **触发条件**：推送文章到任何语言目录时自动触发
- **翻译逻辑**：智能检测变更语言，自动翻译到其他支持的语言
- **自动提交**：翻译完成后自动提交到仓库
- **自动部署**：构建并部署到 GitHub Pages

### 工作流文件

- `.github/workflows/deploy.yml` - 主要的翻译和部署工作流
- `.github/AUTO_TRANSLATE_SETUP.md` - 详细的设置指南

### 设置步骤

1. **启用 GitHub Pages**：
   - 进入仓库的 **Settings** 页面
   - 找到 **Pages** 部分
   - 在 **Source** 下选择 **GitHub Actions**

2. **配置权限**（已自动配置）：
   - `contents: write` - 用于提交翻译文件
   - `pages: write` - 用于部署到 GitHub Pages
   - `id-token: write` - 用于 GitHub Pages 部署

3. **配置代理**（可选，仅本地开发需要）：
   - 如果本地无法直接访问 Google Translate，可以设置代理：
   - 设置环境变量 `TRANSLATE_PROXY`、`HTTP_PROXY` 或 `HTTPS_PROXY`
   - CI/CD 环境中会自动跳过代理配置

## 🔧 自定义配置

### 添加新语言

1. 在 `scripts/translate-free.ts` 中添加新语言到 `TARGET_LOCALES`
2. 在 `normalizeLangCode` 函数中添加语言代码映射
3. 创建对应的内容目录（如 `content/新语言/posts/`）
4. 更新工作流文件以包含新语言

### 修改翻译逻辑

您可以修改翻译脚本来：

- 添加更多翻译映射
- 集成其他翻译服务
- 自定义翻译规则

## ⚠️ 注意事项

1. **翻译质量**：自动翻译可能不够完美，建议人工校对重要内容
2. **API 限制**：使用 OpenAI 时注意 API 使用限制
3. **文件覆盖**：翻译会覆盖目标语言目录中的同名文件
4. **提交历史**：翻译文件会自动提交，保持仓库历史清晰
5. **权限配置**：确保 GitHub Actions 有适当的权限

## 🔧 故障排除

### 常见问题

1. **翻译文件没有生成**：
   - 检查文章是否在正确的目录下
   - 检查文章格式是否正确（需要 frontmatter）

2. **部署失败**：
   - 检查 GitHub Pages 设置
   - 检查权限配置
   - 查看构建日志

3. **翻译质量不佳**：
   - 考虑使用 OpenAI 翻译
   - 手动编辑翻译文件
   - 更新翻译配置

## 📚 学习资源

- [Next.js 文档](https://nextjs.org/docs) - 了解 Next.js 特性和 API
- [Contentlayer 文档](https://contentlayer.dev) - 内容管理系统
- [Tailwind CSS 文档](https://tailwindcss.com/docs) - CSS 框架
- [MDX 文档](https://mdxjs.com) - Markdown + JSX
- [next-intl 文档](https://next-intl-docs.vercel.app) - 国际化解决方案

## 🤝 贡献

欢迎提交 Issue 和 Pull Request 来改进这个项目！

## 📄 许可证

MIT License
