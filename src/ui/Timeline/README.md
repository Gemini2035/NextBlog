# Timeline 时间轴组件

基于 Ant Design 设计思路的时间轴组件，用于展示时间序列信息。

## 特性

- 🎨 **多种模式**：支持左侧、右侧、交替三种布局模式
- 🎯 **灵活配置**：支持自定义颜色、状态、尺寸等
- 📱 **响应式设计**：适配不同屏幕尺寸
- ♿ **无障碍支持**：遵循 WCAG 2.x 规范
- 🎪 **高度可定制**：支持自定义时间轴点和连接线

## 基础用法

```tsx
import { Timeline, TimelineItem } from "@/ui";

// 基础时间轴
<Timeline>
  <TimelineItem label="2023-01-01">
    <h3>项目开始</h3>
    <p>开始开发新项目</p>
  </TimelineItem>
  <TimelineItem label="2023-02-01">
    <h3>功能开发</h3>
    <p>完成核心功能开发</p>
  </TimelineItem>
  <TimelineItem label="2023-03-01">
    <h3>项目上线</h3>
    <p>项目正式上线</p>
  </TimelineItem>
</Timeline>;
```

## 不同模式

### 左侧模式（默认）

```tsx
<Timeline mode="left">
  <TimelineItem label="2023-01-01">项目开始</TimelineItem>
  <TimelineItem label="2023-02-01">功能开发</TimelineItem>
</Timeline>
```

### 右侧模式

```tsx
<Timeline mode="right">
  <TimelineItem label="2023-01-01">项目开始</TimelineItem>
  <TimelineItem label="2023-02-01">功能开发</TimelineItem>
</Timeline>
```

### 交替模式

```tsx
<Timeline mode="alternate">
  <TimelineItem label="2023-01-01">项目开始</TimelineItem>
  <TimelineItem label="2023-02-01">功能开发</TimelineItem>
  <TimelineItem label="2023-03-01">项目上线</TimelineItem>
</Timeline>
```

## 不同尺寸

```tsx
// 小尺寸
<Timeline size="sm">
  <TimelineItem label="2023-01-01">项目开始</TimelineItem>
</Timeline>

// 中等尺寸（默认）
<Timeline size="md">
  <TimelineItem label="2023-01-01">项目开始</TimelineItem>
</Timeline>

// 大尺寸
<Timeline size="lg">
  <TimelineItem label="2023-01-01">项目开始</TimelineItem>
</Timeline>
```

## 不同状态

```tsx
<Timeline>
  <TimelineItem label="2023-01-01" status="finish" color="green">
    已完成的任务
  </TimelineItem>
  <TimelineItem label="2023-02-01" status="process" color="blue">
    进行中的任务
  </TimelineItem>
  <TimelineItem label="2023-03-01" status="error" color="red">
    出错的任务
  </TimelineItem>
  <TimelineItem label="2023-04-01" status="pending" color="gray">
    待处理的任务
  </TimelineItem>
</Timeline>
```

## 自定义时间轴点

```tsx
<Timeline>
  <TimelineItem label="2023-01-01" dot={<CustomIcon className="w-4 h-4" />}>
    自定义图标
  </TimelineItem>
  <TimelineItem label="2023-02-01" dot={<span className="text-2xl">🎉</span>}>
    表情符号
  </TimelineItem>
</Timeline>
```

## 隐藏连接线

```tsx
<Timeline showLine={false}>
  <TimelineItem label="2023-01-01">项目开始</TimelineItem>
  <TimelineItem label="2023-02-01">功能开发</TimelineItem>
</Timeline>
```

## API

### Timeline Props

| 属性      | 说明           | 类型                               | 默认值   |
| --------- | -------------- | ---------------------------------- | -------- |
| mode      | 时间轴模式     | `'left' \| 'right' \| 'alternate'` | `'left'` |
| size      | 时间轴尺寸     | `'sm' \| 'md' \| 'lg'`             | `'md'`   |
| showLine  | 是否显示连接线 | `boolean`                          | `true`   |
| lineColor | 连接线颜色     | `string`                           | -        |
| className | 自定义类名     | `string`                           | -        |
| children  | 子元素         | `ReactNode`                        | -        |

### TimelineItem Props

| 属性      | 说明           | 类型                                                           | 默认值      |
| --------- | -------------- | -------------------------------------------------------------- | ----------- |
| label     | 时间标签       | `ReactNode`                                                    | -           |
| color     | 时间轴点颜色   | `'blue' \| 'green' \| 'red' \| 'orange' \| 'purple' \| 'gray'` | `'blue'`    |
| status    | 时间轴点状态   | `'pending' \| 'process' \| 'finish' \| 'error'`                | `'process'` |
| dot       | 自定义时间轴点 | `ReactNode`                                                    | -           |
| showLine  | 是否显示连接线 | `boolean`                                                      | `true`      |
| lineColor | 连接线颜色     | `string`                                                       | -           |
| className | 自定义类名     | `string`                                                       | -           |
| children  | 子元素         | `ReactNode`                                                    | -           |

## 设计原则

1. **一致性**：遵循 Ant Design 的设计语言
2. **可访问性**：支持键盘导航和屏幕阅读器
3. **响应式**：适配不同设备和屏幕尺寸
4. **可定制性**：提供丰富的自定义选项
5. **性能优化**：使用 CSS 变量和 Tailwind 优化渲染性能
