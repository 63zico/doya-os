import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-semibold leading-5 transition-colors",
  {
    variants: {
      variant: {
        neutral:
          "border-border bg-muted text-muted-foreground",
        success:
          "border-success/20 bg-success-subtle text-success",
        warning:
          "border-warning/25 bg-warning-subtle text-warning",
        danger:
          "border-danger/25 bg-danger-subtle text-danger",
        ai: "border-ai/25 bg-ai-subtle text-ai",
        outline: "border-border bg-transparent text-muted-foreground",
      },
    },
    defaultVariants: {
      variant: "neutral",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
