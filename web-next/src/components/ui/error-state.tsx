import * as React from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./button";

export interface ErrorStateProps extends React.HTMLAttributes<HTMLDivElement> {
  code?: string;
  title?: string;
  description?: string;
  retryLabel?: string;
  onRetry?: () => void;
}

export function ErrorState({
  code = "ERR — FIELD DISPATCH INTERRUPTED",
  title = "Unable to retrieve archival records",
  description = "A temporary network or server interruption prevented loading this dossier. Please retry or return to the main index.",
  retryLabel = "Retry Dispatch",
  onRetry,
  className,
  ...props
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      className={cn(
        "flex flex-col items-start justify-between gap-6 border border-destructive/40 bg-card p-8 md:p-12 rounded-card",
        className
      )}
      {...props}
    >
      <div className="space-y-3 max-w-xl">
        <div className="flex items-center gap-2.5 text-destructive">
          <AlertTriangle className="h-4 w-4 stroke-[1.25]" aria-hidden="true" />
          <span className="font-mono text-[11px] uppercase tracking-[0.14em]">
            {code}
          </span>
        </div>
        <h3 className="font-serif text-2xl md:text-3xl text-foreground">
          {title}
        </h3>
        <p className="text-sm text-text-secondary leading-relaxed">
          {description}
        </p>
      </div>
      {onRetry && (
        <Button variant="outline" onClick={onRetry}>
          <RotateCcw className="h-3.5 w-3.5 mr-2" />
          {retryLabel}
        </Button>
      )}
    </div>
  );
}
