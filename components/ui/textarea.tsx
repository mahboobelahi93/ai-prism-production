import * as React from "react";

import { cn } from "@/lib/utils";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  maxLength?: number;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, maxLength, value, defaultValue, ...props }, ref) => {
    // Initialize character count based on initial value or defaultValue
    const [charCount, setCharCount] = React.useState(() => {
      if (typeof value === "string") {
        return value.length;
      } else if (typeof defaultValue === "string") {
        return defaultValue.length;
      }
      return 0;
    });

    // Update character count when value changes externally
    React.useEffect(() => {
      if (typeof value === "string") {
        setCharCount(value.length);
      }
    }, [value]);

    return (
      <div className="w-full">
        <textarea
          className={cn(
            "flex h-20 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            className,
          )}
          ref={ref}
          value={value}
          defaultValue={defaultValue}
          maxLength={maxLength}
          onChange={(e) => {
            setCharCount(e.target.value.length);
            props.onChange?.(e); // Keep existing onChange functionality
          }}
          {...props}
        />
        <div className="mt-1 text-right text-xs text-muted-foreground">
          {charCount}
          {maxLength ? ` / ${maxLength}` : ""}
        </div>
      </div>
    );
  },
);

Textarea.displayName = "Textarea";

export { Textarea };
