# Tab 组件

参考 Ant Design 设计的标签页组件。

## 基本用法

```tsx
import { Tab } from '@/ui'

const items = [
  {
    key: 'tab1',
    label: '标签页 1',
    children: <div>内容 1</div>
  },
  {
    key: 'tab2',
    label: '标签页 2',
    children: <div>内容 2</div>
  }
]

<Tab items={items} />
```

## API

### TabProps

| 参数                | 说明             | 类型                             | 默认值       |
| ------------------- | ---------------- | -------------------------------- | ------------ |
| items               | 标签页配置       | `TabItem[]`                      | -            |
| defaultActiveKey    | 默认激活的标签页 | `string`                         | 第一个标签页 |
| activeKey           | 当前激活的标签页 | `string`                         | -            |
| onChange            | 标签页切换回调   | `(key: string) => void`          | -            |
| className           | 自定义类名       | `string`                         | -            |
| tabBarClassName     | 标签栏自定义类名 | `string`                         | -            |
| tabContentClassName | 内容区自定义类名 | `string`                         | -            |
| size                | 尺寸             | `'small' \| 'medium' \| 'large'` | `'medium'`   |
| type                | 类型             | `'line' \| 'card'`               | `'line'`     |

### TabItem

| 参数     | 说明       | 类型        | 默认值  |
| -------- | ---------- | ----------- | ------- |
| key      | 唯一标识   | `string`    | -       |
| label    | 标签页标题 | `ReactNode` | -       |
| children | 标签页内容 | `ReactNode` | -       |
| disabled | 是否禁用   | `boolean`   | `false` |

## 示例

### 卡片式标签

```tsx
<Tab items={items} type="card" size="large" />
```

### 受控模式

```tsx
const [activeKey, setActiveKey] = useState('tab1')

<Tab
  items={items}
  activeKey={activeKey}
  onChange={setActiveKey}
/>
```
