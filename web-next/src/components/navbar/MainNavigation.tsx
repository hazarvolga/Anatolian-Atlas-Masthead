"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, LogOut, User } from "lucide-react";
import NavbarLogo from "./NavbarLogo";
import NavbarDesktopNav from "./NavbarDesktopNav";
import NavbarMobileButton from "./NavbarMobileButton";
import NavbarMobileMenu from "./NavbarMobileMenu";
import LanguageSelector from "@/components/LanguageSelector";
import ThemeToggle from "@/components/ThemeToggle";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { useDesignSystem } from "@/contexts/DesignSystemContext";
import { useIsAdmin } from "@/hooks/useUserRole";
import { siteConfig } from "@/config/site.config";

export default function MainNavigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { t, localizePath } = useLanguage();
  const pathname = usePathname();
  const { user, signOut } = useAuth();
  const { config, concept } = useDesignSystem();
  const isAdmin = useIsAdmin();

  const headerVariant = config.layout.header;

  const navLinks = [
    { index: "01", name: t.nav.home || "Atlas", path: "/" },
    {
      index: "02",
      name: (t.nav as Record<string, string>).destinations || "Regions",
      path: "/destinations",
    },
    { index: "03", name: t.nav.tours || "Journeys", path: "/tours" },
    { index: "04", name: "Journal", path: "/journal" },
    { index: "05", name: t.nav.gallery || "Archive", path: "/gallery" },
    { index: "06", name: t.nav.contact || "Inquiries", path: "/contact" },
  ];

  // Variant C: Minimal Overlay Header (`aegean-linen` default — airy, borderless, soft pill CTA)
  if (headerVariant === "minimal-overlay") {
    return (
      <>
        <div
          data-header-variant="minimal-overlay"
          className="container flex items-center justify-between h-20 md:h-24"
        >
          {/* Left: Clean Contemporary Wordmark without grid hairlines */}
          <div className="flex items-center">
            <Link
              href={localizePath("/")}
              className="group flex flex-col focus-visible:outline-none"
            >
              <span className="font-serif text-2xl md:text-3xl tracking-[-0.02em] text-foreground leading-none">
                {siteConfig.brand.name}
              </span>
              <span className="text-[11px] tracking-[0.08em] text-text-secondary mt-1">
                {concept.voice.eyebrowPrefix} · Aegean &amp; Mediterranean
              </span>
            </Link>
          </div>

          {/* Center-Right: Borderless Airy Navigation Links (No Index Numbers) */}
          <nav
            aria-label="Primary navigation"
            className="hidden lg:flex items-center gap-8"
          >
            {navLinks.map((link) => {
              const isActive =
                link.path === "/"
                  ? pathname === "/"
                  : pathname?.startsWith(link.path);
              return (
                <Link
                  key={link.path}
                  href={localizePath(link.path)}
                  className={`text-sm tracking-[0.04em] transition-colors py-1.5 ${
                    isActive
                      ? "text-primary font-semibold border-b-2 border-primary"
                      : "text-text-secondary hover:text-foreground"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Right: Soft Pill CTA & Controls */}
          <div className="hidden lg:flex items-center gap-3">
            <LanguageSelector />
            <ThemeToggle />
            <Link
              href={localizePath("/tours")}
              className="px-6 py-2.5 rounded-full bg-primary text-primary-foreground hover:bg-primary-hover text-xs font-medium tracking-[0.08em] transition-colors inline-flex items-center gap-1.5"
            >
              <span>{concept.voice.ctaPrimaryVerb}</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {/* Mobile Trigger */}
          <div className="flex items-center lg:hidden">
            <NavbarMobileButton
              mobileMenuOpen={mobileMenuOpen}
              setMobileMenuOpen={setMobileMenuOpen}
            />
          </div>
        </div>

        <NavbarMobileMenu
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
        />
      </>
    );
  }

  // Variant B: Symmetrical Centered Salon Header (`ottoman-noir` default — split nav + centered crest)
  if (headerVariant === "centered-logo") {
    const leftLinks = navLinks.slice(0, 3);
    const rightLinks = navLinks.slice(3, 6);

    return (
      <>
        <div
          data-header-variant="centered-logo"
          className="border-b border-border/70 bg-card/60 hidden md:block"
        >
          <div className="container py-1.5 flex items-center justify-between text-[10px] font-mono uppercase tracking-[0.2em] text-text-secondary">
            <span>
              {siteConfig.contact.coordinates
                ? `${siteConfig.contact.coordinates} · GALATA SALON`
                : "PRIVATE EVENING SALON · GALATA, İSTANBUL"}
            </span>
            <span className="text-primary">
              ✦ {concept.voice.eyebrowPrefix} ✦
            </span>
            <span>
              {siteConfig.brand.tursabLicenseNo
                ? `TÜRSAB LIC. ${siteConfig.brand.tursabLicenseNo}`
                : "BY PRIVATE APPOINTMENT"}
            </span>
          </div>
        </div>

        <div className="container grid grid-cols-12 items-center h-20 md:h-24">
          {/* Left 4 Columns: First 3 Nav Links */}
          <nav
            aria-label="Primary navigation left"
            className="col-span-4 hidden lg:flex items-center justify-start gap-6"
          >
            {leftLinks.map((link) => {
              const isActive =
                link.path === "/"
                  ? pathname === "/"
                  : pathname?.startsWith(link.path);
              return (
                <Link
                  key={link.path}
                  href={localizePath(link.path)}
                  className={`text-xs uppercase tracking-[0.18em] transition-colors ${
                    isActive
                      ? "text-primary font-semibold"
                      : "text-text-secondary hover:text-foreground"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Center 4 Columns: Symmetrical Monumental Crest */}
          <div className="col-span-8 lg:col-span-4 flex flex-col items-start lg:items-center justify-center text-left lg:text-center">
            <Link
              href={localizePath("/")}
              className="group inline-flex flex-col lg:items-center focus-visible:outline-none"
            >
              <span className="text-[9px] font-mono uppercase tracking-[0.26em] text-primary mb-0.5">
                ✦ ANATOLIAN CHRONICLE ✦
              </span>
              <span className="font-serif text-2xl md:text-3xl tracking-[0.04em] uppercase text-foreground leading-none">
                {siteConfig.brand.name}
              </span>
            </Link>
          </div>

          {/* Right 4 Columns: Remaining Nav Links + Salon Controls */}
          <div className="col-span-4 hidden lg:flex items-center justify-end gap-5">
            <nav
              aria-label="Primary navigation right"
              className="flex items-center gap-5"
            >
              {rightLinks.map((link) => {
                const isActive = pathname?.startsWith(link.path);
                return (
                  <Link
                    key={link.path}
                    href={localizePath(link.path)}
                    className={`text-xs uppercase tracking-[0.18em] transition-colors ${
                      isActive
                        ? "text-primary font-semibold"
                        : "text-text-secondary hover:text-foreground"
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </nav>
            <div className="flex items-center gap-2 pl-3 border-l border-border">
              <LanguageSelector />
              <ThemeToggle />
            </div>
          </div>

          <div className="col-span-4 flex items-center justify-end lg:hidden">
            <NavbarMobileButton
              mobileMenuOpen={mobileMenuOpen}
              setMobileMenuOpen={setMobileMenuOpen}
            />
          </div>
        </div>

        <NavbarMobileMenu
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
        />
      </>
    );
  }

  // Variant A (Default): Swiss Bar Header (`atlas-editorial` default — 12-col hairline cells + index numbers)
  return (
    <>
      <div
        data-header-variant="swiss-bar"
        className="container flex items-stretch justify-between h-16 md:h-20"
      >
        {/* Left Cell: Editorial Masthead Wordmark */}
        <div className="flex items-center pr-6">
          <NavbarLogo />
        </div>

        {/* Center Cell: Swiss Grid Indexed Navigation */}
        <div className="hidden lg:flex items-stretch">
          <NavbarDesktopNav />
        </div>

        {/* Right Cell: Language, Account & Direct Route Action */}
        <div className="hidden lg:flex items-center gap-3 pl-6">
          <LanguageSelector />
          <ThemeToggle />

          {user ? (
            <div className="flex items-center gap-2 pl-2 border-l border-border">
              <Link
                href="/my-reservations"
                className="px-3 py-2 text-[11px] uppercase tracking-[0.13em] font-medium text-foreground hover:text-primary transition-colors"
              >
                {t.nav.myBookings || "Dossier"}
              </Link>
              {isAdmin && (
                <Link
                  href="/admin"
                  className="px-2.5 py-1.5 text-[11px] uppercase tracking-[0.13em] font-semibold bg-foreground text-background hover:bg-primary transition-colors"
                >
                  Desk
                </Link>
              )}
              <Link
                href="/profile"
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 border border-border bg-card text-xs text-foreground hover:border-foreground transition-colors"
                title={user.email}
              >
                <User className="h-3.5 w-3.5 text-primary" />
                <span className="max-w-24 truncate text-[11px]">
                  {user.email.split("@")[0]}
                </span>
              </Link>
              <button
                type="button"
                onClick={() => signOut()}
                className="p-2 text-text-secondary hover:text-destructive transition-colors"
                aria-label="Sign Out"
              >
                <LogOut className="h-3.5 w-3.5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3 pl-2 border-l border-border">
              <Link
                href="/auth"
                className="px-3 py-2 text-[11px] uppercase tracking-[0.14em] font-medium text-text-secondary hover:text-foreground transition-colors"
              >
                {t.nav.signIn || "Sign In"}
              </Link>
              <Link
                href="/tours"
                className="btn-primary py-3 px-5 inline-flex items-center gap-2"
              >
                <span>{t.nav.bookNow || "All Routes"}</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Trigger */}
        <div className="flex items-center lg:hidden">
          <NavbarMobileButton
            mobileMenuOpen={mobileMenuOpen}
            setMobileMenuOpen={setMobileMenuOpen}
          />
        </div>
      </div>

      <NavbarMobileMenu
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />
    </>
  );
}
