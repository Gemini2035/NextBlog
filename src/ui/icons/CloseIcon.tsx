import React from 'react';
import { IconProps } from './types';

export const CloseIcon: React.FC<IconProps> = ({ 
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
    <path d="M9.5 3.205L8.795 2.5 6 5.295 3.205 2.5 2.5 3.205 5.295 6 2.5 8.795 3.205 9.5 6 6.705 8.795 9.5 9.5 8.795 6.705 6 9.5 3.205z" />
  </svg>
);

export default CloseIcon;
