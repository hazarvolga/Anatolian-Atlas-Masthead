"use client";


import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const isDarkMode = localStorage.getItem("theme") === "dark" || 
      (!localStorage.getItem("theme") && window.matchMedia("(prefers-color-scheme: dark)").matches);
    
    setIsDark(isDarkMode);
    
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleTheme = () => {
    setIsDark(!isDark);
    
    if (isDark) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="relative rounded-xl w-10 h-10 transition-all duration-300 hover:bg-accent-vibrant/10 hover:text-accent-vibrant border border-transparent hover:border-accent-vibrant/20 hover:shadow-lg hover:shadow-accent-vibrant/10"
    >
      <div className="relative w-5 h-5 overflow-hidden">
        <Sun className={`absolute w-5 h-5 transition-all duration-500 ${
          isDark 
            ? 'rotate-90 scale-0 opacity-0' 
            : 'rotate-0 scale-100 opacity-100'
        }`} />
        <Moon className={`absolute w-5 h-5 transition-all duration-500 ${
          isDark 
            ? 'rotate-0 scale-100 opacity-100' 
            : '-rotate-90 scale-0 opacity-0'
        }`} />
      </div>
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
