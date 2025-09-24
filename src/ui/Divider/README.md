# Divider 分割线组件

一个灵活可配置的分割线组件，支持方向、粗细、圆角、颜色等多种样式配置。

## 功能特性

- 🎯 **方向控制**: 支持水平和垂直方向
- 📏 **粗细调节**: 提供 4 种粗细选项
- 🔄 **圆角样式**: 支持 5 种圆角配置
- 🎨 **颜色自定义**: 支持自定义颜色
- 📝 **虚线样式**: 支持实线和虚线
- 📐 **长度控制**: 支持自定义长度（仅水平分割线）

## 基础用法

```tsx
import { Divider } from "@/ui";

// 基础分割线
<Divider />;
```

## 方向控制

```tsx
// 水平分割线（默认）
<Divider orientation="horizontal" />

// 垂直分割线
<Divider orientation="vertical" />
```

## 粗细控制

```tsx
// 细线 (1px)
<Divider thickness="thin" />

// 中等 (2px) - 默认
<Divider thickness="medium" />

// 粗线 (4px)
<Divider thickness="thick" />

// 超粗 (6px)
<Divider thickness="extra-thick" />
```

## 圆角样式

```tsx
// 无圆角（默认）
<Divider rounded={false} />

// 圆角
<Divider rounded={true} />
```

## 颜色自定义

```tsx
// 使用十六进制颜色
<Divider color="#ff0000" />

// 使用 Tailwind 颜色类
<Divider color="bg-blue-500" />

// 使用 CSS 变量
<Divider color="var(--primary-color)" />
```

## 虚线样式

```tsx
// 实线（默认）
<Divider />

// 虚线
<Divider dashed />
```

## 长度控制

```tsx
// 50% 长度
<Divider length={50} />

// 80% 长度
<Divider length={80} />
```

## 组合使用

```tsx
// 自定义样式的分割线
<Divider
  orientation="horizontal"
  thickness="thick"
  rounded={true}
  color="#3b82f6"
  dashed
  length={80}
/>
```

## API 参考

### DividerProps

| 属性        | 类型                                             | 默认值         | 描述                                   |
| ----------- | ------------------------------------------------ | -------------- | -------------------------------------- |
| orientation | `'horizontal' \| 'vertical'`                     | `'horizontal'` | 分割线方向                             |
| thickness   | `'thin' \| 'medium' \| 'thick' \| 'extra-thick'` | `'medium'`     | 分割线粗细                             |
| rounded     | `boolean`                                        | `false`        | 分割线圆角                             |
| color       | `string`                                         | -              | 分割线颜色                             |
| dashed      | `boolean`                                        | `false`        | 是否显示为虚线                         |
| length      | `number`                                         | -              | 分割线长度（百分比，仅水平分割线有效） |
| className   | `string`                                         | -              | 自定义类名                             |

### 类型定义

```tsx
type DividerOrientation = "horizontal" | "vertical";
type DividerThickness = "thin" | "medium" | "thick" | "extra-thick";
```

## 使用场景

- 内容区域分割
- 列表项分隔
- 表单字段分组
- 侧边栏分割
- 卡片内容分割

## 注意事项

1. **垂直分割线**: 需要父容器有明确的高度
2. **长度控制**: 仅对水平分割线有效
3. **颜色格式**: 支持十六进制、Tailwind 类名、CSS 变量等格式
4. **响应式**: 组件支持响应式设计，可根据屏幕尺寸调整
