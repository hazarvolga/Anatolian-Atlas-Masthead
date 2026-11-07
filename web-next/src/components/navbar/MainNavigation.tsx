"use client";

import { useState } from "react";
import Link from "next/link";
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
  const { t } = useLanguage();
  const { user, signOut } = useAuth();
  const { config } = useDesignSystem();
  const isAdmin = useIsAdmin();

  const headerVariant = config.layout.header;

  // Variant B: Centered Editorial Masthead Header
  if (headerVariant === "centered-logo") {
    return (
      <>
        <div className="border-b border-border/60 bg-surface-container/40 hidden md:block">
          <div className="container py-1.5 flex items-center justify-between text-[10px] font-mono uppercase tracking-[0.15em] text-text-secondary">
            <span>{siteConfig.contact.coordinates} · GALATA DESK</span>
            <span>{siteConfig.brand.tagline}</span>
            <span>TÜRSAB LIC. {siteConfig.brand.tursabLicenseNo}</span>
          </div>
        </div>
        <div className="container grid grid-cols-12 items-center h-16 md:h-20">
          <div className="col-span-4 hidden lg:flex items-stretch">
            <NavbarDesktopNav />
          </div>
          <div className="col-span-6 lg:col-span-4 flex items-center lg:justify-center">
            <NavbarLogo />
          </div>
          <div className="col-span-6 lg:col-span-4 flex items-center justify-end gap-2.5">
            <div className="hidden lg:flex items-center gap-2.5">
              <LanguageSelector />
              <ThemeToggle />
              <Link
                href="/tours"
                className="btn-primary py-2.5 px-4 inline-flex items-center gap-1.5"
              >
                <span>{t.nav.bookNow || "All Routes"}</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            <div className="flex items-center lg:hidden">
              <NavbarMobileButton
                mobileMenuOpen={mobileMenuOpen}
                setMobileMenuOpen={setMobileMenuOpen}
              />
            </div>
          </div>
        </div>
        <NavbarMobileMenu
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
        />
      </>
    );
  }

  // Variant A (Default): Swiss Bar Header
  return (
    <>
      <div className="container flex items-stretch justify-between h-16 md:h-20">
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
