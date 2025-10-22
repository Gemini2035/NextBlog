## Tree 组件

一个用于展示层级结构的树形组件，参考 antd 的交互，已适配本项目的样式与约定。

### 特性

- 展开/收起父子节点
- 节点与子列表淡入交错动画（framer-motion）
- 点击携带 `href` 的节点触发 `onSelect`
- 轻量实现，样式由 Tailwind 原子类与 `clsx` 组合

### 安装

```tsx
import { Tree } from "@/ui";
```

### 基础用法

```tsx
"use client";

import { Tree } from "@/ui";

const data = [
  {
    key: "__blog",
    title: "博客",
    children: [
      { key: "/posts", title: "所有文章", href: "/posts" },
      { key: "/tags", title: "标签", href: "/tags" },
    ],
  },
  { key: "__about", title: "关于", href: "/about" },
];

export default function Demo() {
  return (
    <Tree
      data={data}
      defaultExpandedKeys={["__blog"]}
      onSelect={(key) => console.log("select", key)}
    />
  );
}
```

### API 参考

#### TreeProps

| 属性                | 类型                       | 默认值 | 描述                    |
| ------------------- | -------------------------- | ------ | ----------------------- |
| data                | `TreeNode[]`               | -      | 树数据                  |
| expandedKeys        | `string[]`                 | -      | 受控：展开的 keys       |
| defaultExpandedKeys | `string[]`                 | -      | 非受控：默认展开的 keys |
| onExpand            | `(keys: string[]) => void` | -      | 展开变化回调            |
| onSelect            | `(key: string) => void`    | -      | 选择节点回调            |

#### TreeNode

```ts
interface TreeNode {
  key: string;
  title: ReactNode;
  href?: string; // 提供 href 视为可点击
  children?: TreeNode[];
}
```

### 无障碍与交互

- Chevron 按钮用于展开/收起
- 子列表包含高度与透明度过渡（120~180ms）
- 如需键盘导航（方向键、回车）可在后续迭代增强

### 样式

- 组件位于 `src/ui/Tree/`，遵循 UI 目录使用 `clsx` 的约定
- 外层可通过 `className` 自定义间距与容器样式

### 在移动端 Drawer 中的使用

- `MobileNav` 已集成 `Tree` 展示导航树
- 打开 Drawer 时会自动关闭 Header 的搜索/语言 submenu，避免堆叠
