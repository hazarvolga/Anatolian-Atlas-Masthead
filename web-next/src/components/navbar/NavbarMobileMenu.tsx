"use client";

import Link from "next/link";
import { Calendar, Settings, User, LogOut, Compass, X } from "lucide-react";
import { Button } from "@/components/ui/button";
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
  const { t } = useLanguage();
  const { user, signOut } = useAuth();
  const isAdmin = useIsAdmin();

  const navLinks = [
    { name: t.nav.home || "Atlas", path: "/" },
    {
      name: (t.nav as Record<string, string>).destinations || "Destinations",
      path: "/destinations",
    },
    { name: t.nav.tours || "Journeys", path: "/tours" },
    { name: t.nav.gallery || "Archive", path: "/gallery" },
    { name: t.nav.contact || "Inquiries", path: "/contact" },
  ];

  const handleSignOut = async () => {
    await signOut();
    setMobileMenuOpen(false);
  };

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 lg:hidden transition-opacity duration-200",
        mobileMenuOpen
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none"
      )}
      aria-hidden={!mobileMenuOpen}
    >
      <div
        className="absolute inset-0 bg-foreground/40 backdrop-blur-xs"
        onClick={() => setMobileMenuOpen(false)}
      />
      <div
        className={cn(
          "absolute inset-y-0 right-0 w-80 max-w-[88vw] bg-background border-l border-border p-6 transition-transform duration-200 shadow-xl",
          mobileMenuOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Mobile Header */}
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-border">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-foreground text-background rounded-md flex items-center justify-center">
                <Compass className="h-4 w-4" />
              </div>
              <div>
                <span className="font-serif font-medium text-lg text-foreground block leading-none">
                  {siteConfig.brand.name}
                </span>
                <span className="text-[11px] uppercase tracking-wider text-text-secondary">
                  {siteConfig.brand.tagline}
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded-md text-text-secondary hover:text-foreground hover:bg-muted"
              aria-label="Close navigation menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Language & Theme */}
          <div className="flex items-center justify-between mb-6 p-3 bg-card rounded-md border border-border">
            <LanguageSelector />
            <ThemeToggle />
          </div>

          {/* Mobile Navigation Links */}
          <nav className="flex-1 space-y-1" aria-label="Mobile navigation">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                className="flex items-center justify-between px-3 py-3 rounded-md text-foreground hover:bg-muted font-medium transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span>{link.name}</span>
              </Link>
            ))}

            {user && (
              <>
                <div className="w-full h-px bg-border my-3" />
                <Link
                  href="/my-reservations"
                  className="flex items-center space-x-3 px-3 py-3 rounded-md text-foreground hover:bg-muted font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Calendar className="h-4 w-4 text-primary" />
                  <span>{t.nav.myBookings || "My Reservations"}</span>
                </Link>
                {isAdmin && (
                  <Link
                    href="/admin"
                    className="flex items-center space-x-3 px-3 py-3 rounded-md text-foreground hover:bg-muted font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Settings className="h-4 w-4 text-primary" />
                    <span>{t.nav.admin || "Editorial Desk"}</span>
                  </Link>
                )}
              </>
            )}
          </nav>

          {/* Mobile Footer */}
          <div className="pt-5 border-t border-border space-y-3">
            {user ? (
              <>
                <div className="flex items-center space-x-3 p-3 bg-card rounded-md border border-border">
                  <User className="h-4 w-4 text-primary shrink-0" />
                  <span className="text-xs font-medium truncate">
                    {user.email}
                  </span>
                </div>
                <Button
                  onClick={handleSignOut}
                  variant="outline"
                  className="w-full h-10"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  {t.nav.signOut || "Sign Out"}
                </Button>
              </>
            ) : (
              <div className="space-y-2.5">
                <Button asChild variant="outline" className="w-full h-10">
                  <Link href="/auth" onClick={() => setMobileMenuOpen(false)}>
                    <User className="h-4 w-4 mr-2" />
                    {t.nav.signIn || "Sign In"}
                  </Link>
                </Button>
                <Button asChild className="w-full btn-primary h-10">
                  <Link href="/tours" onClick={() => setMobileMenuOpen(false)}>
                    <Calendar className="h-4 w-4 mr-2" />
                    {t.nav.bookNow || "Explore Tours"}
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
