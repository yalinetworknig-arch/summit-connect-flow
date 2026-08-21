import * as React from "react";

import { cn } from "@/lib/utils";

const Textarea = React.forwardRef<HTMLTextAreaElement, React.ComponentProps<"textarea">>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[120px] w-full rounded-lg border-2 border-input bg-background/50 px-4 py-3 text-base shadow-sm placeholder:text-muted-foreground hover:border-input/80 focus-visible:outline-none focus-visible:border-accent-cyan focus-visible:ring-2 focus-visible:ring-accent-cyan/30 focus-visible:bg-background disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-muted transition-all duration-200 resize-none md:text-sm",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Textarea.displayName = "Textarea";

export { Textarea };
