import React from "react";
import { cn } from "../../lib/utils";
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "ghost" | "secondary";
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
        "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2",
        "disabled:pointer-events-none disabled:opacity-50",
        {
          "bg-primary-600 text-white shadow-md hover:bg-primary-700 hover:shadow-lg active:scale-[0.98]":
            variant === "default",
          "bg-red-500 text-white shadow-md hover:bg-red-600 hover:shadow-lg active:scale-[0.98]":
            variant === "destructive",
          "border border-gray-200 bg-white text-gray-700 shadow-sm hover:bg-gray-50 hover:text-gray-900 active:scale-[0.98]":
            variant === "outline",
          "hover:bg-gray-100 text-gray-600 hover:text-gray-900":
            variant === "ghost",
          "bg-primary-50 text-primary-700 hover:bg-primary-100":
            variant === "secondary",
          "h-10 px-4 py-2": size === "default",
          "h-8 px-3 text-sm": size === "sm",
          "h-12 px-8 text-lg": size === "lg",
        },
        className,
      )}
      {...props}
      type={props.type || "button"}
    />
  );
}
