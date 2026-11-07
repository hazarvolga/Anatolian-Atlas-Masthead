"use client";

import { useEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
import { useMotionPreference } from "@/lib/motion/hooks";

export interface MagneticCTAProps {
  children: ReactNode;
  maxShiftPx?: number;
  className?: string;
}

/**
 * Clean-room first-party GSAP magnetic wrapper for the single primary CTA per section.
 * - Uses `gsap.quickTo` for compositor-smooth translation capped at `±maxShiftPx` (default 6px).
 * - Automatically disabled on coarse/touch pointers and when reduced motion is active.
 */
export function MagneticCTA({
  children,
  maxShiftPx = 6,
  className = "inline-block",
}: MagneticCTAProps) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const { isMotionEnabled, durationScale } = useMotionPreference();

  useEffect(() => {
    const el = wrapRef.current;
    if (!el || !isMotionEnabled) return;

    const isFinePointer = window.matchMedia(
      "(hover: hover) and (pointer: fine)"
    ).matches;
    if (!isFinePointer) return;

    const xTo = gsap.quickTo(el, "x", {
      duration: 0.35 * durationScale,
      ease: "power3.out",
    });
    const yTo = gsap.quickTo(el, "y", {
      duration: 0.35 * durationScale,
      ease: "power3.out",
    });

    const onPointerMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const normX = (e.clientX - centerX) / (rect.width / 2 || 1);
      const normY = (e.clientY - centerY) / (rect.height / 2 || 1);

      const clampedX = Math.max(-1, Math.min(1, normX)) * maxShiftPx;
      const clampedY = Math.max(-1, Math.min(1, normY)) * maxShiftPx;
      xTo(clampedX);
      yTo(clampedY);
    };

    const onPointerLeave = () => {
      xTo(0);
      yTo(0);
    };

    el.addEventListener("pointermove", onPointerMove);
    el.addEventListener("pointerleave", onPointerLeave);

    return () => {
      el.removeEventListener("pointermove", onPointerMove);
      el.removeEventListener("pointerleave", onPointerLeave);
      gsap.set(el, { x: 0, y: 0 });
    };
  }, [isMotionEnabled, durationScale, maxShiftPx]);

  return (
    <div ref={wrapRef} className={className}>
      {children}
    </div>
  );
}
