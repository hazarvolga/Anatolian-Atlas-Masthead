"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useMotionPreference } from "@/lib/motion/hooks";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export interface CountUpStatProps {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  duration?: number;
  className?: string;
}

/**
 * Clean-room first-party GSAP numeric counter for verified factual figures.
 * - Renders the real target number in SSR HTML so search/AI crawlers index the exact figure.
 * - Animates once from 0 -> value when entering the viewport (`tabular-nums`).
 */
export function CountUpStat({
  value,
  prefix = "",
  suffix = "",
  decimals = 0,
  duration = 1.15,
  className = "",
}: CountUpStatProps) {
  const numRef = useRef<HTMLSpanElement | null>(null);
  const { isMotionEnabled, durationScale } = useMotionPreference();

  const formatNumber = (n: number) =>
    n.toLocaleString("en-US", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });

  useEffect(() => {
    const el = numRef.current;
    if (!el) return;

    if (!isMotionEnabled) {
      el.textContent = `${prefix}${formatNumber(value)}${suffix}`;
      return;
    }

    const counter = { current: 0 };
    const ctx = gsap.context(() => {
      gsap.to(counter, {
        current: value,
        duration: duration * durationScale,
        ease: "power2.out",
        scrollTrigger: {
          trigger: el,
          start: "top 90%",
          once: true,
        },
        onUpdate: () => {
          if (numRef.current) {
            numRef.current.textContent = `${prefix}${formatNumber(
              counter.current
            )}${suffix}`;
          }
        },
      });
    }, el);

    return () => ctx.revert();
  }, [value, prefix, suffix, decimals, duration, isMotionEnabled, durationScale]);

  return (
    <span
      ref={numRef}
      className={`tabular-nums ${className}`}
      aria-label={`${prefix}${formatNumber(value)}${suffix}`}
    >
      {prefix}
      {formatNumber(value)}
      {suffix}
    </span>
  );
}
