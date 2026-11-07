import * as React from "react";
import { Compass } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./button";

export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  kicker?: string;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  actionHref?: string;
}

export function EmptyState({
  kicker = "Index — 00 Entries",
  title,
  description,
  actionLabel,
  onAction,
  actionHref,
  className,
  ...props
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-start justify-between gap-6 border border-border bg-card p-8 md:p-12 rounded-card",
        className
      )}
      {...props}
    >
      <div className="space-y-3 max-w-xl">
        <div className="flex items-center gap-2.5">
          <Compass className="h-4 w-4 text-primary stroke-[1.25]" aria-hidden="true" />
          <span className="editorial-kicker">{kicker}</span>
        </div>
        <h3 className="font-serif text-2xl md:text-3xl text-foreground">
          {title}
        </h3>
        <p className="text-sm text-text-secondary leading-relaxed">
          {description}
        </p>
      </div>
      {(actionLabel && onAction) || (actionLabel && actionHref) ? (
        <div>
          {actionHref ? (
            <Button asChild variant="outline">
              <a href={actionHref}>{actionLabel}</a>
            </Button>
          ) : (
            <Button variant="outline" onClick={onAction}>
              {actionLabel}
            </Button>
          )}
        </div>
      ) : null}
    </div>
  );
}
