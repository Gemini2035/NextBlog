"use client";

import React, { useState } from 'react';
import { TagProps } from "./types";
import { getTagStyles, getCloseIconStyles } from "./styles";

export function Tag({ 
  children, 
  color = "default",
  size = "middle",
  closable = false,
  closeIcon,
  onClose,
  className,
  style,
  icon,
  bordered = true
}: TagProps) {
  const [visible, setVisible] = useState(true);

  const handleClose = (e: React.MouseEvent<HTMLSpanElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (onClose) {
      onClose(e);
    } else {
      setVisible(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLSpanElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      e.stopPropagation();
      
      if (onClose) {
        // Create a minimal synthetic mouse event
        const syntheticEvent = {
          ...e,
          type: 'click',
          button: 0,
          buttons: 1,
          clientX: 0,
          clientY: 0,
          pageX: 0,
          pageY: 0,
          screenX: 0,
          screenY: 0,
          movementX: 0,
          movementY: 0,
          relatedTarget: null,
        } as unknown as React.MouseEvent<HTMLSpanElement>;
        onClose(syntheticEvent);
      } else {
        setVisible(false);
      }
    }
  };

  if (!visible) {
    return null;
  }

  const defaultCloseIcon = (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="currentColor"
      className={getCloseIconStyles()}
    >
      <path d="M9.5 3.205L8.795 2.5 6 5.295 3.205 2.5 2.5 3.205 5.295 6 2.5 8.795 3.205 9.5 6 6.705 8.795 9.5 9.5 8.795 6.705 6 9.5 3.205z" />
    </svg>
  );

  return (
    <span
      className={getTagStyles(color, size, closable, bordered, className)}
      style={style}
    >
      {icon && <span className="mr-1">{icon}</span>}
      <span>{children}</span>
      {closable && (
        <span
          onClick={handleClose}
          className="ml-1"
          role="button"
          tabIndex={0}
          onKeyDown={handleKeyDown}
        >
          {closeIcon || defaultCloseIcon}
        </span>
      )}
    </span>
  );
}
