"use client";

import Link from "next/link";
import { Compass } from "lucide-react";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { siteConfig } from "@/config/site";

export default function NavbarLogo() {
  const { settings } = useSiteSettings();

  const hasLogo = !!settings?.site_logo_url;
  const siteTitle = settings?.site_title || siteConfig.brand.name;
  const siteTagline = settings?.site_tagline || siteConfig.brand.tagline;

  return (
    <Link href="/" className="flex items-center space-x-3 group">
      {hasLogo ? (
        <div className="w-10 h-10 flex items-center justify-center rounded-md overflow-hidden bg-card border border-border">
          <img
            src={settings.site_logo_url}
            alt={`${siteTitle} logo`}
            className="object-contain w-8 h-8"
          />
        </div>
      ) : (
        <div className="w-9 h-9 rounded-md bg-foreground text-background flex items-center justify-center transition-colors duration-200 group-hover:bg-primary group-hover:text-primary-foreground">
          <Compass className="h-5 w-5" />
        </div>
      )}
      <div className="flex flex-col">
        <span className="font-serif text-xl md:text-2xl font-medium tracking-tight text-foreground leading-none">
          {siteTitle}
        </span>
        {siteTagline && (
          <span className="text-[11px] uppercase tracking-[0.12em] text-text-secondary mt-1 hidden sm:inline">
            {siteTagline}
          </span>
        )}
      </div>
    </Link>
  );
}
