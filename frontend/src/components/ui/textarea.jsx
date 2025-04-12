import * as React from "react";

const Textarea = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <textarea
      className={`flex min-h-20 w-full rounded-md border border-gray-300 dark:border-gray-700 
                bg-white dark:bg-gray-800 px-3 py-2 text-sm shadow-sm placeholder:text-gray-500 
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 
                disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      ref={ref}
      {...props}
    />
  );
});

Textarea.displayName = "Textarea";

export { Textarea };
