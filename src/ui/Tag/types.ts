import { ReactNode, MouseEvent } from 'react';

export type TagColor = 
  | 'default' 
  | 'primary' 
  | 'success' 
  | 'warning' 
  | 'error' 
  | 'info'
  | 'magenta'
  | 'red'
  | 'volcano'
  | 'orange'
  | 'gold'
  | 'lime'
  | 'green'
  | 'cyan'
  | 'blue'
  | 'geekblue'
  | 'purple';

export type TagSize = 'small' | 'middle' | 'large';

export interface TagProps {
  children: ReactNode;
  color?: TagColor | string;
  size?: TagSize;
  closable?: boolean;
  closeIcon?: ReactNode;
  onClose?: (e: MouseEvent<HTMLSpanElement>) => void;
  className?: string;
  style?: React.CSSProperties;
  icon?: ReactNode;
  bordered?: boolean;
}
