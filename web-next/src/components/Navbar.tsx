"use client";


import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import TopBar from "./navbar/TopBar";
import MainNavigation from "./navbar/MainNavigation";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrolled]);
  
  return (
    <header className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-700 ease-out",
      scrolled 
        ? "glass-navbar shadow-2xl shadow-accent-vibrant/5 border-b border-border/10" 
        : "bg-transparent"
    )}>
      {/* Top Bar - Language, Theme, User Actions */}
      <TopBar />
      
      {/* Main Navigation - Logo, Menu */}
      <MainNavigation />
    </header>
  );
}
