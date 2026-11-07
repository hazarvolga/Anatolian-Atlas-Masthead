import * as React from "react";
import { cn } from "@/lib/utils";

export interface CoordTagProps extends React.HTMLAttributes<HTMLSpanElement> {
  coordinates: string;
  elevation?: string;
  plate?: string;
}

/**
 * Cartographic Coordinate & Elevation Monograph Tag
 * Uses tabular monospace numerals and semantic hairline tokens.
 */
export function CoordTag({
  coordinates,
  elevation,
  plate,
  className,
  ...props
}: CoordTagProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.11em] tabular-nums text-text-secondary border border-border bg-card px-2.5 py-1 rounded-badge",
        className
      )}
      {...props}
    >
      {plate && (
        <>
          <span className="text-primary font-medium">{plate}</span>
          <span className="text-border" aria-hidden="true">
            ·
          </span>
        </>
      )}
      <span>{coordinates}</span>
      {elevation && (
        <>
          <span className="text-border" aria-hidden="true">
            /
          </span>
          <span>{elevation}</span>
        </>
      )}
    </span>
  );
}
