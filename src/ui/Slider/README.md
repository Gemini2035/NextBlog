# Slider 组件

一个功能强大的轮播横幅组件，支持自定义显示数量、滑动步长、左侧间距等功能。

## 功能特性

- ✅ 根据 `itemsPerPage` 控制视窗宽度展示内容的个数
- ✅ 根据 `paddingLeft` 控制第一个元素距离视窗最左边的距离
- ✅ 根据 `slidePerPage` 决定每次点击向左或向右移动的item个数
- ✅ 使用 `items` 传入节点列表，组件根据items的length确定渲染多少个节点
- ✅ 支持导航按钮（智能显示/隐藏）
- ✅ 支持指示器
- ✅ 支持自动播放
- ✅ 支持循环播放
- ✅ 支持键盘导航
- ✅ 支持触摸滑动（移动端）
- ✅ 支持鼠标滚轮导航
- ✅ 完全可访问性支持

## 基础用法

```tsx
import { Slider } from "@/ui";

const items = [
  <div className="h-32 bg-blue-500 flex items-center justify-center text-white">
    Item 1
  </div>,
  <div className="h-32 bg-green-500 flex items-center justify-center text-white">
    Item 2
  </div>,
  <div className="h-32 bg-red-500 flex items-center justify-center text-white">
    Item 3
  </div>,
  <div className="h-32 bg-yellow-500 flex items-center justify-center text-white">
    Item 4
  </div>,
];

function MyComponent() {
  return (
    <Slider items={items} itemsPerPage={2} slidePerPage={1} paddingLeft={20} />
  );
}
```

## 高级用法

### 带导航和指示器

```tsx
<Slider
  items={items}
  itemsPerPage={3}
  slidePerPage={2}
  paddingLeft={16}
  showNavigation
  showIndicators
  onSlideChange={(index) => console.log("当前页面:", index)}
/>
```

### 自动播放

```tsx
<Slider
  items={items}
  itemsPerPage={2}
  slidePerPage={1}
  autoPlay
  autoPlayInterval={3000}
  loop
  showNavigation
  showIndicators
/>
```

### 使用 ref 控制

```tsx
import { useRef } from "react";
import { Slider, SliderRef } from "@/ui";

function MyComponent() {
  const sliderRef = useRef<SliderRef>(null);

  const handleNext = () => {
    sliderRef.current?.slideNext();
  };

  const handlePrev = () => {
    sliderRef.current?.slidePrev();
  };

  const handleGoTo = (index: number) => {
    sliderRef.current?.slideTo(index);
  };

  return (
    <div>
      <Slider ref={sliderRef} items={items} itemsPerPage={2} slidePerPage={1} />
      <div className="mt-4 flex gap-2">
        <button onClick={handlePrev}>上一页</button>
        <button onClick={handleNext}>下一页</button>
        <button onClick={() => handleGoTo(0)}>第一页</button>
      </div>
    </div>
  );
}
```

### 鼠标滚轮导航

当鼠标悬停在Slider上时，可以使用滚轮进行导航：

- **垂直滚动**：向下滚动显示下一页，向上滚动显示上一页
- **横向滚动**：向右滚动显示下一页，向左滚动显示上一页

```tsx
<Slider
  items={items}
  itemsPerPage={3}
  slidePerPage={1}
  // 鼠标悬停时自动启用滚轮导航
/>
```

### 智能导航按钮

导航按钮具有智能显示/隐藏功能：

- **可点击时**：显示按钮，鼠标悬停时显示pointer光标
- **不可点击时**：按钮直接隐藏，避免视觉干扰
- **自动判断**：根据当前位置和循环设置自动判断是否显示

```tsx
<Slider
  items={items}
  itemsPerPage={2}
  slidePerPage={1}
  showNavigation={true} // 启用智能导航按钮
  loop={false} // 非循环模式，到达边界时按钮会隐藏
/>
```

## API 参考

### SliderProps

| 属性                  | 类型                             | 默认值  | 描述                              |
| --------------------- | -------------------------------- | ------- | --------------------------------- |
| `items`               | `ReactNode[]`                    | -       | **必需** 传入的节点列表           |
| `itemsPerPage`        | `number`                         | `4`     | 每页显示的item个数（默认4个）     |
| `slidePerPage`        | `number`                         | `1`     | 每次滑动移动的item个数（默认1个） |
| `draggable`           | `boolean`                        | `false` | 是否允许鼠标拖动                  |
| `paddingLeft`         | `number`                         | `0`     | 第一个元素距离视窗最左边的距离    |
| `gap`                 | `number`                         | `0`     | 元素之间的间距                    |
| `showNavigation`      | `boolean`                        | `true`  | 是否显示导航按钮                  |
| `leftArrowClassName`  | `string`                         | -       | 左箭头自定义样式类名              |
| `rightArrowClassName` | `string`                         | -       | 右箭头自定义样式类名              |
| `showIndicators`      | `boolean`                        | `false` | 是否显示指示器                    |
| `autoPlay`            | `boolean`                        | `false` | 是否自动播放                      |
| `autoPlayInterval`    | `number`                         | `3000`  | 自动播放间隔时间（毫秒）          |
| `loop`                | `boolean`                        | `true`  | 是否循环播放                      |
| `className`           | `string`                         | -       | 自定义类名                        |
| `style`               | `React.CSSProperties`            | -       | 自定义样式                        |
| `onSlideChange`       | `(currentIndex: number) => void` | -       | 导航按钮点击事件                  |

### SliderRef

| 方法              | 类型                      | 描述           |
| ----------------- | ------------------------- | -------------- |
| `slideTo`         | `(index: number) => void` | 滑动到指定索引 |
| `slideNext`       | `() => void`              | 滑动到下一页   |
| `slidePrev`       | `() => void`              | 滑动到上一页   |
| `getCurrentIndex` | `() => number`            | 获取当前索引   |
| `getTotalPages`   | `() => number`            | 获取总页数     |

## 样式定制

组件使用 Tailwind CSS 类名，你可以通过 `className` 属性进行样式定制：

```tsx
<Slider
  items={items}
  itemsPerPage={2}
  slidePerPage={1}
  className="my-custom-slider"
  style={{
    height: "200px",
    borderRadius: "8px",
  }}
/>
```

## 注意事项

1. **itemsPerPage 和 slidePerPage 的关系**：`slidePerPage` 应该小于等于 `itemsPerPage`，否则可能出现显示异常
2. **性能优化**：对于大量数据，建议使用虚拟滚动或分页加载
3. **响应式设计**：在不同屏幕尺寸下，你可能需要动态调整 `itemsPerPage` 的值
4. **无障碍性**：组件已内置键盘导航和屏幕阅读器支持

## 示例场景

### 产品展示轮播

```tsx
const products = [
  <ProductCard product={product1} />,
  <ProductCard product={product2} />,
  <ProductCard product={product3} />,
  <ProductCard product={product4} />,
]

<Slider
  items={products}
  itemsPerPage={3}
  slidePerPage={1}
  paddingLeft={24}
  showNavigation
  showIndicators
  autoPlay
  autoPlayInterval={5000}
/>
```

### 图片画廊

```tsx
const images = [
  <img src="/image1.jpg" alt="Image 1" className="w-full h-64 object-cover" />,
  <img src="/image2.jpg" alt="Image 2" className="w-full h-64 object-cover" />,
  <img src="/image3.jpg" alt="Image 3" className="w-full h-64 object-cover" />,
]

<Slider
  items={images}
  itemsPerPage={1}
  slidePerPage={1}
  showNavigation
  showIndicators
  loop
/>
```
