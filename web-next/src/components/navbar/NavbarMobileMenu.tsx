"use client";

import { useEffect } from "react";
import Link from "next/link";
import { ArrowUpRight, LogOut, User, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { useIsAdmin } from "@/hooks/useUserRole";
import ThemeToggle from "@/components/ThemeToggle";
import LanguageSelector from "@/components/LanguageSelector";
import { siteConfig } from "@/config/site";

interface NavbarMobileMenuProps {
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
}

export default function NavbarMobileMenu({
  mobileMenuOpen,
  setMobileMenuOpen,
}: NavbarMobileMenuProps) {
  const { t, localizePath } = useLanguage();
  const { user, signOut } = useAuth();
  const isAdmin = useIsAdmin();

  useEffect(() => {
    if (!mobileMenuOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [mobileMenuOpen, setMobileMenuOpen]);

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

  const handleSignOut = async () => {
    await signOut();
    setMobileMenuOpen(false);
  };

  return (
    <div
      id="mobile-navigation-drawer"
      role="dialog"
      aria-modal={mobileMenuOpen ? "true" : undefined}
      aria-label="Mobile navigation menu"
      className={cn(
        "fixed inset-0 z-50 lg:hidden transition-opacity duration-200",
        mobileMenuOpen
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none"
      )}
      aria-hidden={!mobileMenuOpen}
    >
      <div
        className="absolute inset-0 bg-foreground/50 backdrop-blur-xs"
        onClick={() => setMobileMenuOpen(false)}
      />
      <div
        className={cn(
          "absolute inset-y-0 right-0 w-80 max-w-[90vw] bg-background border-l border-border p-6 transition-transform duration-200",
          mobileMenuOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Mobile Masthead */}
          <div className="flex justify-between items-start mb-6 pb-5 border-b border-border">
            <div>
              <span className="text-[10px] uppercase tracking-[0.16em] text-primary block mb-1">
                ED. IV — ANATOLIAN ATLAS
              </span>
              <span className="font-serif text-xl text-foreground block leading-none">
                {siteConfig.brand.name}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 border border-border text-text-secondary hover:text-foreground"
              aria-label="Close navigation menu"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Language & Theme */}
          <div className="flex items-center justify-between mb-6 p-3 bg-card border border-border">
            <LanguageSelector />
            <ThemeToggle />
          </div>

          {/* Indexed Links */}
          <nav className="flex-1 divide-y divide-border border-y border-border" aria-label="Mobile navigation">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                href={localizePath(link.path)}
                className="flex items-baseline justify-between py-4 text-foreground hover:text-primary transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                <div className="flex items-baseline gap-3">
                  <span className="text-[11px] uppercase tracking-[0.16em] text-primary tabular-nums">
                    {link.index}
                  </span>
                  <span className="font-serif text-xl">{link.name}</span>
                </div>
                <ArrowUpRight className="h-4 w-4 text-text-secondary" />
              </Link>
            ))}

            {user && (
              <>
                <Link
                  href="/my-reservations"
                  className="flex items-baseline justify-between py-4 text-foreground hover:text-primary"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <div className="flex items-baseline gap-3">
                    <span className="text-[11px] uppercase tracking-[0.16em] text-primary tabular-nums">
                      06
                    </span>
                    <span className="font-serif text-xl">
                      {t.nav.myBookings || "My Reservations"}
                    </span>
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-text-secondary" />
                </Link>
                {isAdmin && (
                  <Link
                    href="/admin"
                    className="flex items-baseline justify-between py-4 text-foreground hover:text-primary"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <div className="flex items-baseline gap-3">
                      <span className="text-[11px] uppercase tracking-[0.16em] text-primary tabular-nums">
                        07
                      </span>
                      <span className="font-serif text-xl">
                        {t.nav.admin || "Editorial Desk"}
                      </span>
                    </div>
                    <ArrowUpRight className="h-4 w-4 text-text-secondary" />
                  </Link>
                )}
              </>
            )}
          </nav>

          {/* Footer Actions */}
          <div className="pt-6 space-y-3">
            {user ? (
              <>
                <div className="flex items-center gap-2.5 p-3 bg-card border border-border">
                  <User className="h-4 w-4 text-primary shrink-0" />
                  <span className="text-xs font-medium truncate">
                    {user.email}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="btn-outline w-full py-3"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  {t.nav.signOut || "Sign Out"}
                </button>
              </>
            ) : (
              <div className="space-y-2.5">
                <Link
                  href="/auth"
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn-outline w-full py-3"
                >
                  {t.nav.signIn || "Sign In"}
                </Link>
                <Link
                  href="/tours"
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn-primary w-full py-3"
                >
                  {t.nav.bookNow || "Explore Routes"}
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
