import { cn } from "@/utils";
import { TagColor, TagSize } from "./types";

export const tagStyles = {
  base: "inline-flex items-center font-medium rounded-md border border-solid transition-all duration-200",
  
  colors: {
    default: "bg-gray-100 text-gray-700 border-gray-200",
    primary: "bg-blue-100 text-blue-700 border-blue-200",
    success: "bg-green-100 text-green-700 border-green-200",
    warning: "bg-yellow-100 text-yellow-700 border-yellow-200",
    error: "bg-red-100 text-red-700 border-red-200",
    info: "bg-cyan-100 text-cyan-700 border-cyan-200",
    magenta: "bg-pink-100 text-pink-700 border-pink-200",
    red: "bg-red-100 text-red-700 border-red-200",
    volcano: "bg-orange-100 text-orange-700 border-orange-200",
    orange: "bg-orange-100 text-orange-700 border-orange-200",
    gold: "bg-yellow-100 text-yellow-700 border-yellow-200",
    lime: "bg-lime-100 text-lime-700 border-lime-200",
    green: "bg-green-100 text-green-700 border-green-200",
    cyan: "bg-cyan-100 text-cyan-700 border-cyan-200",
    blue: "bg-blue-100 text-blue-700 border-blue-200",
    geekblue: "bg-indigo-100 text-indigo-700 border-indigo-200",
    purple: "bg-purple-100 text-purple-700 border-purple-200"
  },
  
  sizes: {
    small: "px-2 py-0.5 text-xs h-5",
    middle: "px-2.5 py-1 text-sm h-6",
    large: "px-3 py-1.5 text-base h-8"
  },

  states: {
    hover: "hover:opacity-80",
    closable: "cursor-pointer hover:bg-opacity-80"
  }
};

export function getTagStyles(
  color: TagColor | string = 'default', 
  size: TagSize = 'middle', 
  closable?: boolean,
  bordered?: boolean,
  className?: string
) {
  const isCustomColor = typeof color === 'string' && !Object.keys(tagStyles.colors).includes(color);
  
  return cn(
    tagStyles.base,
    !isCustomColor && tagStyles.colors[color as TagColor],
    tagStyles.sizes[size],
    closable && tagStyles.states.closable,
    !closable && tagStyles.states.hover,
    !bordered && "border-transparent",
    className
  );
}

export function getCloseIconStyles() {
  return "ml-1 cursor-pointer hover:opacity-70 transition-opacity duration-200";
}
