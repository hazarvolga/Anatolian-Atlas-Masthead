import * as React from "react";
import { cn } from "@/lib/utils";

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "narrow" | "default" | "wide" | "bleed";
}

export function Container({
  size = "default",
  className,
  ...props
}: ContainerProps) {
  return (
    <div
      className={cn(
        "mx-auto w-full",
        size === "narrow" && "max-w-[980px] px-4 sm:px-6 lg:px-8",
        size === "default" && "max-w-[1420px] px-4 sm:px-6 lg:px-10",
        size === "wide" && "max-w-[1680px] px-4 sm:px-8 lg:px-12",
        size === "bleed" && "max-w-none px-0",
        className
      )}
      {...props}
    />
  );
}

export interface Grid12Props extends React.HTMLAttributes<HTMLDivElement> {
  gap?: "none" | "sm" | "default" | "lg";
}

export function Grid12({
  gap = "default",
  className,
  ...props
}: Grid12Props) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 lg:grid-cols-12",
        gap === "none" && "gap-0",
        gap === "sm" && "gap-4 lg:gap-5",
        gap === "default" && "gap-grid-gap",
        gap === "lg" && "gap-8 lg:gap-12",
        className
      )}
      {...props}
    />
  );
}

export interface StackProps extends React.HTMLAttributes<HTMLDivElement> {
  gap?: "xs" | "sm" | "md" | "lg" | "xl";
}

export function Stack({
  gap = "md",
  className,
  ...props
}: StackProps) {
  return (
    <div
      className={cn(
        "flex flex-col",
        gap === "xs" && "gap-2",
        gap === "sm" && "gap-4",
        gap === "md" && "gap-6",
        gap === "lg" && "gap-10",
        gap === "xl" && "gap-16",
        className
      )}
      {...props}
    />
  );
}

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  surface?: "canvas" | "surface" | "muted" | "inverse";
  borderBottom?: boolean;
  spacing?: "default" | "sm" | "none";
}

export function Section({
  surface = "canvas",
  borderBottom = true,
  spacing = "default",
  className,
  ...props
}: SectionProps) {
  return (
    <section
      className={cn(
        surface === "canvas" && "bg-background text-foreground",
        surface === "surface" && "bg-card text-card-foreground",
        surface === "muted" && "bg-surface-container text-foreground",
        surface === "inverse" && "bg-foreground text-background",
        borderBottom && "border-b border-border",
        spacing === "default" && "section",
        spacing === "sm" && "section-sm",
        spacing === "none" && "py-0",
        className
      )}
      {...props}
    />
  );
}

export function Bleed({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen overflow-hidden",
        className
      )}
      {...props}
    />
  );
}

export interface AsideProps extends React.HTMLAttributes<HTMLElement> {
  kicker?: string;
}

export function Aside({
  kicker,
  children,
  className,
  ...props
}: AsideProps) {
  return (
    <aside
      className={cn(
        "border-l border-border pl-5 space-y-2 text-xs text-text-secondary",
        className
      )}
      {...props}
    >
      {kicker && <span className="editorial-kicker block">{kicker}</span>}
      {children}
    </aside>
  );
}
