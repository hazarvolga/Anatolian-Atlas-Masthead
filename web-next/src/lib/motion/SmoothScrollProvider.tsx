"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useMotionPreference } from "./hooks";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface SmoothScrollContextValue {
  lenis: Lenis | null;
  isSmoothScrollActive: boolean;
}

const SmoothScrollContext = createContext<SmoothScrollContextValue>({
  lenis: null,
  isSmoothScrollActive: false,
});

/**
 * Routes where Lenis smooth scrolling MUST be disabled so native form inputs,
 * tables, date pickers, and multi-step checkout stages behave natively.
 */
export function isLenisExcludedRoute(pathname: string | null): boolean {
  if (!pathname) return false;
  // Strip optional locale prefix (/tr, /es, /it) for future-proof matching
  const normalized = pathname.replace(/^\/(en|tr|es|it)(?=\/|$)/, "") || "/";
  return (
    normalized === "/book" ||
    normalized.startsWith("/book/") ||
    normalized === "/auth" ||
    normalized.startsWith("/auth/") ||
    normalized === "/admin" ||
    normalized.startsWith("/admin/")
  );
}

export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { isMotionEnabled, motionIntensity, smoothScrollEnabled } =
    useMotionPreference();
  const lenisRef = useRef<Lenis | null>(null);
  const [activeLenis, setActiveLenis] = useState<Lenis | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // 1. Respect route exclusions (/book, /auth, /admin)
    if (isLenisExcludedRoute(pathname)) {
      return;
    }

    // 2. Respect reduced motion, motion.level="off", and motion.smoothScroll=false
    if (!isMotionEnabled || !smoothScrollEnabled) {
      return;
    }

    // 3. Respect touch devices: keep 100% native scroll on coarse pointer / touch screens
    const isTouchDevice = window.matchMedia(
      "(hover: none), (pointer: coarse)"
    ).matches;
    if (isTouchDevice) {
      return;
    }

    const lenis = new Lenis({
      duration: motionIntensity === "subtle" ? 0.85 : 1.1,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      syncTouch: false,
      wheelMultiplier: 0.95,
      autoRaf: false,
    });

    lenisRef.current = lenis;
    setActiveLenis(lenis);

    // Bridge Lenis scroll events to GSAP ScrollTrigger
    const onScroll = () => {
      ScrollTrigger.update();
    };
    lenis.on("scroll", onScroll);

    // Drive Lenis from GSAP's unified ticker
    const updateTicker = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(updateTicker);
    gsap.ticker.lagSmoothing(0);

    // Pause Lenis automatically when Radix UI Dialog/Drawer locks body scroll
    const bodyObserver = new MutationObserver(() => {
      const isLocked =
        document.body.hasAttribute("data-scroll-locked") ||
        document.body.style.overflow === "hidden";
      if (isLocked) {
        lenis.stop();
      } else {
        lenis.start();
      }
    });

    bodyObserver.observe(document.body, {
      attributes: true,
      attributeFilter: ["style", "data-scroll-locked"],
    });

    return () => {
      bodyObserver.disconnect();
      lenis.off("scroll", onScroll);
      gsap.ticker.remove(updateTicker);
      lenis.destroy();
      lenisRef.current = null;
      setActiveLenis(null);
    };
  }, [pathname, isMotionEnabled, motionIntensity, smoothScrollEnabled]);

  // Reset scroll position & refresh ScrollTrigger on route transitions
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { immediate: true });
    }
    const timer = window.setTimeout(() => {
      ScrollTrigger.refresh();
    }, 120);
    return () => window.clearTimeout(timer);
  }, [pathname]);

  return (
    <SmoothScrollContext.Provider
      value={{
        lenis: activeLenis,
        isSmoothScrollActive: Boolean(activeLenis),
      }}
    >
      {children}
    </SmoothScrollContext.Provider>
  );
}

export function useSmoothScroll() {
  return useContext(SmoothScrollContext);
}
