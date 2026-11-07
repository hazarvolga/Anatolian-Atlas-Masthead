"use client";

import { useEffect, useRef, type ElementType } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useMotionPreference } from "@/lib/motion/hooks";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export interface SplitTextHeadingProps {
  text: string;
  as?: ElementType;
  className?: string;
  stagger?: number;
  duration?: number;
  delay?: number;
}

/**
 * Clean-room first-party GSAP masked word reveal for H1/H2 editorial headings.
 * - Preserves full screen-reader accessibility via `aria-label` on the heading element.
 * - Splits words into overflow-hidden masks and animates `yPercent: 105 -> 0` once on scroll.
 * - Respects `prefers-reduced-motion: reduce` and `theme.config` `motionIntensity`.
 */
export function SplitTextHeading({
  text,
  as: Tag = "h1",
  className = "",
  stagger = 0.035,
  duration = 0.85,
  delay = 0,
}: SplitTextHeadingProps) {
  const headingRef = useRef<HTMLElement | null>(null);
  const { isMotionEnabled, durationScale } = useMotionPreference();
  const words = text.trim().split(/\s+/);

  useEffect(() => {
    const el = headingRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      const innerWords = el.querySelectorAll<HTMLElement>("[data-split-word]");
      if (innerWords.length === 0) return;

      if (!isMotionEnabled) {
        gsap.set(innerWords, { yPercent: 0, opacity: 1 });
        return;
      }

      gsap.fromTo(
        innerWords,
        { yPercent: 106, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          duration: duration * durationScale,
          stagger: stagger * durationScale,
          delay: delay * durationScale,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 88%",
            once: true,
          },
        }
      );
    }, el);

    return () => ctx.revert();
  }, [text, isMotionEnabled, durationScale, duration, stagger, delay]);

  return (
    <Tag ref={headingRef} aria-label={text} className={className}>
      {words.map((word, index) => (
        <span
          key={`${word}-${index}`}
          aria-hidden="true"
          className="inline-block overflow-hidden align-bottom pb-[0.08em] -mb-[0.08em]"
        >
          <span
            data-split-word
            className="inline-block will-change-transform"
          >
            {word}
            {index < words.length - 1 ? "\u00A0" : ""}
          </span>
        </span>
      ))}
    </Tag>
  );
}
