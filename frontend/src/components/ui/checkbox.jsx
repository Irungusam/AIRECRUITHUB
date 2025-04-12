import * as React from "react";
import { CheckIcon } from "lucide-react";

const Checkbox = React.forwardRef(
  ({ className, checked, onCheckedChange, id, ...props }, ref) => {
    const [isChecked, setIsChecked] = React.useState(checked || false);

    React.useEffect(() => {
      setIsChecked(checked || false);
    }, [checked]);

    const handleChange = () => {
      const newCheckedState = !isChecked;
      setIsChecked(newCheckedState);
      if (onCheckedChange) {
        onCheckedChange(newCheckedState);
      }
    };

    return (
      <div className="flex items-center">
        <button
          type="button"
          role="checkbox"
          aria-checked={isChecked}
          id={id}
          data-state={isChecked ? "checked" : "unchecked"}
          ref={ref}
          onClick={handleChange}
          className={`
          relative h-5 w-5 rounded-md border border-gray-300 dark:border-gray-600
          ${
            isChecked
              ? "bg-blue-600 dark:bg-blue-500"
              : "bg-white dark:bg-gray-800"
          }
          ${isChecked ? "text-white" : "text-transparent"}
          transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2
          disabled:cursor-not-allowed disabled:opacity-50
          ${className || ""}
        `}
          {...props}
        >
          {isChecked && (
            <span className="absolute inset-0 flex items-center justify-center">
              <CheckIcon className="h-3 w-3 text-white" />
            </span>
          )}
        </button>
      </div>
    );
  }
);

Checkbox.displayName = "Checkbox";

export { Checkbox };
