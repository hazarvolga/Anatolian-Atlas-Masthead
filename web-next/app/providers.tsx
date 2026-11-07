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
import themeConfig, { type ThemeConfig } from "@/config/theme.config";
import type { SupportedLocale } from "@/lib/i18n/locale-utils";

// Disable Zod v4 new Function() JIT so strict CSP without 'unsafe-eval' never triggers a violation
if (typeof z.config === "function") {
  z.config({ jitless: true });
}

export function Providers({
  children,
  initialLocale = "en",
  initialThemeConfig,
}: {
  children: React.ReactNode;
  initialLocale?: SupportedLocale;
  initialThemeConfig?: ThemeConfig;
}) {
  const [queryClient] = useState(() => new QueryClient());
  const activeTheme = initialThemeConfig || themeConfig;

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider
        attribute="class"
        defaultTheme={activeTheme.mode}
        enableSystem={false}
      >
        <DesignSystemProvider initialConfig={activeTheme}>
          <LanguageProvider initialLocale={initialLocale}>
            <AuthProvider>
              <TooltipProvider>
                <SmoothScrollProvider>{children}</SmoothScrollProvider>
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
