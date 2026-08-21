import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const alertVariants = cva(
  "relative w-full rounded-lg border-2 px-5 py-4 text-sm shadow-sm transition-all duration-200 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-5 [&>svg]:top-5 [&>svg]:text-current [&>svg]:w-5 [&>svg]:h-5 [&>svg~*]:pl-9",
  {
    variants: {
      variant: {
        default: "bg-background border-border text-text-primary",
        destructive:
          "border-error/40 bg-error/5 text-error [&>svg]:text-error",
        warning:
          "border-warning/40 bg-warning/5 text-warning [&>svg]:text-warning",
        success:
          "border-accent-cyan/40 bg-accent-cyan/5 text-accent-cyan [&>svg]:text-accent-cyan",
        info:
          "border-accent-cyan/40 bg-accent-cyan/5 text-accent-cyan [&>svg]:text-accent-cyan",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

const Alert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>
>(({ className, variant, ...props }, ref) => (
  <div ref={ref} role="alert" className={cn(alertVariants({ variant }), className)} {...props} />
));
Alert.displayName = "Alert";

const AlertTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h5
      ref={ref}
      className={cn("mb-2 font-semibold leading-none tracking-tight text-base", className)}
      {...props}
    />
  ),
);
AlertTitle.displayName = "AlertTitle";

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("text-sm [&_p]:leading-relaxed", className)} {...props} />
));
AlertDescription.displayName = "AlertDescription";

export { Alert, AlertTitle, AlertDescription };
