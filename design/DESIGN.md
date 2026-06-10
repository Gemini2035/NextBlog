# NextBlog Design Language

## 目标

NextBlog 采用克制的白色内容型界面。设计语言参考 Apple 的白色体系，但不照搬 Apple 官网的营销页尺度：保留项目原有的信息密度、字体大小、按钮尺寸、按钮 hover 状态和动画节奏，只收敛颜色、材质、边框和阴影。

## 设计原则

- 以内容为中心，减少装饰性渐变、发光、重阴影和高饱和彩色标签。
- 全站主视觉使用白色、浅灰、近黑和单一蓝色交互色。
- 字号、按钮大小、按钮 hover 行为优先沿用项目已有实现，避免为了风格统一改变交互手感。
- 动画风格保留，包括首页视差、区块入场、浮动卡片、瀑布流入场和下拉菜单过渡。
- 样式值优先引用全局 CSS 变量，避免在组件内散落不可维护的 hex 色值。

## 主题变量

变量定义位于 `src/app/globals.css`。

```css
:root {
  --site-action: #0066cc;
  --site-action-hover: #0071e3;
  --site-text: #1d1d1f;
  --site-text-muted: #333333;
  --site-text-tertiary: #7a7a7a;
  --site-canvas: #ffffff;
  --site-canvas-muted: #f5f5f7;
  --site-surface: #fafafc;
  --site-border: #e0e0e0;
  --site-border-subtle: rgba(0, 0, 0, 0.08);
  --site-radius-card: 18px;
  --site-radius-control: 8px;
  --site-radius-chip: 9999px;
  --site-nav-height: 52px;
  --site-focus-ring: #0071e3;
}
```

组件中应优先使用语义变量，例如 `text-[var(--site-text)]`、`bg-[var(--site-canvas)]`、`border-[var(--site-border)]`。

## 色彩

- `--site-canvas`：页面主背景。
- `--site-canvas-muted`：首页分区、Footer、轻量背景带。
- `--site-surface`：卡片、chip、筛选项等浅表面。
- `--site-text`：标题和主要正文。
- `--site-text-muted`：描述、辅助正文。
- `--site-text-tertiary`：日期、版权、弱提示。
- `--site-action`：链接、主按钮、选中态、focus 相关状态。

不要引入新的品牌色。项目状态、文章标签、筛选 chip 默认使用中性色；只有选中态、链接和明确主操作使用 `--site-action`。

## 字体与字号

字体栈使用系统字体：

```css
system-ui, -apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", sans-serif
```

字号不按 Apple 官网规范强行放大。组件应保留项目已有 Tailwind 尺度：

- 首页 Hero：`text-4xl sm:text-5xl lg:text-6xl`
- 首页区块标题：`text-3xl sm:text-4xl lg:text-5xl`
- 列表页标题：`text-2xl sm:text-4xl`
- 描述文本：`text-base sm:text-lg lg:text-xl` 或原组件已有尺寸
- 导航文字：保留小字号、轻量展示

不要在 `body` 上设置全站 17px 或全站负字距，避免影响现有页面排版。

## 按钮与控件

按钮大小、padding、hover 行为优先沿用原组件或 UI 库设置。主题改造只覆盖颜色和边框，不改变按钮交互手感。

- 普通按钮/图标按钮圆角使用 `--site-radius-control`，当前为 `8px`。
- 标签、状态 chip 使用 `--site-radius-chip`，当前为胶囊形。
- 主按钮背景使用 `--site-action`，hover 不强制切换成新的蓝色，避免和原项目 hover 状态冲突。
- Focus ring 使用 `--site-focus-ring`。

## 卡片与容器

- 卡片使用 `--site-canvas` 或 `--site-surface`。
- 边框使用 `--site-border` 或 `--site-border-subtle`。
- 主要卡片圆角使用 `--site-radius-card`。
- 默认避免重阴影；瀑布流、文章卡片、项目卡片以边框和背景层级表达结构。
- 所有内容卡片 hover 统一沿用 posts 页面文章卡片风格：不位移、不放大、不增加阴影，只允许轻量边框或文字颜色反馈。
- 使用 `gemini-uis` 的 `Card` 时，内容卡片默认加 `disabledHover`，避免 UI 库默认的 `hover:-translate-y-1 hover:translate-x-1` 行为。
- 首页浮动文章卡片可以保留漂浮动画，但 hover 不做 scale。
- 不使用装饰性渐变背景；数据图表中的颜色属于数据语义，可以保留。

## 导航

Header 使用项目原有的白色顶部栏风格：

- 高度保留原项目 `h-16`，不要为了外部规范强行压缩。
- 背景保留 `bg-white/95 backdrop-blur-sm`。
- 底边保留浅灰 border，阴影必须很轻，建议使用 `shadow-[0_1px_2px_rgba(0,0,0,0.04)]`。
- 下拉菜单动画保留，但容器材质使用白色背景和轻边框，不使用重阴影。
- 下拉菜单不应触发页面额外滚动条；遮罩高度应扣除顶部栏高度，例如 `h-[calc(100vh-4rem)]`。
- 下拉菜单展开时应覆盖页面浮动入口。普通浮动反馈按钮层级应低于 nav 菜单层级，例如反馈按钮 `z-40`，菜单/遮罩 `z-50`。
- 交互逻辑不得依赖视觉 class，例如 backdrop 判断应使用 `data-submenu-backdrop` 这类语义标记。

## 首页

- Hero 视频区是首页的视觉主资产，可以使用深色视频背景和半透明黑色遮罩来突出视频。
- Hero 文案在视频区使用纯白/白色透明度文本，不使用发光渐变文字、文字滤镜或重投影。
- Hero CTA 可以使用轻量玻璃感按钮，例如白色透明背景、白色半透明边框和轻微 backdrop blur；不要使用脉冲动画。
- 首页分区使用 `--site-canvas` 和 `--site-canvas-muted` 交替。
- Blog/About/Projects 模块保留原字号和动画，颜色切换到主题变量。
- 浮动文章卡片保留漂浮动画，但 hover 不缩放；使用白色卡片、轻边框和中性文本。

## 列表与项目页

- 文章卡片、项目卡片、统计卡统一使用白色/浅灰表面、轻边框、低阴影。
- 文章详情的信息卡阴影要克制：默认使用轻阴影，sticky 状态不要超过 `shadow-md`。
- 相关文章卡片与 posts 页面文章卡 hover 保持一致：hover 只做边框/文字色变化，不加阴影、不位移。
- 项目状态不使用黄/绿/紫/粉等高饱和色块；默认中性 chip，重要选中态使用 `--site-action`。
- 筛选器保留原交互和控件尺寸，只替换颜色变量。
- 项目详情中的图表色板可以保留，用于区分数据系列。

## 动画

动画是项目体验的一部分，默认保留：

- 首页 Hero 视差与滚动透明度。
- 首页区块 Intersection Observer 入场。
- FloatingPost 漂浮动画。
- 瀑布流入场和弹窗过渡。
- Header 下拉的 Framer Motion 动画。

主题改造不应通过移除入场/过渡动画来解决视觉问题；但卡片 hover 的缩放、位移和加重阴影应统一禁用，避免和 posts 页面文章卡风格割裂。

## 禁止项

- 不新增第二品牌色。
- 不使用装饰性渐变、发光文字、重阴影来制造层级。
- 内容卡片 hover 不使用 scale、translate 或 hover shadow。
- 不在组件内新增散落 hex 色值，除非是图表数据颜色。
- 不为了套用外部规范改变原项目字体大小、按钮大小、按钮 hover 行为。
- 不让交互逻辑依赖视觉 class 名。
