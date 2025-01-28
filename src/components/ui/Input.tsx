import React from "react";
import { cn } from "../../lib/utils";
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}
export function Input({
  className,
  ...props
}: InputProps) {
  return <input className={cn("flex h-9 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm", "placeholder:text-gray-500", "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950", "disabled:cursor-not-allowed disabled:opacity-50", className)} {...props} />;
}