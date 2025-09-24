# Button 组件 - 简化版

一个精简的按钮组件，仅保留基本功能，专为简单项目使用而设计。

## 特性

- 🎨 **6种变体**: primary, secondary, outline, ghost, link, danger
- 📏 **5种尺寸**: xs, sm, md, lg, xl
- 🔄 **圆角设置**: 支持方框和圆角两种样式
- 🔄 **加载状态**: 内置加载动画
- 🎯 **简洁设计**: 移除了复杂功能，专注于核心需求
- 📱 **响应式**: 支持基础响应式布局
- ♿ **无障碍**: 完整的键盘导航支持

## 安装

```tsx
import { Button } from "@/ui/Button";
```

## 基础用法

```tsx
// 基础按钮
<Button>点击我</Button>

// 不同变体
<Button type="primary">主要按钮</Button>
<Button type="secondary">次要按钮</Button>
<Button type="outline">轮廓按钮</Button>
<Button type="ghost">幽灵按钮</Button>
<Button type="link">链接按钮</Button>
<Button type="danger">危险按钮</Button>
```

## 尺寸

```tsx
<Button size="xs">超小按钮</Button>
<Button size="sm">小按钮</Button>
<Button size="md">中等按钮</Button>
<Button size="lg">大按钮</Button>
<Button size="xl">超大按钮</Button>
```

## 圆角设置

```tsx
<Button rounded={false}>方框按钮</Button>
<Button rounded={true}>圆角按钮</Button>
```

## 状态

```tsx
<Button loading>加载中</Button>
<Button disabled>禁用</Button>
```

## 事件处理

```tsx
<Button
  onClick={(e) => {
    e.preventDefault();
    console.log("按钮被点击");
  }}
>
  点击我
</Button>
```

## 表单集成

```tsx
<form>
  <Button type="submit" variant="primary">
    提交表单
  </Button>
  <Button type="reset" variant="secondary">
    重置
  </Button>
</form>
```

## API 参考

### ButtonProps

| 属性      | 类型                              | 默认值      | 描述             |
| --------- | --------------------------------- | ----------- | ---------------- |
| type      | `ButtonType`                      | `'primary'` | 按钮变体         |
| size      | `ButtonSize`                      | `'md'`      | 按钮尺寸         |
| rounded   | `boolean`                         | `false`     | 是否圆角         |
| disabled  | `boolean`                         | `false`     | 是否禁用         |
| loading   | `boolean`                         | `false`     | 是否显示加载状态 |
| className | `string`                          | -           | 自定义类名       |
| children  | `ReactNode`                       | -           | 按钮内容         |
| htmlType  | `'button' \| 'submit' \| 'reset'` | `'button'`  | HTML按钮类型     |
| onClick   | `(event: MouseEvent) => void`     | -           | 点击事件处理器   |

### 类型定义

```tsx
type ButtonType =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "link"
  | "danger";
type ButtonSize = "xs" | "sm" | "md" | "lg" | "xl";
```

## 简化说明

相比完整版Button组件，简化版移除了以下功能：

- ❌ 复杂的形状选项（pill, square等）
- ❌ 多种状态类型（success, error等）
- ❌ 图标支持（leftIcon, rightIcon）
- ❌ 全宽支持
- ❌ 复杂的主题系统

## 最佳实践

1. **保持简洁**: 使用默认的primary变体作为主要操作
2. **尺寸一致**: 在同一界面中保持按钮尺寸的一致性
3. **状态反馈**: 使用loading状态提供用户反馈
4. **无障碍性**: 确保按钮有适当的标签和键盘导航

## 常见问题

### Q: 如何自定义按钮颜色？

A: 可以通过`className`属性添加自定义样式，或者修改`styles.ts`中的样式配置。

### Q: 按钮支持哪些事件？

A: 支持所有标准的HTML button元素事件，如onClick、onMouseOver等。

### Q: 如何实现按钮组？

A: 可以将多个Button组件包装在一个容器中，使用flex布局实现按钮组。
