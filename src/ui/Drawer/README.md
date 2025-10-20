# Drawer 组件

一个灵活的抽屉组件，参考 Ant Design 的 Drawer 组件设计。

## 功能特性

- 🎯 **多方向支持** - 支持从上、右、下、左四个方向展开
- 📏 **灵活尺寸** - 提供小、中、大、全屏四种预设尺寸
- 🎨 **遮罩控制** - 可配置遮罩层显示和点击关闭
- ⌨️ **键盘支持** - 支持 ESC 键关闭
- 🔒 **滚动锁定** - 打开时自动锁定背景滚动
- ♿ **无障碍** - 完整的 ARIA 属性支持
- 🎭 **动画流畅** - 平滑的进入和退出动画
- 🎛️ **自定义性强** - 支持自定义头部、底部、关闭图标等

## 基础用法

```tsx
import { Drawer } from "@/ui";
import { useState } from "react";

function Example() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button onClick={() => setOpen(true)}>打开抽屉</button>
      <Drawer open={open} onClose={() => setOpen(false)} title="标题">
        <p>这是抽屉内容</p>
      </Drawer>
    </>
  );
}
```

## API

### Drawer Props

| 属性            | 说明                 | 类型                                     | 默认值    |
| --------------- | -------------------- | ---------------------------------------- | --------- |
| open            | 是否可见             | `boolean`                                | `false`   |
| title           | 标题                 | `ReactNode`                              | -         |
| placement       | 抽屉的方向           | `'top' \| 'right' \| 'bottom' \| 'left'` | `'right'` |
| size            | 抽屉尺寸             | `'sm' \| 'md' \| 'lg' \| 'full'`         | `'md'`    |
| mask            | 是否显示遮罩         | `boolean`                                | `true`    |
| maskClosable    | 点击遮罩是否关闭     | `boolean`                                | `true`    |
| closable        | 是否显示关闭按钮     | `boolean`                                | `true`    |
| closeIcon       | 自定义关闭图标       | `ReactNode`                              | -         |
| destroyOnClose  | 关闭时销毁子元素     | `boolean`                                | `false`   |
| className       | 自定义类名           | `string`                                 | -         |
| maskClassName   | 遮罩样式类名         | `string`                                 | -         |
| bodyClassName   | 内容区域类名         | `string`                                 | -         |
| headerClassName | 头部区域类名         | `string`                                 | -         |
| footerClassName | 底部区域类名         | `string`                                 | -         |
| footer          | 底部内容             | `ReactNode`                              | -         |
| extra           | 额外的操作按钮       | `ReactNode`                              | -         |
| onClose         | 关闭回调             | `() => void`                             | -         |
| afterOpenChange | 打开状态改变后的回调 | `(open: boolean) => void`                | -         |
| zIndex          | z-index 层级         | `number`                                 | `1000`    |

## 使用示例

### 不同方向

```tsx
<Drawer open={open} placement="left" onClose={onClose}>
  从左侧展开
</Drawer>

<Drawer open={open} placement="top" onClose={onClose}>
  从顶部展开
</Drawer>
```

### 不同尺寸

```tsx
<Drawer open={open} size="sm" onClose={onClose}>
  小尺寸
</Drawer>

<Drawer open={open} size="full" onClose={onClose}>
  全屏
</Drawer>
```

### 带底部操作

```tsx
<Drawer
  open={open}
  onClose={onClose}
  footer={
    <>
      <button onClick={onClose}>取消</button>
      <button onClick={handleSubmit}>确定</button>
    </>
  }
>
  内容
</Drawer>
```

### 无遮罩

```tsx
<Drawer open={open} mask={false} onClose={onClose}>
  无遮罩抽屉
</Drawer>
```

### 禁止遮罩关闭

```tsx
<Drawer open={open} maskClosable={false} onClose={onClose}>
  点击遮罩不会关闭
</Drawer>
```

## 样式定制

所有样式类名都可以通过对应的 `className` 属性进行覆盖：

```tsx
<Drawer
  className="custom-drawer"
  headerClassName="custom-header"
  bodyClassName="custom-body"
  footerClassName="custom-footer"
  maskClassName="custom-mask"
>
  内容
</Drawer>
```

## 注意事项

1. 抽屉打开时会自动锁定背景滚动，关闭时恢复
2. 支持 ESC 键关闭
3. 遵循 WCAG 2.1 无障碍标准
4. 使用 Tailwind CSS 进行样式管理
