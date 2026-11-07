"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import MainNavigation from "./navbar/MainNavigation";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 8);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-colors duration-200 border-b border-border",
        scrolled
          ? "bg-background/95 backdrop-blur-md"
          : "bg-background"
      )}
    >
      <MainNavigation />
    </header>
  );
}
