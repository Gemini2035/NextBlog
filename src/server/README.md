# Server 服务层

## 📋 概述

`server` 文件夹统一存放服务端业务逻辑：对外请求（如 GitHub GraphQL）、以及 BFF 的 GraphQL 能力（博客 Post 等），通过 `index.ts` 统一导出。

---

## 📁 目录结构

```
server/
├── github/                  # GitHub GraphQL 服务
│   ├── client.ts            # GitHub GraphQL 客户端
│   ├── queries/             # GraphQL 查询定义
│   ├── operations/          # 封装好的操作（仓库列表、详情、RateLimit）
│   ├── transformers/        # 数据转换（仓库、统计）
│   ├── types/               # GraphQL 与业务类型
│   └── index.ts             # 统一导出
│
├── graphql/                  # BFF GraphQL（博客等）
│   ├── schema.ts            # 类型定义（Post、Query）
│   ├── resolvers/           # 解析器
│   │   ├── posts.ts         # post、relatedPosts
│   │   └── index.ts
│   └── index.ts             # 导出 schema 供 /api/graphql 使用
│
├── index.ts                  # 统一导出：export * from github; export { schema } from graphql
└── README.md
```

---

## 🎯 设计原则

### 1. 职责分离

每个服务模块负责特定的业务领域：

- **API 层** - 处理外部 API 调用
- **Processor 层** - 处理数据转换和业务逻辑
- **Types 层** - 类型定义

### 2. 统一导出

每个服务模块通过 `index.ts` 统一导出：

```typescript
// services/github/index.ts
export { githubApiService } from "./api";
export * from "./processor";
export type * from "./types";
```

### 3. 易于测试

服务层代码独立于 UI，便于单元测试。

---

## 📦 GitHub 服务

### 使用方式

#### 导入服务

```typescript
// 推荐：从服务层导入
import { githubApiService } from "@/services/github/api";
import { processRepositories } from "@/services/github/processor";

// 或者从统一入口导入
import { githubApiService, processRepositories } from "@/services/github";
```

#### API 调用

```typescript
// 获取用户仓库
const repos = await githubApiService.getAllUserRepositories("username");

// 获取仓库语言
const languages = await githubApiService.getRepositoryLanguages(
  "owner",
  "repo",
);

// 获取贡献者
const contributors = await githubApiService.getRepositoryContributors(
  "owner",
  "repo",
);
```

#### 数据处理

```typescript
import { processRepositories, generateProjectStats } from "@/services/github";

// 处理仓库数据
const processed = processRepositories(rawRepos);

// 生成统计信息
const stats = generateProjectStats(processed);
```

---

## 🔧 创建新服务

### 步骤 1: 创建服务目录

```bash
mkdir -p src/services/my-service
```

### 步骤 2: 创建文件

```
my-service/
├── api.ts           # API 调用逻辑
├── processor.ts     # 数据处理逻辑
├── types.ts         # 类型定义
└── index.ts         # 统一导出
```

### 步骤 3: 实现服务

```typescript
// api.ts
export class MyApiService {
  async getData() {
    // API 调用逻辑
  }
}

export const myApiService = new MyApiService();
```

```typescript
// processor.ts
export function processData(data: any) {
  // 数据处理逻辑
}
```

```typescript
// index.ts
export { myApiService } from "./api";
export * from "./processor";
export type * from "./types";
```

### 步骤 4: 使用服务

```typescript
import { myApiService, processData } from "@/services/my-service";

const data = await myApiService.getData();
const processed = processData(data);
```

---

## 🎨 最佳实践

### 1. 服务应该是无状态的

```typescript
// ✅ 推荐：纯函数，无副作用
export function processData(data: any) {
  return data.map((item) => transform(item));
}

// ❌ 避免：维护内部状态
let cache = {};
export function processData(data: any) {
  cache[data.id] = data; // 有状态
}
```

### 2. 使用依赖注入

```typescript
// ✅ 推荐：可配置的服务
export class ApiService {
  constructor(private config: Config) {}

  async getData() {
    return fetch(this.config.apiUrl);
  }
}

// ❌ 避免：硬编码配置
export class ApiService {
  async getData() {
    return fetch("https://hardcoded-url.com");
  }
}
```

### 3. 统一的错误处理

```typescript
// ✅ 推荐：统一错误格式
export class ApiService {
  async getData() {
    try {
      return { success: true, data: await fetch() };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}
```

### 4. 类型安全

```typescript
// ✅ 推荐：明确的类型定义
export async function getData(): Promise<ApiResponse<UserData>> {
  // ...
}

// ❌ 避免：any 类型
export async function getData(): Promise<any> {
  // ...
}
```

---

## 📊 服务层架构

```
┌─────────────────┐
│  UI Components  │  使用服务
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│ Server Actions  │  调用服务
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│   Services      │  业务逻辑
│  - API         │
│  - Processor   │
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│  External APIs  │  外部服务
└─────────────────┘
```

---

## 🔍 与其他层的关系

### Services vs Actions

- **Services**: 纯业务逻辑，可在任何地方使用
- **Actions**: Server Actions，专门用于客户端到服务端的通信

```typescript
// Server Action 调用 Service
"use server";
import { githubApiService } from "@/services/github";

export async function getRepos() {
  return await githubApiService.getAllUserRepositories("user");
}
```

### Services vs Lib

- **Services**: 业务服务层，面向特定业务需求
- **Lib**: 工具库，通用的辅助函数

```typescript
// Service (业务相关)
export async function getGitHubRepos() {}

// Lib (通用工具)
export function formatDate(date: Date) {}
```

---

## 📝 命名规范

### 文件命名

- `api.ts` - API 调用相关
- `processor.ts` - 数据处理相关
- `types.ts` - 类型定义
- `index.ts` - 统一导出

### 变量命名

- 服务实例：`xxxService` (如 `githubApiService`)
- 处理函数：`processXxx` (如 `processRepositories`)
- 工具函数：`xxxXxx` (如 `generateProjectStats`)

---

## 🧪 测试

### 单元测试示例

```typescript
// services/github/__tests__/processor.test.ts
import { processRepositories } from "../processor";

describe("processRepositories", () => {
  it("should process repos correctly", () => {
    const rawRepos = [
      /* mock data */
    ];
    const result = processRepositories(rawRepos);

    expect(result).toHaveLength(1);
    expect(result[0].name).toBe("test-repo");
  });
});
```

---

## 📚 参考资源

- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Service Layer Pattern](https://martinfowler.com/eaaCatalog/serviceLayer.html)

---

_最后更新时间：2025年10月7日_
