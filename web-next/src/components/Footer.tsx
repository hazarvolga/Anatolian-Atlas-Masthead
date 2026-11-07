"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  Youtube,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { api } from "@/lib/api/client";
import { isDemoMode, siteConfig } from "@/config/site";

const SOCIAL_ICONS: Record<string, React.ComponentType<{ size?: number }>> = {
  facebook: Facebook,
  instagram: Instagram,
  twitter: Twitter,
  linkedin: Linkedin,
  youtube: Youtube,
};

export default function Footer() {
  const { t } = useLanguage();
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

  const socialLinksObj = settings?.social_media_links ?? siteConfig.social;
  const activeSocialLinks = Object.entries(socialLinksObj)
    .filter(
      ([platform, url]) =>
        Boolean(url) && url !== "#" && Boolean(SOCIAL_ICONS[platform])
    )
    .map(([platform, url]) => ({
      platform,
      url,
      Icon: SOCIAL_ICONS[platform],
    }));

  const addressLines = settings?.address
    ? settings.address.split("\n")
    : siteConfig.contact.addressLines;

  return (
    <footer className="bg-card text-card-foreground pt-16 pb-10 border-t border-border">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 mb-14">
          {/* Column 1: Brand & Editorial Statement */}
          <div className="lg:col-span-4 space-y-4">
            <span className="font-serif text-2xl font-medium text-foreground block">
              {settings?.site_title || siteConfig.brand.name}
            </span>
            <p className="text-sm text-text-secondary leading-relaxed max-w-sm">
              {t.footer.description}
            </p>
            {activeSocialLinks.length > 0 && (
              <div className="flex space-x-4 pt-2">
                {activeSocialLinks.map(({ platform, url, Icon }) => (
                  <a
                    key={platform}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-text-secondary hover:text-primary transition-colors"
                    aria-label={
                      platform.charAt(0).toUpperCase() + platform.slice(1)
                    }
                  >
                    <Icon size={18} />
                    <span className="sr-only">{platform}</span>
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Column 2: Atlas Navigation */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="font-sans text-xs font-semibold uppercase tracking-[0.14em] text-text-secondary">
              {t.footer.quickLinks}
            </h4>
            <ul className="space-y-2.5 text-sm">
              {[
                { name: t.nav.home || "Atlas", path: "/" },
                {
                  name:
                    (t.nav as Record<string, string>).destinations ||
                    "Destinations",
                  path: "/destinations",
                },
                { name: t.nav.tours || "Journeys", path: "/tours" },
                { name: t.nav.gallery || "Archive", path: "/gallery" },
                { name: t.nav.contact || "Inquiries", path: "/contact" },
              ].map((link) => (
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

          {/* Column 3: Galata Planning Desk */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-sans text-xs font-semibold uppercase tracking-[0.14em] text-text-secondary">
              {t.footer.contact}
            </h4>
            <ul className="space-y-3 text-sm text-text-secondary">
              <li className="flex items-start">
                <MapPin className="w-4 h-4 mr-2.5 mt-1 text-primary shrink-0" />
                <span>
                  {addressLines.map((line, i) => (
                    <span key={i} className="block">
                      {line}
                    </span>
                  ))}
                </span>
              </li>
              <li className="flex items-center">
                <Phone className="w-4 h-4 mr-2.5 text-primary shrink-0" />
                <span className="tabular-nums">
                  {settings?.contact_phone || siteConfig.contact.phone}
                </span>
              </li>
              <li className="flex items-center">
                <Mail className="w-4 h-4 mr-2.5 text-primary shrink-0" />
                <span>
                  {settings?.contact_email || siteConfig.contact.email}
                </span>
              </li>
            </ul>
          </div>

          {/* Column 4: Seasonal Dispatches */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-sans text-xs font-semibold uppercase tracking-[0.14em] text-text-secondary">
              {t.footer.newsletter}
            </h4>
            <p className="text-sm text-text-secondary leading-relaxed">
              {t.footer.newsletterDesc}
            </p>
            <form
              className="flex flex-col space-y-2.5 pt-1"
              onSubmit={handleNewsletterSubmit}
            >
              <label htmlFor="footer-newsletter-email" className="sr-only">
                {t.footer.yourEmail}
              </label>
              <input
                id="footer-newsletter-email"
                type="email"
                placeholder={t.footer.yourEmail}
                className="rounded-md px-3.5 py-2.5 text-sm bg-background border border-border text-foreground focus:border-primary focus:outline-none"
                value={newsletterEmail}
                onChange={(event) => setNewsletterEmail(event.target.value)}
                required
              />
              <button
                type="submit"
                className="btn-primary w-full py-2.5"
                disabled={isSubscribing}
              >
                {t.footer.subscribe}
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-border pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-text-secondary">
          <p>
            &copy; {currentYear}{" "}
            {settings?.site_title || siteConfig.brand.name}.{" "}
            {t.footer.allRights}
          </p>
          <p className="tracking-wide">
            İstanbul · Cappadocia · Ephesus · Lycian Coast · Pamukkale · Mardin
          </p>
        </div>
      </div>
    </footer>
  );
}
