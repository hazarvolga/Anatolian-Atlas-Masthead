"use client";

import { useState } from "react";
import { z } from "zod";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { DesignSystemProvider } from "@/contexts/DesignSystemContext";
import { SmoothScrollProvider } from "@/lib/motion/SmoothScrollProvider";
import { AuthProvider } from "@/contexts/AuthContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import themeConfig from "@/config/theme.config";

// Disable Zod v4 new Function() JIT so strict CSP without 'unsafe-eval' never triggers a violation
if (typeof z.config === "function") {
  z.config({ jitless: true });
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider
        attribute="class"
        defaultTheme={themeConfig.mode}
        enableSystem={false}
      >
        <DesignSystemProvider>
          <LanguageProvider>
            <AuthProvider>
              <TooltipProvider>
                <SmoothScrollProvider>
                  {children}
                </SmoothScrollProvider>
                <Toaster />
                <Sonner />
              </TooltipProvider>
            </AuthProvider>
          </LanguageProvider>
        </DesignSystemProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
