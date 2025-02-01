import React from "react";
import { cn } from "../../lib/utils";
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "ghost";
  size?: "default" | "sm" | "lg";
}
export function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-md font-medium transition-colors",
        "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950",
        "disabled:pointer-events-none disabled:opacity-50",
        {
          "bg-gray-900 text-gray-50 shadow hover:bg-gray-900/90":
            variant === "default",
          "bg-red-500 text-gray-50 shadow-sm hover:bg-red-500/90":
            variant === "destructive",
          "border border-gray-200 bg-white shadow-sm hover:bg-gray-100":
            variant === "outline",
          "hover:bg-gray-100": variant === "ghost",
          "h-9 px-4 py-2": size === "default",
          "h-8 px-3 text-sm": size === "sm",
          "h-10 px-8": size === "lg",
        },
        className
      )}
      {...props}
      type="submit"
    />
  );
}
