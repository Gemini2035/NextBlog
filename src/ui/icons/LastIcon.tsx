import { FC } from 'react';
import { IconProps } from './types';

export const LastIcon: FC<IconProps> = ({ 
  size = 12, 
  className = '', 
  ...props 
}) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 12 12" 
    fill="currentColor"
    className={className}
    {...props}
  >
    <path 
      d="M3 3L3 9M6 3L6 9M9 3L9 9" 
      stroke="currentColor" 
      strokeWidth="1.5" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      fill="none"
    />
  </svg>
);

export default LastIcon;
