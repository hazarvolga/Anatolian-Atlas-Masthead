"use client";


import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface NavbarMobileButtonProps {
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
}

export default function NavbarMobileButton({
  mobileMenuOpen,
  setMobileMenuOpen,
}: NavbarMobileButtonProps) {
  return (
    <Button
      variant="ghost"
      size="icon"
      type="button"
      aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
      aria-expanded={mobileMenuOpen}
      aria-controls="mobile-navigation-drawer"
      onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
      className={cn(
        "rounded-control w-11 h-11 transition-all duration-200",
        "hover:bg-surface-container border border-border/70 hover:border-foreground",
        mobileMenuOpen ? "bg-surface-container border-foreground" : ""
      )}
    >
      <div className="relative w-6 h-6" aria-hidden="true">
        <Menu
          className={cn(
            "absolute w-6 h-6 transition-all duration-300",
            mobileMenuOpen
              ? "rotate-90 scale-0 opacity-0"
              : "rotate-0 scale-100 opacity-100"
          )}
        />
        <X
          className={cn(
            "absolute w-6 h-6 transition-all duration-300",
            mobileMenuOpen
              ? "rotate-0 scale-100 opacity-100"
              : "-rotate-90 scale-0 opacity-0"
          )}
        />
      </div>
    </Button>
  );
}
