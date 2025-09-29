# Collapse 折叠面板组件

仿照 Ant Design 的折叠面板组件，支持手风琴模式、自定义箭头、多种样式变体。

## 功能特性

- ✅ 支持手风琴模式（同时只能展开一个面板）
- ✅ 支持自定义箭头图标
- ✅ 支持多种样式变体（默认、边框、幽灵）
- ✅ 支持不同尺寸（小、中、大）
- ✅ 支持禁用状态
- ✅ 支持自定义头部和内容样式
- ✅ 支持键盘导航
- ✅ 支持动画效果
- ✅ 完全可访问性支持

## 基础用法

```tsx
import { Collapse } from "@/ui";

function App() {
  return (
    <Collapse>
      <Collapse.Panel header="面板 1" key="1">
        这是面板 1 的内容
      </Collapse.Panel>
      <Collapse.Panel header="面板 2" key="2">
        这是面板 2 的内容
      </Collapse.Panel>
    </Collapse>
  );
}
```

## 手风琴模式

```tsx
<Collapse accordion>
  <Collapse.Panel header="面板 1" key="1">
    内容 1
  </Collapse.Panel>
  <Collapse.Panel header="面板 2" key="2">
    内容 2
  </Collapse.Panel>
</Collapse>
```

## 默认展开

```tsx
<Collapse defaultActiveKey={["1"]}>
  <Collapse.Panel header="面板 1" key="1">
    内容 1
  </Collapse.Panel>
  <Collapse.Panel header="面板 2" key="2">
    内容 2
  </Collapse.Panel>
</Collapse>
```

## 受控模式

```tsx
const [activeKey, setActiveKey] = useState<string[]>(['1'])

<Collapse
  activeKey={activeKey}
  onChange={setActiveKey}
>
  <Collapse.Panel header="面板 1" key="1">内容 1</Collapse.Panel>
  <Collapse.Panel header="面板 2" key="2">内容 2</Collapse.Panel>
</Collapse>
```

## 不同样式

### 边框样式

```tsx
<Collapse variant="bordered">
  <Collapse.Panel header="面板" key="1">
    内容
  </Collapse.Panel>
</Collapse>
```

### 幽灵样式

```tsx
<Collapse ghost>
  <Collapse.Panel header="面板" key="1">
    内容
  </Collapse.Panel>
</Collapse>
```

### 不同尺寸

```tsx
<Collapse size="sm">
  <Collapse.Panel header="小尺寸面板" key="1">内容</Collapse.Panel>
</Collapse>

<Collapse size="lg">
  <Collapse.Panel header="大尺寸面板" key="1">内容</Collapse.Panel>
</Collapse>
```

## 自定义箭头

```tsx
<Collapse>
  <Collapse.Panel header="自定义箭头" key="1" arrow={<span>🔽</span>}>
    内容
  </Collapse.Panel>
</Collapse>
```

## 禁用面板

```tsx
<Collapse>
  <Collapse.Panel header="正常面板" key="1">
    内容 1
  </Collapse.Panel>
  <Collapse.Panel header="禁用面板" key="2" disabled>
    内容 2
  </Collapse.Panel>
</Collapse>
```

## 隐藏箭头

```tsx
<Collapse>
  <Collapse.Panel header="无箭头面板" key="1" showArrow={false}>
    内容
  </Collapse.Panel>
</Collapse>
```

## 自定义头部

```tsx
<Collapse>
  <Collapse.Panel
    header={
      <div className="flex items-center">
        <span className="mr-2">📝</span>
        <span>自定义头部</span>
      </div>
    }
    key="1"
  >
    内容
  </Collapse.Panel>
</Collapse>
```

## API

### Collapse Props

| 属性             | 说明               | 类型                                      | 默认值      |
| ---------------- | ------------------ | ----------------------------------------- | ----------- |
| activeKey        | 当前激活的面板 key | `string \| string[]`                      | -           |
| defaultActiveKey | 默认激活的面板 key | `string \| string[]`                      | -           |
| accordion        | 是否手风琴模式     | `boolean`                                 | `false`     |
| bordered         | 是否显示边框       | `boolean`                                 | `false`     |
| ghost            | 是否幽灵样式       | `boolean`                                 | `false`     |
| size             | 组件尺寸           | `'sm' \| 'md' \| 'lg'`                    | `'md'`      |
| variant          | 变体样式           | `'default' \| 'bordered' \| 'ghost'`      | `'default'` |
| collapsible      | 是否可折叠         | `'header' \| 'icon' \| 'disabled'`        | `'header'`  |
| onChange         | 面板切换时的回调   | `(activeKey: string \| string[]) => void` | -           |
| onExpand         | 面板展开时的回调   | `(key: string) => void`                   | -           |
| onCollapse       | 面板收起时的回调   | `(key: string) => void`                   | -           |

### Collapse.Panel Props

| 属性                     | 说明                   | 类型                    | 默认值  |
| ------------------------ | ---------------------- | ----------------------- | ------- |
| key                      | 面板的唯一标识         | `string`                | -       |
| header                   | 面板标题               | `ReactNode`             | -       |
| disabled                 | 是否禁用               | `boolean`               | `false` |
| showArrow                | 是否显示箭头图标       | `boolean`               | `true`  |
| arrow                    | 自定义箭头图标         | `ReactNode`             | -       |
| headerContainerClassName | 面板头部容器自定义类名 | `string`                | -       |
| headerContentClassName   | 面板头部内容自定义类名 | `string`                | -       |
| contentClassName         | 面板内容自定义类名     | `string`                | -       |
| onHeaderClick            | 面板头部点击时的回调   | `(key: string) => void` | -       |

## 样式定制

组件使用 Tailwind CSS 构建，支持通过 `className` 属性进行样式定制：

```tsx
<Collapse className="my-custom-collapse">
  <Collapse.Panel
    header="自定义样式面板"
    key="1"
    headerContainerClassName="bg-blue-50 text-blue-700"
    contentClassName="bg-gray-50"
  >
    内容
  </Collapse.Panel>
</Collapse>
```

## 可访问性

- 支持键盘导航（Tab、Enter、Space）
- 支持屏幕阅读器
- 提供适当的 ARIA 属性
- 支持焦点管理
