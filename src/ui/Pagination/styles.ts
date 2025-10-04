import { PaginationSize, PaginationAlign } from "./types";

export const paginationStyles = {
  base: "flex items-center gap-1 text-sm",
  
  sizes: {
    small: "text-xs",
    middle: "text-sm", 
    large: "text-base"
  },
  
  alignments: {
    left: "justify-start",
    center: "justify-center",
    right: "justify-end"
  },

  item: {
    base: "inline-flex items-center justify-center min-w-[32px] h-8 px-3 rounded-md border border-gray-300 bg-white text-gray-700 cursor-pointer transition-all duration-200 hover:border-blue-500 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50",
    active: "bg-blue-500 text-white border-blue-500 hover:bg-blue-600 hover:border-blue-600",
    disabled: "opacity-50 cursor-not-allowed hover:border-gray-300 hover:text-gray-700 hover:bg-white",
    ellipsis: "cursor-default hover:border-gray-300 hover:text-gray-700 hover:bg-white"
  },

  jump: {
    base: "inline-flex items-center justify-center w-8 h-8 rounded-md border border-gray-300 bg-white text-gray-700 cursor-pointer transition-all duration-200 hover:border-blue-500 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50",
    disabled: "opacity-50 cursor-not-allowed hover:border-gray-300 hover:text-gray-700 hover:bg-white"
  },

  sizeChanger: {
    base: "flex items-center gap-2 text-sm",
    select: "px-2 py-1 border border-gray-300 rounded-md bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 focus:border-blue-500",
    label: "text-gray-600"
  },

  quickJumper: {
    base: "flex items-center gap-2 text-sm",
    input: "w-16 px-2 py-1 border border-gray-300 rounded-md bg-white text-gray-700 text-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 focus:border-blue-500",
    label: "text-gray-600"
  },

  total: {
    base: "text-sm text-gray-600 mr-4"
  },

  simple: {
    base: "flex items-center gap-2 text-sm",
    input: "w-12 px-2 py-1 border border-gray-300 rounded-md bg-white text-gray-700 text-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 focus:border-blue-500",
    separator: "text-gray-500"
  }
};

export function getPaginationStyles(
  size: PaginationSize = 'middle',
  align: PaginationAlign = 'left',
  className?: string
) {
  const baseClasses = [
    paginationStyles.base,
    paginationStyles.sizes[size],
    paginationStyles.alignments[align]
  ].filter(Boolean).join(' ');
  
  return className ? `${baseClasses} ${className}` : baseClasses;
}

export function getPaginationItemStyles(
  active?: boolean,
  disabled?: boolean,
  ellipsis?: boolean,
  className?: string
) {
  const classes = [
    paginationStyles.item.base,
    active && paginationStyles.item.active,
    disabled && paginationStyles.item.disabled,
    ellipsis && paginationStyles.item.ellipsis
  ].filter(Boolean).join(' ');
  
  return className ? `${classes} ${className}` : classes;
}

export function getPaginationJumpStyles(
  disabled?: boolean,
  className?: string
) {
  const classes = [
    paginationStyles.jump.base,
    disabled && paginationStyles.jump.disabled
  ].filter(Boolean).join(' ');
  
  return className ? `${classes} ${className}` : classes;
}

export function getPaginationSizeChangerStyles(className?: string) {
  return className ? `${paginationStyles.sizeChanger.base} ${className}` : paginationStyles.sizeChanger.base;
}

export function getPaginationQuickJumperStyles(className?: string) {
  return className ? `${paginationStyles.quickJumper.base} ${className}` : paginationStyles.quickJumper.base;
}

export function getPaginationTotalStyles(className?: string) {
  return className ? `${paginationStyles.total.base} ${className}` : paginationStyles.total.base;
}

export function getPaginationSimpleStyles(className?: string) {
  return className ? `${paginationStyles.simple.base} ${className}` : paginationStyles.simple.base;
}
