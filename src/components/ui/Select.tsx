import React from "react";
import { cn } from "../../lib/utils";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
}

export function Select({
  className,
  label,
  ...props
}: SelectProps) {
  return (
    <div className="space-y-1">
      {label && <label className="text-sm font-medium text-gray-700">{label}</label>}
      <select
        className={cn(
          "w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm",
          "focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all shadow-sm",
          className
        )}
        {...props}
      />
    </div>
  );
}
