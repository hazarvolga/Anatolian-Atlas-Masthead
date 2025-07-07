
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98] [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm hover:shadow-md",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-sm hover:shadow-md",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground shadow-sm hover:shadow-md",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-sm hover:shadow-md",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        // Custom palette variants
        accent: "bg-accent text-accent-foreground hover:bg-accent/90 shadow-sm hover:shadow-md",
        neutral: "bg-neutral text-neutral-foreground hover:bg-neutral/90 shadow-sm hover:shadow-md",
        alert: "bg-alert text-alert-foreground hover:bg-alert/90 shadow-sm hover:shadow-md",
        // Outline variants for custom palette
        "primary-outline": "border border-primary text-primary bg-transparent hover:bg-primary hover:text-primary-foreground",
        "secondary-outline": "border border-secondary text-secondary bg-transparent hover:bg-secondary hover:text-secondary-foreground",
        "accent-outline": "border border-accent text-accent bg-transparent hover:bg-accent hover:text-accent-foreground",
        "neutral-outline": "border border-neutral text-neutral bg-transparent hover:bg-neutral hover:text-neutral-foreground",
        "alert-outline": "border border-alert text-alert bg-transparent hover:bg-alert hover:text-alert-foreground",
        // Ghost variants for custom palette
        "primary-ghost": "text-primary bg-transparent hover:bg-primary/10",
        "secondary-ghost": "text-secondary bg-transparent hover:bg-secondary/10",
        "accent-ghost": "text-accent bg-transparent hover:bg-accent/10",
        "neutral-ghost": "text-neutral bg-transparent hover:bg-neutral/10",
        "alert-ghost": "text-alert bg-transparent hover:bg-alert/10",
        link: "text-primary underline-offset-4 hover:underline",
        // Legacy variants for backward compatibility
        hero: "bg-white/20 text-white backdrop-blur-sm border border-white/30 hover:bg-white/30 dark:bg-black/30 dark:border-white/10 dark:hover:bg-black/40 transition-all duration-300 shadow-lg hover:shadow-xl",
        heroSolid: "bg-sea text-white hover:bg-sea-dark dark:bg-sea-dark dark:hover:bg-sea transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02]"
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-12 rounded-lg px-8 text-base",
        xl: "h-14 rounded-lg px-10 text-lg",
        icon: "h-10 w-10",
        "icon-sm": "h-8 w-8",
        "icon-lg": "h-12 w-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
