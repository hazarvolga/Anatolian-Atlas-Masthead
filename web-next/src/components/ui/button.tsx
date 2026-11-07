"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-control text-xs font-medium uppercase tracking-[0.14em] ring-offset-background transition-colors duration-sm ease-standard focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground hover:bg-primary-hover",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-foreground/30 bg-transparent text-foreground hover:border-foreground hover:bg-foreground hover:text-background",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-foreground hover:text-background",
        ghost:
          "bg-transparent text-foreground hover:bg-muted",
        accent:
          "bg-accent text-accent-foreground hover:bg-primary-hover",
        neutral:
          "bg-muted text-foreground hover:bg-foreground hover:text-background",
        alert:
          "bg-warning text-warning-foreground hover:bg-warning/90",
        "primary-outline":
          "border border-primary text-primary bg-transparent hover:bg-primary hover:text-primary-foreground",
        "secondary-outline":
          "border border-border text-foreground bg-transparent hover:bg-secondary",
        "accent-outline":
          "border border-accent text-accent bg-transparent hover:bg-accent hover:text-accent-foreground",
        "neutral-outline":
          "border border-border text-text-secondary bg-transparent hover:border-foreground hover:text-foreground",
        "alert-outline":
          "border border-warning text-warning bg-transparent hover:bg-warning hover:text-warning-foreground",
        "primary-ghost":
          "text-primary bg-transparent hover:bg-primary/10",
        "secondary-ghost":
          "text-text-secondary bg-transparent hover:bg-muted hover:text-foreground",
        "accent-ghost":
          "text-accent bg-transparent hover:bg-accent/10",
        "neutral-ghost":
          "text-text-secondary bg-transparent hover:bg-muted",
        "alert-ghost":
          "text-warning bg-transparent hover:bg-warning/10",
        link:
          "text-primary underline-offset-4 hover:underline px-0",
        hero:
          "bg-background/85 text-foreground backdrop-blur-sm border border-border hover:bg-background",
        heroSolid:
          "bg-primary text-primary-foreground hover:bg-primary-hover",
      },
      size: {
        default: "min-h-[2.75rem] px-6 py-3",
        sm: "min-h-[2.25rem] px-4 py-2 text-[11px]",
        lg: "min-h-[3.25rem] px-8 py-4 text-xs",
        xl: "min-h-[3.5rem] px-10 py-4 text-sm",
        icon: "h-11 w-11",
        "icon-sm": "h-9 w-9",
        "icon-lg": "h-12 w-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
