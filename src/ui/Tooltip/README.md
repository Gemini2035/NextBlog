# Tooltip 组件

一个功能完整的 Tooltip 组件，参照 Ant Design 的实现思路，支持多种触发方式、位置和主题。

## 特性

- 🎯 **多种触发方式** - 支持 hover、click、focus、contextMenu 触发
- 📍 **灵活定位** - 支持 12 种位置定位，自动调整避免超出视口
- 🎨 **主题支持** - 内置 light 主题
- ⚡ **性能优化** - 使用 Portal 渲染，避免层级问题
- 🎭 **动画效果** - 支持淡入淡出、缩放、滑动等动画
- 🎪 **交互式** - 支持可交互的 Tooltip 内容
- 📱 **响应式** - 自动适配不同屏幕尺寸

## 基础用法

```tsx
import { Tooltip } from '@/ui'

// 基础用法
<Tooltip title="这是一个提示">
  <Button>悬停我</Button>
</Tooltip>

// 不同位置
<Tooltip title="上方提示" placement="top">
  <Button>上方</Button>
</Tooltip>

// 不同主题
<Tooltip title="浅色主题" theme="light">
  <Button>深色</Button>
</Tooltip>
```

## 触发方式

```tsx
// 鼠标悬停（默认）
<Tooltip title="悬停显示" trigger="hover">
  <Button>悬停</Button>
</Tooltip>

// 点击触发
<Tooltip title="点击显示" trigger="click">
  <Button>点击</Button>
</Tooltip>

// 聚焦触发
<Tooltip title="聚焦显示" trigger="focus">
  <input placeholder="聚焦我" />
</Tooltip>

// 右键菜单触发
<Tooltip title="右键显示" trigger="contextMenu">
  <Button>右键</Button>
</Tooltip>
```

## 位置设置

```tsx
// 上方
<Tooltip title="上方" placement="top">
  <Button>上方</Button>
</Tooltip>

// 下方
<Tooltip title="下方" placement="bottom">
  <Button>下方</Button>
</Tooltip>

// 左侧
<Tooltip title="左侧" placement="left">
  <Button>左侧</Button>
</Tooltip>

// 右侧
<Tooltip title="右侧" placement="right">
  <Button>右侧</Button>
</Tooltip>

// 精确位置
<Tooltip title="左上" placement="topLeft">
  <Button>左上</Button>
</Tooltip>
```

## 主题设置

```tsx
// 浅色主题（默认）
<Tooltip title="浅色主题" theme="light">
  <Button>浅色</Button>
</Tooltip>

// 深色主题
<Tooltip title="浅色主题" theme="light">
  <Button>深色</Button>
</Tooltip>
```

## 高级用法

```tsx
// 延迟显示/隐藏
<Tooltip
  title="延迟显示"
  delay={500}
  hideDelay={200}
>
  <Button>延迟</Button>
</Tooltip>

// 可交互内容
<Tooltip
  title={
    <div>
      <p>可交互内容</p>
      <button onClick={() => alert('点击了')}>点击我</button>
    </div>
  }
  interactive
>
  <Button>可交互</Button>
</Tooltip>

// 跟随鼠标
<Tooltip
  title="跟随鼠标"
  followCursor
>
  <Button>跟随</Button>
</Tooltip>

// 自定义偏移
<Tooltip
  title="自定义偏移"
  offset={[10, 20]}
>
  <Button>偏移</Button>
</Tooltip>

// 受控显示
<Tooltip
  title="受控显示"
  visible={isVisible}
  onVisibleChange={setIsVisible}
>
  <Button>受控</Button>
</Tooltip>

// 自定义渲染容器
<Tooltip
  title="自定义容器"
  getRenderContainer={() => document.getElementById('custom-container')}
>
  <Button>自定义容器</Button>
</Tooltip>
```

## API

### TooltipProps

| 属性               | 说明                 | 类型                                             | 默认值    |
| ------------------ | -------------------- | ------------------------------------------------ | --------- |
| title              | 提示内容             | `ReactNode`                                      | -         |
| trigger            | 触发方式             | `'hover' \| 'click' \| 'focus' \| 'contextMenu'` | `'hover'` |
| placement          | 显示位置             | `TooltipPlacement`                               | `'top'`   |
| theme              | 主题                 | `'light'`                                        | `'light'` |
| arrow              | 是否显示箭头         | `boolean`                                        | `true`    |
| disabled           | 是否禁用             | `boolean`                                        | `false`   |
| delay              | 延迟显示时间（毫秒） | `number`                                         | `0`       |
| hideDelay          | 延迟隐藏时间（毫秒） | `number`                                         | `0`       |
| interactive        | 是否可交互           | `boolean`                                        | `false`   |
| visible            | 是否显示（受控）     | `boolean`                                        | -         |
| defaultVisible     | 默认是否显示         | `boolean`                                        | `false`   |
| onVisibleChange    | 显示状态变化回调     | `(visible: boolean) => void`                     | -         |
| offset             | 自定义偏移量         | `[number, number]`                               | `[0, 0]`  |
| followCursor       | 是否跟随鼠标         | `boolean`                                        | `false`   |
| maxWidth           | 最大宽度             | `number \| string`                               | -         |
| minWidth           | 最小宽度             | `number \| string`                               | -         |
| getRenderContainer | 自定义渲染容器       | `() => HTMLElement`                              | -         |

### TooltipPlacement

```tsx
type TooltipPlacement =
  | "top" // 上方
  | "topLeft" // 上方左侧
  | "topRight" // 上方右侧
  | "bottom" // 下方
  | "bottomLeft" // 下方左侧
  | "bottomRight" // 下方右侧
  | "left" // 左侧
  | "leftTop" // 左侧上方
  | "leftBottom" // 左侧下方
  | "right" // 右侧
  | "rightTop" // 右侧上方
  | "rightBottom"; // 右侧下方
```

## 实现思路

本组件参照 Ant Design 的 Tooltip 实现思路：

1. **Portal 渲染** - 使用 `createPortal` 将 Tooltip 渲染到 `document.body`，避免层级和定位问题
2. **位置计算** - 根据触发元素和 Tooltip 元素的位置关系，计算最佳显示位置
3. **视口检测** - 自动调整位置，确保 Tooltip 不会超出视口范围
4. **事件处理** - 支持多种触发方式，并处理相应的鼠标和键盘事件
5. **性能优化** - 使用 `useCallback` 和 `useMemo` 优化渲染性能
6. **动画效果** - 支持多种动画效果，提升用户体验

## 自定义渲染容器

`getRenderContainer` 允许你指定 Tooltip 的渲染容器，这在以下场景中很有用：

```tsx
// 渲染到特定容器
<Tooltip
  title="容器内渲染"
  getRenderContainer={() => document.getElementById('tooltip-container')}
>
  <Button>容器内</Button>
</Tooltip>

// 渲染到模态框内
<Tooltip
  title="模态框内渲染"
  getRenderContainer={() => document.querySelector('.modal-content')}
>
  <Button>模态框内</Button>
</Tooltip>

// 渲染到滚动容器内
<Tooltip
  title="滚动容器内渲染"
  getRenderContainer={() => document.querySelector('.scroll-container')}
>
  <Button>滚动容器内</Button>
</Tooltip>
```

### 使用场景

1. **模态框内**: 当 Tooltip 在模态框内使用时，渲染到模态框容器内
2. **滚动容器**: 当 Tooltip 在可滚动的容器内时，避免位置计算错误
3. **嵌套布局**: 在复杂的嵌套布局中，确保 Tooltip 在正确的层级
4. **性能优化**: 避免在 document.body 中创建过多元素

## 注意事项

- Tooltip 内容会自动换行，建议控制内容长度
- 在移动端建议使用 `click` 触发方式
- 可交互内容需要设置 `interactive={true}`
- 大量 Tooltip 使用时注意性能优化
- 使用 `getRenderContainer` 时，确保容器元素存在且可见
- 自定义容器会影响位置计算，建议容器有明确的定位上下文
