# EmptyState 空状态组件

空状态组件用于展示没有数据时的情况，提供友好的用户体验。

## 功能特性

- 🎨 多种预设图标类型
- 📏 三种尺寸：`sm`、`md`、`lg`
- 🎭 三种变体：`default`、`minimal`、`card`
- 🌍 完整的国际化支持
- 🎯 支持自定义图标
- 🔧 灵活的操作按钮配置

## 基础用法

```tsx
import { EmptyState } from "@/ui";

// 基础用法
<EmptyState
  icon="search"
  title="No results found"
  description="Try searching with different keywords"
/>;
```

## 带操作按钮

```tsx
<EmptyState
  icon="folder"
  title="No files found"
  description="Upload your first file to get started"
  action={<Button>Upload File</Button>}
/>
```

## 不同尺寸和变体

```tsx
// 大尺寸卡片样式
<EmptyState
  size="lg"
  variant="card"
  icon="users"
  title="No users found"
  description="Create your first user account"
  action={<Button>Create User</Button>}
/>

// 最小化样式
<EmptyState
  variant="minimal"
  icon="document"
  title="No documents"
  description="Start creating your first document"
/>
```

## 自定义图标

```tsx
<EmptyState
  icon={<CustomIcon />}
  title="Custom empty state"
  description="With custom icon"
/>
```

## 国际化使用

```tsx
import { useTranslations } from "next-intl";

function MyComponent() {
  const t = useTranslations("EmptyState");

  return (
    <EmptyState
      icon="search"
      title={t("noResults")}
      description={t("noResultsDescription")}
    />
  );
}
```

## API 参考

### EmptyStateProps

| 属性        | 类型                              | 默认值      | 描述                 |
| ----------- | --------------------------------- | ----------- | -------------------- |
| icon        | `EmptyStateIconType \| ReactNode` | `'search'`  | 图标类型或自定义图标 |
| title       | `string`                          | -           | 标题文本             |
| description | `string`                          | -           | 描述文本             |
| action      | `ReactNode`                       | -           | 操作按钮             |
| size        | `EmptyStateSize`                  | `'md'`      | 组件尺寸             |
| variant     | `EmptyStateVariant`               | `'default'` | 组件变体             |
| showIcon    | `boolean`                         | `true`      | 是否显示图标         |
| className   | `string`                          | -           | 自定义类名           |
| style       | `React.CSSProperties`             | -           | 自定义样式           |

### EmptyStateSize

- `sm`: 小尺寸
- `md`: 中等尺寸（默认）
- `lg`: 大尺寸

### EmptyStateVariant

- `default`: 默认样式，带背景色
- `minimal`: 最小化样式，透明背景
- `card`: 卡片样式，带边框和阴影

### EmptyStateIconType

- `search`: 搜索图标
- `folder`: 文件夹图标
- `document`: 文档图标
- `users`: 用户图标
- `settings`: 设置图标
- `warning`: 警告图标
- `info`: 信息图标
- `success`: 成功图标
- `error`: 错误图标

## 国际化键值

组件支持以下国际化键值：

```json
{
  "EmptyState": {
    "noData": "No data available",
    "noDataDescription": "There is no data to display at the moment",
    "noResults": "No results found",
    "noResultsDescription": "Try adjusting your search criteria",
    "noPosts": "No posts found",
    "noPostsDescription": "No blog posts match your current filters",
    "noFiles": "No files found",
    "noFilesDescription": "No files match your search criteria",
    "noUsers": "No users found",
    "noUsersDescription": "No users match your search criteria",
    "emptyFolder": "Empty folder",
    "emptyFolderDescription": "This folder is empty",
    "error": "Something went wrong",
    "errorDescription": "An error occurred while loading the data",
    "loading": "Loading...",
    "loadingDescription": "Please wait while we load the data"
  }
}
```

## 样式定制

组件使用 Tailwind CSS 构建，支持通过 `className` 属性进行样式定制：

```tsx
<EmptyState
  className="bg-blue-50 border-blue-200"
  icon="info"
  title="Custom styled"
  description="With custom background"
/>
```

## 最佳实践

1. **选择合适的图标**：根据上下文选择最合适的图标类型
2. **提供有用的描述**：描述应该帮助用户理解当前状态和下一步操作
3. **添加操作按钮**：当有明确的下一步操作时，提供相应的按钮
4. **使用国际化**：确保所有文本都支持多语言
5. **保持一致性**：在整个应用中使用一致的空状态样式
