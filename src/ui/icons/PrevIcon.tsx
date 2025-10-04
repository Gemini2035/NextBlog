import { FC } from 'react';
import { IconProps } from './types';

export const PrevIcon: FC<IconProps> = ({ 
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
      d="M7.5 9L4.5 6L7.5 3" 
      stroke="currentColor" 
      strokeWidth="1.5" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      fill="none"
    />
  </svg>
);

export default PrevIcon;
