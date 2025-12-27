"use client";

import { ReactNode } from 'react';
import { Tag } from '@/ui';
import { TagProps } from '@/ui';
import { cn } from '@/utils';

export interface PostTagProps extends Omit<TagProps, 'color' | 'size'> {
  /**
   * 标签文本
   */
  children: ReactNode;
  /**
   * 标签变体
   */
  variant?: 'default' | 'primary' | 'secondary';
  /**
   * 标签大小
   */
  size?: 'small' | 'medium' | 'large';
  /**
   * 是否在紧凑模式下显示
   */
  compact?: boolean;
  /**
   * 是否在 Tooltip 中显示
   */
  inTooltip?: boolean;
}

/**
 * 专门用于博客文章的标签组件
 * 基于 UI Tag 组件，提供博客特定的样式和功能
 */
export function PostTag({
  children,
  variant = 'primary',
  size = 'medium',
  compact = false,
  inTooltip = false,
  className,
  ...props
}: PostTagProps) {
  // 根据变体确定颜色
  const getColor = () => {
    switch (variant) {
      case 'primary':
        return 'primary';
      case 'secondary':
        return 'default';
      case 'default':
      default:
        return 'primary';
    }
  };

  // 根据大小确定 Tag 的 size
  const getTagSize = () => {
    if (compact) return 'small';
    switch (size) {
      case 'small':
        return 'small';
      case 'large':
        return 'large';
      case 'medium':
      default:
        return 'middle';
    }
  };

  // 根据环境确定样式
  const getStyles = () => {
    const baseStyles = compact ? 'text-xs' : '';
    const tooltipStyles = inTooltip ? 'shadow-sm' : '';
    
    return cn(
      baseStyles,
      tooltipStyles,
      className
    );
  };

  return (
    <Tag
      {...props}
      color={getColor()}
      size={getTagSize()}
      className={getStyles()}
      bordered={!inTooltip}
    >
      {children}
    </Tag>
  );
}
