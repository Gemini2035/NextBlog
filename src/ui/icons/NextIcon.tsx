import React from 'react';
import { IconProps } from './types';

export const NextIcon: React.FC<IconProps> = ({ 
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
      d="M4.5 3L7.5 6L4.5 9" 
      stroke="currentColor" 
      strokeWidth="1.5" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      fill="none"
    />
  </svg>
);

export default NextIcon;
