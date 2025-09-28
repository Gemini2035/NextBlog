# Pagination 分页组件

基于 Ant Design 设计的分页组件，提供完整的分页功能。

## 功能特性

- ✅ 基础分页功能
- ✅ 页码跳转
- ✅ 每页条数选择
- ✅ 快速跳转
- ✅ 总数显示
- ✅ 简单模式
- ✅ 自定义图标
- ✅ 响应式设计
- ✅ 无障碍支持

## 基础用法

```tsx
import { Pagination } from "@/ui";

function BasicExample() {
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const total = 100;

  return (
    <Pagination
      current={current}
      pageSize={pageSize}
      total={total}
      onChange={(page, size) => {
        setCurrent(page);
        setPageSize(size);
      }}
    />
  );
}
```

## 高级用法

```tsx
import { Pagination } from "@/ui";

function AdvancedExample() {
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const total = 500;

  return (
    <Pagination
      current={current}
      pageSize={pageSize}
      total={total}
      onChange={(page, size) => {
        setCurrent(page);
        setPageSize(size);
      }}
      showTotal={(total, range) =>
        `第 ${range[0]}-${range[1]} 条，共 ${total} 条`
      }
      showSizeChanger
      showQuickJumper
      showFirstLastJumpers
      pageSizeOptions={["10", "20", "50", "100"]}
      size="large"
      align="center"
    />
  );
}
```

## 简单模式

```tsx
import { Pagination } from "@/ui";

function SimpleExample() {
  const [current, setCurrent] = useState(1);
  const total = 100;

  return (
    <Pagination
      simple
      current={current}
      total={total}
      onChange={(page) => setCurrent(page)}
    />
  );
}
```

## API

### Pagination Props

| 参数                 | 说明                     | 类型                                                             | 默认值                    |
| -------------------- | ------------------------ | ---------------------------------------------------------------- | ------------------------- |
| current              | 当前页码                 | number                                                           | -                         |
| defaultCurrent       | 默认页码                 | number                                                           | 1                         |
| pageSize             | 每页条数                 | number                                                           | 10                        |
| defaultPageSize      | 默认每页条数             | number                                                           | 10                        |
| total                | 数据总数                 | number                                                           | 0                         |
| onChange             | 页码改变时的回调         | (page: number, pageSize: number) => void                         | -                         |
| onShowSizeChange     | pageSize 变化的回调      | (current: number, size: number) => void                          | -                         |
| showQuickJumper      | 是否显示快速跳转         | boolean                                                          | false                     |
| showSizeChanger      | 是否显示每页条数选择器   | boolean                                                          | false                     |
| pageSizeOptions      | 指定每页可以显示多少条   | string[]                                                         | ['10', '20', '50', '100'] |
| showTotal            | 是否显示总数             | boolean \| (total: number, range: [number, number]) => ReactNode | false                     |
| showPrevNextJumpers  | 是否显示上一页下一页按钮 | boolean                                                          | true                      |
| showFirstLastJumpers | 是否显示首页末页按钮     | boolean                                                          | false                     |
| disabled             | 是否禁用                 | boolean                                                          | false                     |
| hideOnSinglePage     | 是否隐藏当只有一页时     | boolean                                                          | false                     |
| size                 | 组件大小                 | 'small' \| 'middle' \| 'large'                                   | 'middle'                  |
| align                | 对齐方式                 | 'left' \| 'center' \| 'right'                                    | 'left'                    |
| className            | 自定义类名               | string                                                           | -                         |
| style                | 自定义样式               | React.CSSProperties                                              | -                         |
| showLessItems        | 是否显示省略号           | boolean                                                          | false                     |
| simple               | 简单模式                 | boolean                                                          | false                     |
| prevIcon             | 自定义上一页按钮内容     | ReactNode                                                        | -                         |
| nextIcon             | 自定义下一页按钮内容     | ReactNode                                                        | -                         |
| firstIcon            | 自定义首页按钮内容       | ReactNode                                                        | -                         |
| lastIcon             | 自定义末页按钮内容       | ReactNode                                                        | -                         |
| jumpPrevIcon         | 自定义跳转按钮内容       | ReactNode                                                        | -                         |
| jumpNextIcon         | 自定义跳转按钮内容       | ReactNode                                                        | -                         |

## 样式定制

组件使用 Tailwind CSS 构建，支持通过 className 进行样式定制：

```tsx
<Pagination
  className="custom-pagination"
  // ... 其他属性
/>
```

## 无障碍支持

- 所有按钮都支持键盘导航
- 提供适当的 ARIA 标签
- 支持屏幕阅读器
- 焦点管理

## 注意事项

1. 当 `total` 为 0 时，组件不会显示
2. 在简单模式下，只显示当前页码和总页数
3. 快速跳转支持回车键确认
4. 每页条数变化时会自动调整当前页码
