import * as React from "react";
import { cn } from "@/lib/utils";

const Input = React.forwardRef(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "flex h-10 w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm",
        "placeholder:text-gray-400",
        "focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none",
        "file:border-0 file:bg-transparent file:text-sm file:font-medium",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});

Input.displayName = "Input";

export { Input };
