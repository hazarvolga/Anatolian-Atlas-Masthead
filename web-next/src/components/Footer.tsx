"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import { useDesignSystem } from "@/contexts/DesignSystemContext";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { api } from "@/lib/api/client";
import { isDemoMode, siteConfig } from "@/config/site";

export default function Footer() {
  const { t } = useLanguage();
  const { config } = useDesignSystem();
  const currentYear = new Date().getFullYear();
  const { settings } = useSiteSettings();
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [isSubscribing, setIsSubscribing] = useState(false);

  const handleNewsletterSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    const email = newsletterEmail.trim();
    if (!email || isSubscribing) return;

    setIsSubscribing(true);
    try {
      if (isDemoMode()) {
        toast.success(t.footer.subscribeSuccess);
        setNewsletterEmail("");
        return;
      }
      await api.post("/api/email-subscriptions", {
        email,
        subscription_type: "newsletter",
        source: "footer",
      });
      toast.success(t.footer.subscribeSuccess);
      setNewsletterEmail("");
    } catch {
      toast.success(t.footer.subscribeSuccess);
      setNewsletterEmail("");
    } finally {
      setIsSubscribing(false);
    }
  };

  const addressLines = settings?.address
    ? settings.address.split("\n")
    : siteConfig.contact.addressLines;

  const navLinks = [
    { name: t.nav.home || "Atlas", path: "/" },
    {
      name: (t.nav as Record<string, string>).destinations || "Regions",
      path: "/destinations",
    },
    { name: t.nav.tours || "Journeys", path: "/tours" },
    { name: t.nav.gallery || "Archive", path: "/gallery" },
    { name: t.nav.contact || "Inquiries", path: "/contact" },
  ];

  // Variant B: Big Wordmark Monumental Footer
  if (config.layout.footer === "big-wordmark") {
    return (
      <footer className="bg-background text-foreground border-t border-border">
        <div className="container py-14 space-y-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 pb-12 border-b border-border">
            <div className="lg:col-span-5 space-y-4">
              <span className="editorial-kicker block">
                GALATA PLANNING DESK · {siteConfig.contact.coordinates}
              </span>
              <p className="text-sm text-text-secondary max-w-md leading-relaxed">
                {t.footer.description}
              </p>
              <p className="font-mono text-xs text-foreground">
                {settings?.contact_phone || siteConfig.contact.phone} ·{" "}
                {settings?.contact_email || siteConfig.contact.email}
              </p>
            </div>

            <div className="lg:col-span-3 space-y-3">
              <span className="editorial-meta block">Index</span>
              <ul className="space-y-2 text-xs uppercase tracking-[0.13em]">
                {navLinks.map((link) => (
                  <li key={link.path}>
                    <Link
                      href={link.path}
                      className="text-text-secondary hover:text-foreground transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="lg:col-span-4 space-y-3">
              <span className="editorial-meta block">
                {t.footer.newsletter}
              </span>
              <form className="flex gap-2" onSubmit={handleNewsletterSubmit}>
                <label htmlFor="wordmark-newsletter-email" className="sr-only">
                  {t.footer.yourEmail}
                </label>
                <input
                  id="wordmark-newsletter-email"
                  type="email"
                  placeholder={t.footer.yourEmail}
                  className="flex-1 px-3.5 py-2.5 text-xs bg-card border border-border rounded-control text-foreground focus:border-foreground focus:outline-none"
                  value={newsletterEmail}
                  onChange={(event) => setNewsletterEmail(event.target.value)}
                  required
                />
                <button
                  type="submit"
                  className="btn-primary py-2.5 px-5"
                  disabled={isSubscribing}
                >
                  <span>{t.footer.subscribe}</span>
                </button>
              </form>
            </div>
          </div>

          <div className="pt-2">
            <p
              aria-hidden="true"
              className="font-serif text-[clamp(2.8rem,9.2vw,8.5rem)] leading-[0.88] tracking-[-0.04em] text-foreground/90 select-none uppercase text-center"
            >
              {siteConfig.brand.shortName}
            </p>
          </div>

          <div className="pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] uppercase tracking-[0.14em] text-text-secondary tabular-nums">
            <p>
              &copy; {currentYear}{" "}
              {settings?.site_title || siteConfig.brand.name}.{" "}
              {t.footer.allRights}
            </p>
            <p>
              İSTANBUL · CAPPADOCIA · EPHESUS · LYCIA · PAMUKKALE · MARDİN
            </p>
          </div>
        </div>
      </footer>
    );
  }

  // Variant A (Default): Swiss Atlas Columns
  return (
    <footer className="bg-background text-foreground border-t border-border">
      <div className="container">
        {/* Swiss Grid Monograph Colophon */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 border-x border-b border-border divide-y md:divide-y-0 md:divide-x divide-border">
          {/* Column 1 (4 cols): Masthead & Colophon Note */}
          <div className="lg:col-span-4 p-8 sm:p-10 flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <span className="text-[10px] uppercase tracking-[0.18em] text-primary font-semibold block">
                COLOPHON — EDITION IV
              </span>
              <span className="font-serif text-2xl sm:text-3xl text-foreground block tracking-tight">
                {settings?.site_title || siteConfig.brand.name}
              </span>
              <p className="text-xs sm:text-sm text-text-secondary leading-relaxed max-w-sm">
                {t.footer.description}
              </p>
            </div>
            <div className="text-[11px] uppercase tracking-[0.14em] text-text-secondary tabular-nums">
              PUBLISHED IN GALATA, İSTANBUL
            </div>
          </div>

          {/* Column 2 (2 cols): Index Navigation */}
          <div className="lg:col-span-2 p-8 sm:p-10 space-y-4">
            <h4 className="font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">
              01 / {t.footer.quickLinks}
            </h4>
            <ul className="space-y-2.5 text-xs uppercase tracking-[0.13em]">
              {navLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    href={link.path}
                    className="text-text-secondary hover:text-foreground transition-colors inline-flex items-center gap-1"
                  >
                    <span>{link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 (3 cols): Galata Dispatch Coordinates */}
          <div className="lg:col-span-3 p-8 sm:p-10 space-y-4">
            <h4 className="font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">
              02 / {t.footer.contact}
            </h4>
            <div className="space-y-3 text-xs text-text-secondary leading-relaxed tabular-nums">
              <p className="text-foreground font-medium">
                {addressLines.map((line, i) => (
                  <span key={i} className="block">
                    {line}
                  </span>
                ))}
              </p>
              <p>
                <span className="uppercase tracking-[0.14em] text-[10px] text-text-tertiary block">
                  TEL
                </span>
                <span className="text-foreground">
                  {settings?.contact_phone || siteConfig.contact.phone}
                </span>
              </p>
              <p>
                <span className="uppercase tracking-[0.14em] text-[10px] text-text-tertiary block">
                  MAIL
                </span>
                <span className="text-foreground">
                  {settings?.contact_email || siteConfig.contact.email}
                </span>
              </p>
            </div>
          </div>

          {/* Column 4 (3 cols): Seasonal Monograph Dispatches */}
          <div className="lg:col-span-3 p-8 sm:p-10 space-y-4 bg-card/50">
            <h4 className="font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">
              03 / {t.footer.newsletter}
            </h4>
            <p className="text-xs text-text-secondary leading-relaxed">
              {t.footer.newsletterDesc}
            </p>
            <form
              className="space-y-2.5 pt-2"
              onSubmit={handleNewsletterSubmit}
            >
              <label htmlFor="footer-newsletter-email" className="sr-only">
                {t.footer.yourEmail}
              </label>
              <input
                id="footer-newsletter-email"
                type="email"
                placeholder={t.footer.yourEmail}
                className="w-full px-3.5 py-3 text-xs bg-background border border-border text-foreground focus:border-foreground focus:outline-none rounded-control"
                value={newsletterEmail}
                onChange={(event) => setNewsletterEmail(event.target.value)}
                required
              />
              <button
                type="submit"
                className="btn-primary w-full py-3"
                disabled={isSubscribing}
              >
                <span>{t.footer.subscribe}</span>
                <ArrowUpRight className="h-3.5 w-3.5 ml-1.5" />
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Copyright & Regional Strip */}
        <div className="py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] uppercase tracking-[0.14em] text-text-secondary tabular-nums">
          <p>
            &copy; {currentYear}{" "}
            {settings?.site_title || siteConfig.brand.name}.{" "}
            {t.footer.allRights}
          </p>
          <p>
            İSTANBUL · CAPPADOCIA · EPHESUS · LYCIA · PAMUKKALE · MARDİN
          </p>
        </div>
      </div>
    </footer>
  );
}
