# Card 组件

一个灵活的卡片容器组件，支持直角和圆角两种样式，以及自定义阴影和边框效果。

## 特性

- 🎨 **自定义阴影**: 支持6种阴影级别
- 🔲 **自定义边框**: 支持6种边框粗细
- 🔄 **圆角控制**: 支持直角和圆角两种样式
- 🎯 **TypeScript**: 完整的类型支持
- 🎨 **可定制**: 支持自定义类名和样式
- 📱 **响应式**: 适配不同屏幕尺寸

## 基础用法

```tsx
import { Card } from '@/ui'

// 基础直角卡片
<Card>这是卡片内容</Card>

// 圆角卡片
<Card rounded>这是圆角卡片</Card>
```

## 阴影效果

```tsx
// 无阴影（默认）
<Card>无阴影卡片</Card>

// 小阴影
<Card shadow="sm">小阴影卡片</Card>

// 中等阴影
<Card shadow="md">中等阴影卡片</Card>

// 大阴影
<Card shadow="lg">大阴影卡片</Card>

// 超大阴影
<Card shadow="xl">超大阴影卡片</Card>

// 最大阴影
<Card shadow="2xl">最大阴影卡片</Card>
```

## 边框效果

```tsx
// 无边框（默认）
<Card>无边框卡片</Card>

// 细边框
<Card border="sm">细边框卡片</Card>

// 中等边框
<Card border="md">中等边框卡片</Card>

// 粗边框
<Card border="lg">粗边框卡片</Card>

// 超粗边框
<Card border="xl">超粗边框卡片</Card>

// 最粗边框
<Card border="2xl">最粗边框卡片</Card>
```

## 圆角设置

```tsx
// 直角卡片（默认）
<Card>直角卡片</Card>

// 圆角卡片
<Card rounded>圆角卡片</Card>
```

## 组合使用

```tsx
// 圆角阴影卡片
<Card shadow="lg" rounded>
  <h3>标题</h3>
  <p>内容描述</p>
</Card>

// 带边框的圆角卡片
<Card border="sm" rounded>
  <div>卡片内容</div>
</Card>

// 完整的卡片效果
<Card shadow="md" border="sm" rounded>
  <h3>完整效果卡片</h3>
  <p>包含阴影、边框和圆角</p>
</Card>
```

## API

### CardProps

| 属性      | 类型                                              | 默认值   | 描述       |
| --------- | ------------------------------------------------- | -------- | ---------- |
| shadow    | `'none' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| '2xl'` | `'none'` | 阴影级别   |
| border    | `'none' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| '2xl'` | `'none'` | 边框粗细   |
| rounded   | `boolean`                                         | `false`  | 是否圆角   |
| className | `string`                                          | -        | 自定义类名 |
| children  | `ReactNode`                                       | -        | 子元素     |

### 阴影级别说明

- **none**: 无阴影
- **sm**: 小阴影 (shadow-sm)
- **md**: 中等阴影 (shadow-md)
- **lg**: 大阴影 (shadow-lg)
- **xl**: 超大阴影 (shadow-xl)
- **2xl**: 最大阴影 (shadow-2xl)

### 边框粗细说明

- **none**: 无边框
- **sm**: 细边框 (1px)
- **md**: 中等边框 (2px)
- **lg**: 粗边框 (4px)
- **xl**: 超粗边框 (8px)
- **2xl**: 最粗边框 (16px)

## 样式定制

```tsx
<Card
  shadow="lg"
  border="sm"
  rounded
  className="hover:shadow-xl transition-shadow"
>
  自定义样式的卡片
</Card>
```
