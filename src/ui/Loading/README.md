# Loading 组件

加载状态指示器组件，支持多种变体和尺寸。

## 基础用法

```tsx
import { Loading } from "@/ui";

function App() {
  return <Loading />;
}
```

## 带文本的加载器

```tsx
<Loading text="加载中..." showText />
```

## 不同尺寸

```tsx
<Loading size="xs" />
<Loading size="sm" />
<Loading size="md" /> {/* 默认 */}
<Loading size="lg" />
<Loading size="xl" />
```

## 不同变体

```tsx
{
  /* 旋转加载器 */
}
<Loading variant="spinner" />;

{
  /* 点状加载器 */
}
<Loading variant="dots" />;

{
  /* 脉冲加载器 */
}
<Loading variant="pulse" />;

{
  /* 骨架屏 */
}
<Loading variant="skeleton" />;
```

## 全屏加载

```tsx
<Loading fullscreen text="正在加载数据..." showText />
```

## 完整示例

```tsx
import { Loading } from "@/ui";

function DataComponent() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchData().then((data) => {
      setData(data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <Loading text="正在加载..." showText />;
  }

  return <div>{/* 渲染数据 */}</div>;
}
```

## API

### Props

| 属性       | 类型                                           | 默认值      | 说明         |
| ---------- | ---------------------------------------------- | ----------- | ------------ |
| size       | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'`         | `'md'`      | 加载器尺寸   |
| variant    | `'spinner' \| 'dots' \| 'pulse' \| 'skeleton'` | `'spinner'` | 加载器变体   |
| text       | `string`                                       | -           | 加载文本     |
| showText   | `boolean`                                      | `false`     | 是否显示文本 |
| fullscreen | `boolean`                                      | `false`     | 是否全屏显示 |
| className  | `string`                                       | -           | 自定义类名   |

## 设计原则

1. **简洁性** - 提供清晰的加载反馈
2. **一致性** - 与整体UI风格保持一致
3. **可访问性** - 支持屏幕阅读器
4. **灵活性** - 支持多种使用场景
