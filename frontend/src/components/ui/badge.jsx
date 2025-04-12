import * as React from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/60",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/60",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/60",
        outline:
          "text-foreground border border-input hover:bg-accent/20 hover:text-accent-foreground",
        success:
          "border-transparent bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900/20 dark:hover:bg-green-800/40 dark:text-green-300",
        warning:
          "border-transparent bg-amber-100 text-amber-800 hover:bg-amber-200 dark:bg-amber-900/20 dark:hover:bg-amber-800/40 dark:text-amber-300",
        info: "border-transparent bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900/20 dark:hover:bg-blue-800/40 dark:text-blue-300",
        purple:
          "border-transparent bg-purple-100 text-purple-800 hover:bg-purple-200 dark:bg-purple-900/20 dark:hover:bg-purple-800/40 dark:text-purple-300",
        ghost:
          "rounded-full border border-transparent bg-transparent hover:bg-muted/10",
      },
      size: {
        default: "px-2.5 py-1 text-xs",
        sm: "px-2 py-0.5 text-xs",
        lg: "px-3 py-1 text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

function Badge({ className, variant, size, children, ...props }) {
  return (
    <span
      className={cn(badgeVariants({ variant, size }), className)}
      {...props}
    >
      {children}
    </span>
  );
}

export { Badge, badgeVariants };
