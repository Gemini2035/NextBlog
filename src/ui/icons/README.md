# 图标库 (Icons Library)

这是一个统一的图标库，包含了项目中所有UI组件使用的图标。所有图标都经过优化，支持自定义尺寸和样式。

## 使用方式

### 基本用法

```tsx
// 在UI组件库内部使用（推荐）
import { CloseIcon, LoadingIcon } from '../icons';

// 在项目外部使用（通过@ui路径）
import { CloseIcon, LoadingIcon } from '@/ui/icons';

// 基础使用
<CloseIcon />

// 自定义尺寸
<CloseIcon size={16} />

// 自定义样式
<CloseIcon className="text-red-500 hover:text-red-700" />

// 自定义属性
<LoadingIcon size={20} className="animate-spin text-blue-500" />
```

### 可用的图标

| 图标名称 | 组件名             | 默认尺寸 | 用途               |
| -------- | ------------------ | -------- | ------------------ |
| 关闭     | `CloseIcon`        | 12px     | 关闭按钮、标签删除 |
| 加载     | `LoadingIcon`      | 16px     | 按钮加载状态       |
| 左箭头   | `ChevronLeftIcon`  | 20px     | 轮播组件导航       |
| 右箭头   | `ChevronRightIcon` | 20px     | 轮播组件导航       |
| 上一页   | `PrevIcon`         | 12px     | 分页组件           |
| 下一页   | `NextIcon`         | 12px     | 分页组件           |
| 首页     | `FirstIcon`        | 12px     | 分页组件           |
| 末页     | `LastIcon`         | 12px     | 分页组件           |
| 向前跳转 | `JumpPrevIcon`     | 12px     | 分页组件           |
| 向后跳转 | `JumpNextIcon`     | 12px     | 分页组件           |

### 图标属性

所有图标都支持以下属性：

```tsx
interface IconProps extends SVGProps<SVGSVGElement> {
  size?: number | string; // 图标尺寸，默认见上表
  className?: string; // 自定义CSS类名
}
```

### 在UI组件中使用

图标库已经被集成到以下UI组件中：

- **Button**: 使用 `LoadingIcon` 显示加载状态
- **Tag**: 使用 `CloseIcon` 作为删除图标
- **Pagination**: 使用分页相关图标 (`PrevIcon`, `NextIcon`, `FirstIcon`, `LastIcon`, `JumpPrevIcon`, `JumpNextIcon`)
- **Slider**: 使用 `ChevronLeftIcon` 和 `ChevronRightIcon` 作为导航箭头

### 添加新图标

当需要添加新图标时，请遵循以下步骤：

1. 在 `src/ui/icons/` 目录下创建新的图标组件文件
2. 使用 `IconProps` 类型定义图标属性
3. 在 `src/ui/icons/index.ts` 中导出新图标
4. 更新本README文档

#### 图标组件模板

```tsx
import React from "react";
import { IconProps } from "./types";

export const NewIcon: React.FC<IconProps> = ({
  size = 16,
  className = "",
  ...props
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    {...props}
  >
    {/* SVG路径 */}
  </svg>
);

export default NewIcon;
```

## 设计原则

1. **统一性**: 所有图标使用相同的接口和命名规范
2. **可定制性**: 支持自定义尺寸、颜色和样式
3. **可访问性**: 所有图标都支持无障碍属性
4. **性能优化**: 使用SVG格式，支持按需加载
5. **类型安全**: 完整的TypeScript类型定义

## 最佳实践

1. **尺寸一致性**: 在同一界面中保持相同功能的图标尺寸一致
2. **颜色继承**: 图标默认继承父元素的颜色，使用 `currentColor`
3. **动画支持**: 为需要动画的图标添加适当的CSS类（如 `animate-spin`）
4. **语义化**: 选择语义明确的图标名称，便于理解和维护

## 注意事项

- 所有图标都使用 `currentColor` 作为填充色，会继承父元素的文本颜色
- 图标尺寸可以通过 `size` 属性或 `className` 中的 `w-*` 和 `h-*` 类来控制
- 建议使用 Tailwind CSS 类名来控制图标样式
- 图标支持所有标准的SVG属性，如 `onClick`、`onMouseOver` 等事件处理器
