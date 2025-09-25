import { cn } from "@/utils";

interface TagProps {
  children: React.ReactNode;
  variant?: "default" | "outline" | "secondary";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function Tag({ 
  children, 
  variant = "default", 
  size = "md", 
  className 
}: TagProps) {
  const baseStyles = "inline-flex items-center font-medium rounded-full";
  
  const variants = {
    default: "bg-blue-100 text-blue-800",
    outline: "border border-blue-200 text-blue-700 bg-transparent",
    secondary: "bg-gray-100 text-gray-700"
  };
  
  const sizes = {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-1 text-sm",
    lg: "px-4 py-2 text-base"
  };
  
  return (
    <span
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        className
      )}
    >
      {children}
    </span>
  );
}
