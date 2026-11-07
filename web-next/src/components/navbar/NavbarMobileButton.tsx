"use client";


import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface NavbarMobileButtonProps {
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
}

export default function NavbarMobileButton({ mobileMenuOpen, setMobileMenuOpen }: NavbarMobileButtonProps) {
  return (
    <Button 
      variant="ghost" 
      size="icon" 
      onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
      className={cn(
        "rounded-xl w-12 h-12 transition-all duration-300",
        "hover:bg-accent-vibrant/10 hover:text-accent-vibrant border border-transparent hover:border-accent-vibrant/20",
        mobileMenuOpen ? "bg-accent-vibrant/10 text-accent-vibrant border-accent-vibrant/20" : ""
      )}
    >
      <div className="relative w-6 h-6">
        <Menu className={cn(
          "absolute w-6 h-6 transition-all duration-300",
          mobileMenuOpen ? "rotate-90 scale-0 opacity-0" : "rotate-0 scale-100 opacity-100"
        )} />
        <X className={cn(
          "absolute w-6 h-6 transition-all duration-300",
          mobileMenuOpen ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-0 opacity-0"
        )} />
      </div>
    </Button>
  );
}
