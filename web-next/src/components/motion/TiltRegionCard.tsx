"use client";

import { useEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
import { useMotionPreference } from "@/lib/motion/hooks";

export interface TiltRegionCardProps {
  children: ReactNode;
  maxTiltDeg?: number;
  className?: string;
}

/**
 * Clean-room first-party GSAP micro-tilt wrapper for Regional Gazetteer cards.
 * - Strictly capped at `±maxTiltDeg` (default 3.2deg, well within the 4deg ceiling).
 * - Automatically disabled on touch screens and when reduced motion is active.
 */
export function TiltRegionCard({
  children,
  maxTiltDeg = 3.2,
  className = "",
}: TiltRegionCardProps) {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const { isMotionEnabled, durationScale } = useMotionPreference();

  useEffect(() => {
    const el = cardRef.current;
    if (!el || !isMotionEnabled) return;

    const isFinePointer = window.matchMedia(
      "(hover: hover) and (pointer: fine)"
    ).matches;
    if (!isFinePointer) return;

    gsap.set(el, { transformPerspective: 1000, transformStyle: "preserve-3d" });

    const rotateXTo = gsap.quickTo(el, "rotateX", {
      duration: 0.4 * durationScale,
      ease: "power3.out",
    });
    const rotateYTo = gsap.quickTo(el, "rotateY", {
      duration: 0.4 * durationScale,
      ease: "power3.out",
    });

    const onPointerMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      const relX = (e.clientX - rect.left) / (rect.width || 1) - 0.5;
      const relY = (e.clientY - rect.top) / (rect.height || 1) - 0.5;

      const tiltX = Math.max(-maxTiltDeg, Math.min(maxTiltDeg, -relY * maxTiltDeg * 2));
      const tiltY = Math.max(-maxTiltDeg, Math.min(maxTiltDeg, relX * maxTiltDeg * 2));

      rotateXTo(tiltX);
      rotateYTo(tiltY);
    };

    const onPointerLeave = () => {
      rotateXTo(0);
      rotateYTo(0);
    };

    el.addEventListener("pointermove", onPointerMove);
    el.addEventListener("pointerleave", onPointerLeave);

    return () => {
      el.removeEventListener("pointermove", onPointerMove);
      el.removeEventListener("pointerleave", onPointerLeave);
      gsap.set(el, { rotateX: 0, rotateY: 0, clearProps: "transform" });
    };
  }, [isMotionEnabled, durationScale, maxTiltDeg]);

  return (
    <div ref={cardRef} className={`will-change-transform ${className}`}>
      {children}
    </div>
  );
}
