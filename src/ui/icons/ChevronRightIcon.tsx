import React from 'react';
import { IconProps } from './types';

export const ChevronRightIcon: React.FC<IconProps> = ({ 
  size = 20, 
  className = '', 
  ...props 
}) => (
  <svg
    width={size}
    height={size}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    {...props}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 5l7 7-7 7"
    />
  </svg>
);

export default ChevronRightIcon;
