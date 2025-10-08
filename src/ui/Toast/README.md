# Toast 通知组件

类似 antd 的 message 组件，用于全局提示信息。

## 使用方法

### 1. 在根布局中添加 ToastContainer

```tsx
import { ToastContainer } from "@/ui/Toast";

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <ToastContainer />
      </body>
    </html>
  );
}
```

### 2. 使用 Toast API

```tsx
"use client";

import { toast } from "@/ui/Toast";

function MyComponent() {
  const handleSuccess = () => {
    toast.success("操作成功！");
  };

  const handleError = () => {
    toast.error("操作失败，请重试");
  };

  const handleWarning = () => {
    toast.warning("请注意检查输入");
  };

  const handleInfo = () => {
    toast.info("这是一条提示信息");
  };

  return (
    <div>
      <button onClick={handleSuccess}>成功</button>
      <button onClick={handleError}>错误</button>
      <button onClick={handleWarning}>警告</button>
      <button onClick={handleInfo}>信息</button>
    </div>
  );
}
```

## API

### toast.success(message, duration?)

显示成功提示

- `message`: string - 提示内容
- `duration`: number - 显示时长（毫秒），默认 3000

### toast.error(message, duration?)

显示错误提示

### toast.warning(message, duration?)

显示警告提示

### toast.info(message, duration?)

显示信息提示

### toast.show(options)

自定义Toast

```tsx
toast.show({
  message: "自定义提示",
  type: "success",
  duration: 5000,
  closable: true,
  onClose: () => console.log("Toast已关闭"),
});
```

## 配置项

```typescript
interface ToastOptions {
  message: string; // 提示内容
  type?: "success" | "error" | "warning" | "info"; // 类型
  duration?: number; // 显示时长（毫秒），0表示不自动关闭
  closable?: boolean; // 是否可关闭，默认true
  onClose?: () => void; // 关闭回调
}
```
