"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import TopBar from "./navbar/TopBar";
import MainNavigation from "./navbar/MainNavigation";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 12);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-colors duration-200 border-b",
        scrolled
          ? "bg-background/95 backdrop-blur-md border-border shadow-sm"
          : "bg-background/90 backdrop-blur-sm border-border/70"
      )}
    >
      <TopBar />
      <MainNavigation />
    </header>
  );
}
