"use client";

import Image from "next/image";
import Link from "next/link";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { useLanguage } from "@/contexts/LanguageContext";
import { siteConfig } from "@/config/site";

export default function NavbarLogo() {
  const { settings } = useSiteSettings();
  const { localizePath } = useLanguage();

  const hasLogo = !!settings?.site_logo_url;
  const siteTitle = settings?.site_title || siteConfig.brand.name;

  return (
    <Link
      href={localizePath("/")}
      className="flex items-center gap-3.5 group focus-visible:outline-none"
    >
      {hasLogo && (
        <div className="w-9 h-9 flex items-center justify-center overflow-hidden bg-card border border-border">
          <Image
            src={settings.site_logo_url}
            alt={`${siteTitle} logo`}
            width={28}
            height={28}
            sizes="28px"
            className="object-contain w-7 h-7"
          />
        </div>
      )}
      <div className="flex flex-col">
        <div className="flex items-baseline gap-2.5">
          <span className="font-serif text-xl md:text-2xl tracking-[-0.03em] text-foreground leading-none">
            {siteTitle}
          </span>
          <span className="hidden xl:inline-block text-[10px] uppercase tracking-[0.18em] text-primary font-semibold tabular-nums">
            ED. IV
          </span>
        </div>
        <span className="text-[10px] uppercase tracking-[0.18em] text-text-secondary mt-1">
          Anatolian Monograph & Field Routes
        </span>
      </div>
    </Link>
  );
}
