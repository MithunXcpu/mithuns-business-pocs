import * as React from "react";
import { cn } from "@/lib/utils";

export interface ChipProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  selected?: boolean;
}

const Chip = React.forwardRef<HTMLButtonElement, ChipProps>(
  ({ className, selected, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        type="button"
        aria-pressed={selected}
        className={cn(
          "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
          selected
            ? "border-primary bg-primary text-primary-foreground shadow-sm"
            : "border-input bg-background text-foreground hover:bg-accent hover:text-accent-foreground",
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);
Chip.displayName = "Chip";

export { Chip };
