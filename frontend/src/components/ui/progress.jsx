import React from "react";

const Progress = React.forwardRef(
  ({ className, value, max = 100, ...props }, ref) => {
    // Ensure value is between 0 and max
    const normalizedValue = Math.min(Math.max(0, value || 0), max);
    const percentage = (normalizedValue / max) * 100;

    return (
      <div
        ref={ref}
        className={`relative h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700 ${className}`}
        {...props}
      >
        <div
          className="h-full bg-blue-500 dark:bg-blue-400 transition-all"
          style={{ width: `${percentage}%` }}
        />
      </div>
    );
  }
);

Progress.displayName = "Progress";

export { Progress };
