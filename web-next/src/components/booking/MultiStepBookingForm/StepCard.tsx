"use client";

import { ReactNode } from "react";

interface StepCardProps {
  stepNumber: number;
  stepTitle: string;
  children: ReactNode;
}

export default function StepCard({
  stepNumber,
  stepTitle,
  children,
}: StepCardProps) {
  return (
    <div className="mb-8 border border-border bg-card">
      <div className="px-6 py-4 border-b border-border bg-background/60 flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-[0.16em] text-primary tabular-nums">
          STAGE 0{stepNumber} — {stepTitle}
        </span>
        <span className="text-[11px] uppercase tracking-[0.14em] text-text-secondary">
          MANIFEST ENTRY
        </span>
      </div>
      <div className="p-6 sm:p-8">{children}</div>
    </div>
  );
}
