"use client";

import { useEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
import { useMotionPreference } from "@/lib/motion/hooks";

export interface SpotlightTourCardProps {
  children: ReactNode;
  className?: string;
}

/**
 * Clean-room first-party GSAP warm-paper radial spotlight wrapper for TourCard.
 * - Uses GSAP quickTo to interpolate `--spot-x` and `--spot-y` CSS custom properties.
 * - Zero `<canvas>`, zero WebGL, and zero layout thrashing.
 */
export function SpotlightTourCard({
  children,
  className = "",
}: SpotlightTourCardProps) {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const { isMotionEnabled } = useMotionPreference();

  useEffect(() => {
    const card = cardRef.current;
    const overlay = overlayRef.current;
    if (!card || !overlay || !isMotionEnabled) return;

    const isFinePointer = window.matchMedia(
      "(hover: hover) and (pointer: fine)"
    ).matches;
    if (!isFinePointer) return;

    const coords = { x: 0, y: 0 };
    const xTo = gsap.quickTo(coords, "x", {
      duration: 0.25,
      ease: "power2.out",
      onUpdate: () => {
        overlay.style.setProperty("--spot-x", `${coords.x.toFixed(1)}px`);
      },
    });
    const yTo = gsap.quickTo(coords, "y", {
      duration: 0.25,
      ease: "power2.out",
      onUpdate: () => {
        overlay.style.setProperty("--spot-y", `${coords.y.toFixed(1)}px`);
      },
    });

    const onPointerEnter = (e: PointerEvent) => {
      const rect = card.getBoundingClientRect();
      coords.x = e.clientX - rect.left;
      coords.y = e.clientY - rect.top;
      overlay.style.setProperty("--spot-x", `${coords.x}px`);
      overlay.style.setProperty("--spot-y", `${coords.y}px`);
      gsap.to(overlay, { opacity: 1, duration: 0.28, ease: "power2.out" });
    };

    const onPointerMove = (e: PointerEvent) => {
      const rect = card.getBoundingClientRect();
      xTo(e.clientX - rect.left);
      yTo(e.clientY - rect.top);
    };

    const onPointerLeave = () => {
      gsap.to(overlay, { opacity: 0, duration: 0.35, ease: "power2.out" });
    };

    card.addEventListener("pointerenter", onPointerEnter);
    card.addEventListener("pointermove", onPointerMove);
    card.addEventListener("pointerleave", onPointerLeave);

    return () => {
      card.removeEventListener("pointerenter", onPointerEnter);
      card.removeEventListener("pointermove", onPointerMove);
      card.removeEventListener("pointerleave", onPointerLeave);
    };
  }, [isMotionEnabled]);

  return (
    <div ref={cardRef} className={`relative ${className}`}>
      <div
        ref={overlayRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-10 opacity-0 transition-opacity"
        style={{
          background:
            "radial-gradient(380px circle at var(--spot-x, 50%) var(--spot-y, 50%), hsl(var(--primary) / 0.085), transparent 72%)",
        }}
      />
      {children}
    </div>
  );
}
