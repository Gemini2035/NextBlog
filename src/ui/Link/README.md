# UI 组件库

## Link 组件

智能的链接组件，根据 external 属性判断使用 NextLink 还是 next-intl Link。

### 特性

- **明确控制**：通过 external 属性明确指定链接类型
- **国际化支持**：内部链接自动支持多语言路由
- **外部链接支持**：外部链接使用 NextLink（标准 Next.js 链接）
- **默认样式**：自动应用 `text-inherit no-underline` 保持文字原颜色
- **clsx 管理**：使用 clsx 库管理 className，支持条件样式
- **类型安全**：完整的 TypeScript 类型支持
- **API 兼容**：与 Next.js Link 和 next-intl Link API 兼容

### 判断规则

| external 值    | 使用的组件     | 说明                        |
| -------------- | -------------- | --------------------------- |
| `false` (默认) | next-intl Link | 内部链接，支持国际化        |
| `true`         | NextLink       | 外部链接，标准 Next.js 链接 |

### 使用方法

#### 基础用法

```tsx
import { Link } from '@/ui'

// 内部链接（默认，支持国际化，保持文字原颜色）
<Link href="/posts">查看文章</Link>

// 外部链接（明确指定 external=true，使用 NextLink）
<Link href="https://github.com" external target="_blank">GitHub</Link>
```

#### 高级用法

```tsx
import { Link } from '@/ui'

// 带样式的内部链接
<Link
  href="/posts"
  className="text-blue-600 hover:text-blue-800 underline"
>
  查看文章
</Link>

// 外部链接（带安全属性）
<Link
  href="https://github.com"
  external
  target="_blank"
  rel="noopener noreferrer"
  className="text-blue-600 hover:text-blue-800"
>
  GitHub
</Link>

// 邮件链接
<Link href="mailto:contact@example.com" external>联系我们</Link>

// 锚点链接
<Link href="#top" external>回到顶部</Link>
```

### API 参考

#### LinkProps

```typescript
interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string; // 链接地址
  children: React.ReactNode; // 链接内容
  className?: string; // CSS 类名
  target?: string; // 链接目标（仅外部链接）
  rel?: string; // 链接关系（仅外部链接）
  external?: boolean; // 是否为外部链接，默认为 false
}
```

### 迁移指南

#### 从 Next.js Link 迁移

```tsx
// 之前
import Link from "next/link";
<Link href="/posts">查看文章</Link>;

// 之后
import { Link } from "@/ui";
<Link href="/posts">查看文章</Link>;
```

#### 从 next-intl Link 迁移

```tsx
// 之前
import { Link } from "@/i18n/navigation";
<Link href="/posts">查看文章</Link>;

// 之后
import { Link } from "@/ui";
<Link href="/posts">查看文章</Link>;
```

### 注意事项

1. **内部链接**：默认行为，会自动添加语言前缀，支持国际化
2. **外部链接**：需要明确设置 `external={true}`，使用 NextLink
3. **默认样式**：自动应用 `text-inherit no-underline` 保持文字原颜色，避免默认蓝色
4. **clsx 管理**：使用 clsx 库管理 className，支持条件样式和更好的性能
5. **性能**：所有链接都享受 Next.js 的预加载和客户端路由
6. **SEO**：所有链接都使用 Next.js Link，有利于 SEO
7. **明确性**：通过 `external` 属性明确控制链接行为，避免自动判断的复杂性

### 示例

查看 `Link.example.tsx` 文件获取更多使用示例。
