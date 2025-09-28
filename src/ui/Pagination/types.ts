import { ReactNode, MouseEvent, ChangeEvent } from 'react';

export type PaginationSize = 'small' | 'middle' | 'large';

export type PaginationAlign = 'left' | 'center' | 'right';

export interface PaginationProps {
  /** 当前页码 */
  current?: number;
  /** 默认页码 */
  defaultCurrent?: number;
  /** 每页条数 */
  pageSize?: number;
  /** 默认每页条数 */
  defaultPageSize?: number;
  /** 数据总数 */
  total?: number;
  /** 页码改变时的回调 */
  onChange?: (page: number, pageSize: number) => void;
  /** pageSize 变化的回调 */
  onShowSizeChange?: (current: number, size: number) => void;
  /** 是否显示快速跳转 */
  showQuickJumper?: boolean;
  /** 是否显示每页条数选择器 */
  showSizeChanger?: boolean;
  /** 指定每页可以显示多少条 */
  pageSizeOptions?: string[];
  /** 是否显示总数 */
  showTotal?: boolean | ((total: number, range: [number, number]) => ReactNode);
  /** 是否显示上一页下一页按钮 */
  showPrevNextJumpers?: boolean;
  /** 是否显示首页末页按钮 */
  showFirstLastJumpers?: boolean;
  /** 是否禁用 */
  disabled?: boolean;
  /** 是否隐藏当只有一页时 */
  hideOnSinglePage?: boolean;
  /** 组件大小 */
  size?: PaginationSize;
  /** 对齐方式 */
  align?: PaginationAlign;
  /** 自定义类名 */
  className?: string;
  /** 自定义样式 */
  style?: React.CSSProperties;
  /** 是否显示省略号 */
  showLessItems?: boolean;
  /** 简单模式 */
  simple?: boolean;
  /** 自定义上一页按钮内容 */
  prevIcon?: ReactNode;
  /** 自定义下一页按钮内容 */
  nextIcon?: ReactNode;
  /** 自定义首页按钮内容 */
  firstIcon?: ReactNode;
  /** 自定义末页按钮内容 */
  lastIcon?: ReactNode;
  /** 自定义跳转按钮内容 */
  jumpPrevIcon?: ReactNode;
  /** 自定义跳转按钮内容 */
  jumpNextIcon?: ReactNode;
}

export interface PaginationItemProps {
  /** 页码 */
  page: number;
  /** 是否激活 */
  active?: boolean;
  /** 是否禁用 */
  disabled?: boolean;
  /** 点击事件 */
  onClick?: (page: number) => void;
  /** 自定义类名 */
  className?: string;
  /** 是否显示省略号 */
  ellipsis?: boolean;
  /** 自定义内容 */
  children?: ReactNode;
}

export interface PaginationJumpProps {
  /** 跳转方向 */
  direction: 'prev' | 'next';
  /** 点击事件 */
  onClick?: () => void;
  /** 是否禁用 */
  disabled?: boolean;
  /** 自定义类名 */
  className?: string;
  /** 自定义图标 */
  icon?: ReactNode;
}

export interface PaginationSizeChangerProps {
  /** 当前页码 */
  current: number;
  /** 当前每页条数 */
  pageSize: number;
  /** 每页条数选项 */
  pageSizeOptions: string[];
  /** 变化回调 */
  onChange: (current: number, pageSize: number) => void;
  /** 是否禁用 */
  disabled?: boolean;
  /** 自定义类名 */
  className?: string;
}

export interface PaginationQuickJumperProps {
  /** 当前页码 */
  current: number;
  /** 总页数 */
  totalPages: number;
  /** 跳转回调 */
  onJump: (page: number) => void;
  /** 是否禁用 */
  disabled?: boolean;
  /** 自定义类名 */
  className?: string;
}
