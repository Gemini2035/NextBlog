# UI 组件库

这个目录包含了项目中可复用的UI组件，设计时考虑了后期抽离为独立组件库的需求。

## 目录结构

```
src/ui/
├── Button/           # Button组件
│   ├── Button.tsx    # 主组件
│   ├── types.ts      # 类型定义
│   ├── styles.ts     # 样式配置
│   ├── index.ts      # 导出文件
│   ├── Button.stories.tsx  # Storybook故事
│   ├── Button.example.tsx  # 使用示例
│   └── README.md     # 组件文档
├── index.ts          # UI库入口文件
└── README.md         # 本文件
```

## 使用方式

### 直接导入组件

```tsx
import { Button } from "@/ui/Button";
```

### 从UI库入口导入

```tsx
import { Button } from "@/ui";
```

### 导入类型

```tsx
import type { ButtonProps, ButtonVariant } from "@/ui";
```

## 组件特性

- 🎨 **高度可定制**: 支持多种变体、尺寸和状态
- 📱 **响应式**: 支持全宽和自适应布局
- ♿ **无障碍**: 完整的键盘导航和屏幕阅读器支持
- 🎯 **TypeScript**: 完整的类型定义
- 📚 **文档完善**: 包含使用说明和API文档
- 🧪 **测试友好**: 支持Storybook和单元测试

## 设计原则

1. **模块化**: 每个组件都是独立的模块
2. **可复用**: 设计时考虑跨项目使用
3. **可扩展**: 易于自定义和扩展
4. **类型安全**: 完整的TypeScript支持
5. **文档完善**: 详细的使用说明和示例

## 添加新组件

当添加新的UI组件时，请遵循以下结构：

```
src/ui/NewComponent/
├── NewComponent.tsx    # 主组件
├── types.ts           # 类型定义
├── styles.ts          # 样式配置
├── index.ts          # 导出文件
├── NewComponent.stories.tsx  # Storybook故事
├── NewComponent.example.tsx  # 使用示例
└── README.md         # 组件文档
```

## 抽离为独立组件库

当需要将UI组件抽离为独立的组件库时：

1. **创建独立的包结构**
2. **配置package.json**
3. **设置构建工具**
4. **发布到npm**

详细的抽离步骤请参考各个组件的README文档。
