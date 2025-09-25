import { cn } from "@/utils";

export const tagStyles = {
  base: "inline-flex items-center font-medium rounded-full",
  
  variants: {
    default: "bg-blue-100 text-blue-800",
    outline: "border border-blue-200 text-blue-700 bg-transparent",
    secondary: "bg-gray-100 text-gray-700"
  },
  
  sizes: {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-1 text-sm",
    lg: "px-4 py-2 text-base"
  }
};

export function getTagStyles(variant: keyof typeof tagStyles.variants, size: keyof typeof tagStyles.sizes, className?: string) {
  return cn(
    tagStyles.base,
    tagStyles.variants[variant],
    tagStyles.sizes[size],
    className
  );
}
