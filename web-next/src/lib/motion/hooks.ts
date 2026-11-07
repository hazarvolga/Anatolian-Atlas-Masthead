"use client";

import { useEffect, useState, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useDesignSystem } from "@/contexts/DesignSystemContext";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export interface MotionPreference {
  prefersReducedMotion: boolean;
  motionIntensity: "full" | "subtle" | "off";
  smoothScrollEnabled: boolean;
  isMotionEnabled: boolean;
  durationScale: number;
}

/**
 * Central hook that combines OS-level `prefers-reduced-motion: reduce`
 * with `theme.config.ts` `motion.level` ("full" | "subtle" | "off").
 */
export function useMotionPreference(): MotionPreference {
  const { config } = useDesignSystem();
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mq.matches);

    const onChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const motionIntensity = config.motion?.level || "full";
  const smoothScrollEnabled = config.motion?.smoothScroll !== false;
  const isMotionEnabled =
    !prefersReducedMotion && motionIntensity !== "off";
  const durationScale = !isMotionEnabled
    ? 0
    : motionIntensity === "subtle"
      ? 0.65
      : 1;

  return {
    prefersReducedMotion,
    motionIntensity,
    smoothScrollEnabled,
    isMotionEnabled,
    durationScale,
  };
}

export interface RevealOnScrollOptions {
  selector?: string;
  y?: number;
  duration?: number;
  stagger?: number;
  start?: string;
}

/**
 * Reveals child elements matching `selector` once when entering the viewport.
 * Animates only compositor-friendly properties (`opacity`, `y`).
 */
export function useRevealOnScroll<T extends HTMLElement>(
  containerRef: RefObject<T | null>,
  options: RevealOnScrollOptions = {}
) {
  const { isMotionEnabled, durationScale } = useMotionPreference();
  const {
    selector = "[data-reveal]",
    y = 24,
    duration = 0.75,
    stagger = 0.06,
    start = "top 86%",
  } = options;

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      const targets = el.querySelectorAll(selector);
      if (targets.length === 0) return;

      if (!isMotionEnabled) {
        gsap.set(targets, { opacity: 1, y: 0, clearProps: "transform" });
        return;
      }

      gsap.fromTo(
        targets,
        { opacity: 0, y: y * durationScale },
        {
          opacity: 1,
          y: 0,
          duration: duration * durationScale,
          stagger: stagger * durationScale,
          ease: "power3.out",
           clearProps: "willChange",
          scrollTrigger: {
            trigger: el,
            start,
            once: true,
          },
        }
      );
    }, el);

    return () => ctx.revert();
  }, [containerRef, selector, y, duration, stagger, start, isMotionEnabled, durationScale]);
}

/**
 * Subtle vertical parallax scrub on an image inside an overflow-hidden frame.
 * Strictly desktop-only (`min-width: 1024px`) and disabled under reduced motion.
 */
export function useParallaxImage<T extends HTMLElement>(
  imageRef: RefObject<T | null>,
  yPercentDelta = 7
) {
  const { isMotionEnabled, durationScale } = useMotionPreference();

  useEffect(() => {
    const img = imageRef.current;
    if (!img || !isMotionEnabled) return;

    const mm = gsap.matchMedia();
    mm.add(
      "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
      () => {
        const delta = yPercentDelta * durationScale;
        gsap.fromTo(
          img,
          { yPercent: -delta, scale: 1.08 },
          {
            yPercent: delta,
            scale: 1.08,
            ease: "none",
            scrollTrigger: {
              trigger: img.parentElement || img,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          }
        );
      }
    );

    return () => mm.revert();
  }, [imageRef, yPercentDelta, isMotionEnabled, durationScale]);
}

/**
 * Horizontal scroll-pinned gallery/index track.
 * Policy:
 * - NEVER used on Tour Detail (which keeps a vertical, scroll-active itinerary).
 * - Used ONLY on the Regional Gazetteer (Destinations horizontal showcase).
 * - Strictly disabled on mobile/touch (`< 1024px` or `pointer: coarse`).
 */
export function useHorizontalPin<
  TSection extends HTMLElement,
  TTrack extends HTMLElement,
>(
  sectionRef: RefObject<TSection | null>,
  trackRef: RefObject<TTrack | null>,
  enabled = true
) {
  const { isMotionEnabled } = useMotionPreference();

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track || !enabled || !isMotionEnabled) return;

    const mm = gsap.matchMedia();
    mm.add(
      "(min-width: 1024px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
      () => {
        const getScrollDistance = () =>
          Math.max(0, track.scrollWidth - section.clientWidth);

        if (getScrollDistance() <= 24) return;

        gsap.to(track, {
          x: () => -getScrollDistance(),
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top+=72",
            end: () => `+=${getScrollDistance()}`,
            pin: true,
            scrub: 0.6,
            invalidateOnRefresh: true,
          },
        });
      }
    );

    return () => mm.revert();
  }, [sectionRef, trackRef, enabled, isMotionEnabled]);
}

/**
 * Scroll-active vertical step tracker for the Tour Detail Day-by-Day Itinerary.
 * Keeps the itinerary strictly vertical while synchronizing the active day index
 * with the sticky left navigation rail as the user scrolls.
 */
export function useScrollActiveStep<T extends HTMLElement>(
  containerRef: RefObject<T | null>,
  stepSelector: string,
  onActiveChange: (index: number) => void,
  depKey?: unknown
) {
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const ctx = gsap.context(() => {
      const steps = Array.from(container.querySelectorAll<HTMLElement>(stepSelector));
      if (steps.length === 0) return;

      steps.forEach((stepEl, index) => {
        ScrollTrigger.create({
          trigger: stepEl,
          start: "top 45%",
          end: "bottom 45%",
          onEnter: () => onActiveChange(index),
          onEnterBack: () => onActiveChange(index),
        });
      });
    }, container);

    return () => ctx.revert();
  }, [containerRef, stepSelector, onActiveChange, depKey]);
}
