# Button 组件

一个高度可定制的按钮组件，支持多种变体、尺寸和状态，专为跨项目使用而设计。

## 特性

- 🎨 **多种变体**: primary, secondary, outline, ghost, link, danger
- 📏 **多种尺寸**: xs, sm, md, lg, xl
- 🔄 **多种形状**: default, rounded, pill, square
- 🔄 **多种状态**: default, loading, disabled, success, error
- 🎯 **图标支持**: 支持左侧和右侧图标
- ⚡ **加载状态**: 内置加载动画和文本
- 🎨 **主题系统**: 易于自定义和扩展
- 📱 **响应式**: 支持全宽和自适应
- ♿ **无障碍**: 完整的键盘导航和屏幕阅读器支持

## 安装

```bash
# 如果作为独立包使用
npm install @your-org/button-component
# 或
yarn add @your-org/button-component
```

## 基础用法

```tsx
import { Button } from '@/ui/Button'

// 基础按钮
<Button>点击我</Button>

// 不同变体
<Button variant="primary">主要按钮</Button>
<Button variant="secondary">次要按钮</Button>
<Button variant="outline">轮廓按钮</Button>
<Button variant="ghost">幽灵按钮</Button>
<Button variant="link">链接按钮</Button>
<Button variant="danger">危险按钮</Button>
```

## 尺寸

```tsx
<Button size="xs">超小</Button>
<Button size="sm">小</Button>
<Button size="md">中等</Button>
<Button size="lg">大</Button>
<Button size="xl">超大</Button>
```

## 形状

```tsx
<Button shape="default">默认</Button>
<Button shape="rounded">圆角</Button>
<Button shape="pill">胶囊</Button>
<Button shape="square">方形</Button>
```

## 状态

```tsx
<Button state="default">默认</Button>
<Button loading>加载中</Button>
<Button disabled>禁用</Button>
<Button state="success">成功</Button>
<Button state="error">错误</Button>
```

## 图标支持

```tsx
import { SearchIcon, ChevronRightIcon } from '@/assets/icons'

// 左侧图标
<Button leftIcon={<SearchIcon className="w-4 h-4" />}>
  搜索
</Button>

// 右侧图标
<Button rightIcon={<ChevronRightIcon className="w-4 h-4" />}>
  下一步
</Button>

// 两侧图标
<Button
  leftIcon={<SearchIcon className="w-4 h-4" />}
  rightIcon={<ChevronRightIcon className="w-4 h-4" />}
>
  搜索并前进
</Button>
```

## 加载状态

```tsx
// 基础加载状态
<Button loading>加载中</Button>

// 自定义加载文本
<Button loading loadingText="正在提交...">
  提交
</Button>

// 不同变体的加载状态
<Button loading variant="outline">
  加载中
</Button>
```

## 全宽按钮

```tsx
<Button fullWidth>全宽按钮</Button>
```

## 自定义样式

```tsx
<Button className="custom-class" variant="primary">
  自定义样式
</Button>
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

| 属性        | 类型                              | 默认值      | 描述             |
| ----------- | --------------------------------- | ----------- | ---------------- |
| variant     | `ButtonVariant`                   | `'primary'` | 按钮变体         |
| size        | `ButtonSize`                      | `'md'`      | 按钮尺寸         |
| shape       | `ButtonShape`                     | `'default'` | 按钮形状         |
| state       | `ButtonState`                     | `'default'` | 按钮状态         |
| fullWidth   | `boolean`                         | `false`     | 是否全宽         |
| loading     | `boolean`                         | `false`     | 是否显示加载状态 |
| loadingText | `string`                          | -           | 加载状态下的文本 |
| leftIcon    | `ReactNode`                       | -           | 左侧图标         |
| rightIcon   | `ReactNode`                       | -           | 右侧图标         |
| className   | `string`                          | -           | 自定义类名       |
| children    | `ReactNode`                       | -           | 按钮内容         |
| disabled    | `boolean`                         | `false`     | 是否禁用         |
| type        | `'button' \| 'submit' \| 'reset'` | `'button'`  | 按钮类型         |
| onClick     | `(event: MouseEvent) => void`     | -           | 点击事件处理器   |

### 类型定义

```tsx
type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "link"
  | "danger";
type ButtonSize = "xs" | "sm" | "md" | "lg" | "xl";
type ButtonShape = "default" | "rounded" | "pill" | "square";
type ButtonState = "default" | "loading" | "disabled" | "success" | "error";
```

## 主题定制

Button组件使用Tailwind CSS类名，可以通过修改`styles.ts`文件来自定义主题：

```tsx
// 自定义主题
export const customButtonTheme: ButtonTheme = {
  base: "...",
  variants: {
    primary: "bg-purple-600 hover:bg-purple-700 ...",
    // ... 其他变体
  },
  // ... 其他配置
};
```

## 抽离为独立组件库

当需要将Button组件抽离为独立的组件库时，可以：

1. **创建独立的包结构**:

   ```
   button-component/
   ├── src/
   │   ├── Button/
   │   │   ├── Button.tsx
   │   │   ├── types.ts
   │   │   ├── styles.ts
   │   │   └── index.ts
   │   └── index.ts
   ├── package.json
   └── README.md
   ```

2. **配置package.json**:

   ```json
   {
     "name": "@your-org/button-component",
     "version": "1.0.0",
     "main": "dist/index.js",
     "types": "dist/index.d.ts",
     "peerDependencies": {
       "react": ">=16.8.0",
       "react-dom": ">=16.8.0"
     }
   }
   ```

3. **构建和发布**:
   ```bash
   npm run build
   npm publish
   ```

## 最佳实践

1. **语义化使用**: 根据功能选择合适的变体
2. **尺寸一致性**: 在同一界面中保持按钮尺寸的一致性
3. **状态反馈**: 使用loading状态提供用户反馈
4. **无障碍性**: 确保按钮有适当的标签和键盘导航
5. **性能优化**: 避免在按钮内部使用复杂的组件

## 常见问题

### Q: 如何自定义按钮颜色？

A: 可以通过修改`styles.ts`中的主题配置，或者使用`className`属性添加自定义样式。

### Q: 按钮支持哪些事件？

A: 支持所有标准的HTML button元素事件，如onClick、onMouseOver等。

### Q: 如何实现按钮组？

A: 可以将多个Button组件包装在一个容器中，使用flex布局实现按钮组。

### Q: 按钮的加载状态如何工作？

A: 当`loading`为true时，按钮会自动显示加载动画，并禁用点击事件。
