"use client";


import Link from "next/link";
import { Compass, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSiteSettings } from "@/hooks/useSiteSettings";

export default function NavbarLogo() {
  const { settings, isLoading } = useSiteSettings();

  if (isLoading) {
    // Yüklenirken placeholder göster
    return (
      <div className="flex items-center space-x-4 animate-pulse select-none">
        <div className="w-12 h-12 bg-slate-100 rounded-2xl" />
        <div className="h-6 w-28 bg-slate-100 rounded" />
      </div>
    );
  }

  const hasLogo = !!settings?.site_logo_url;
  const siteTitle = settings?.site_title || "Mare Sereno";
  const siteTagline = settings?.site_tagline || "Premium Travel Experience";

  return (
    <Link href="/" className="flex items-center space-x-4 group">
      <div className="relative">
        {hasLogo ? (
          <div className="w-12 h-12 flex items-center justify-center rounded-2xl overflow-hidden bg-white/80 shadow-lg border border-border/30">
            <img
              src={settings.site_logo_url}
              alt={siteTitle + " Logo"}
              className="object-contain w-10 h-10"
              style={{ maxWidth: "100%", maxHeight: "100%" }}
            />
          </div>
        ) : (
          <div
            className={cn(
              "w-12 h-12 bg-gradient-to-br from-accent-vibrant via-accent-coral to-accent-emerald rounded-2xl flex items-center justify-center shadow-lg transition-all duration-500",
              "group-hover:shadow-2xl group-hover:shadow-accent-vibrant/25 group-hover:scale-105 group-hover:rotate-3"
            )}
          >
            <Compass className="h-7 w-7 text-white group-hover:rotate-12 transition-transform duration-500" />
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-accent-coral rounded-full flex items-center justify-center">
              <Sparkles className="h-2.5 w-2.5 text-white animate-pulse" />
            </div>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-br from-accent-vibrant to-accent-coral rounded-2xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-500" />
      </div>
      <div className="hidden md:block">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-accent-vibrant via-accent-coral to-accent-emerald bg-clip-text text-transparent group-hover:from-accent-coral group-hover:via-accent-vibrant group-hover:to-accent-sky transition-all duration-500">
          {siteTitle}
        </h1>
        {siteTagline && (
          <p className="text-xs text-text-tertiary group-hover:text-accent-vibrant transition-colors duration-300 font-medium">
            {siteTagline}
          </p>
        )}
      </div>
    </Link>
  );
}
