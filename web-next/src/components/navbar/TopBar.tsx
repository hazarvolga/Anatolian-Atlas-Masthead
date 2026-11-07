"use client";

import Link from "next/link";
import { Calendar, Settings, User, LogOut, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/ThemeToggle";
import LanguageSelector from "@/components/LanguageSelector";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { useIsAdmin } from "@/hooks/useUserRole";
import { isDemoMode } from "@/config/site";

export default function TopBar() {
  const { t } = useLanguage();
  const { user, signOut } = useAuth();
  const isAdmin = useIsAdmin();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="border-b border-border/60 bg-muted/40 text-xs">
      <div className="container flex justify-between items-center py-1.5">
        {/* Left side - Dispatch origin & Language Selector */}
        <div className="flex items-center gap-4">
          <LanguageSelector />
          <span className="hidden md:inline-flex items-center gap-1.5 text-text-secondary">
            <MapPin className="h-3 w-3 text-primary" />
            <span>Galata, İstanbul — 41.0256° N, 28.9742° E</span>
          </span>
          {isDemoMode() && (
            <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded bg-primary/10 text-primary font-medium text-[11px]">
              Template Demo Mode
            </span>
          )}
        </div>

        {/* Right side - Theme Toggle + User Actions */}
        <div className="flex items-center space-x-3">
          <ThemeToggle />

          {user ? (
            <div className="flex items-center space-x-2">
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="h-7 px-2.5 text-xs"
              >
                <Link
                  href="/my-reservations"
                  className="flex items-center space-x-1.5"
                >
                  <Calendar className="h-3.5 w-3.5" />
                  <span className="hidden md:inline">
                    {t.nav.myBookings || "My Reservations"}
                  </span>
                </Link>
              </Button>

              {isAdmin && (
                <Button
                  asChild
                  variant="ghost"
                  size="sm"
                  className="h-7 px-2.5 text-xs"
                >
                  <Link href="/admin" className="flex items-center space-x-1.5">
                    <Settings className="h-3.5 w-3.5" />
                    <span className="hidden md:inline">
                      {t.nav.admin || "Admin"}
                    </span>
                  </Link>
                </Button>
              )}

              <Link
                href="/profile"
                className="hidden sm:inline-flex items-center space-x-1.5 px-2.5 py-1 bg-card rounded border border-border text-xs text-foreground hover:border-primary/40"
              >
                <User className="h-3 w-3 text-primary" />
                <span className="font-medium truncate max-w-28">
                  {user.email}
                </span>
              </Link>

              <Button
                variant="ghost"
                size="sm"
                onClick={handleSignOut}
                className="h-7 px-2 text-text-secondary hover:text-destructive"
                aria-label="Sign Out"
              >
                <LogOut className="h-3.5 w-3.5" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="h-7 px-2.5 text-xs"
              >
                <Link href="/auth">{t.nav.signIn || "Sign In"}</Link>
              </Button>
              <Button asChild size="sm" className="h-7 px-3 text-xs">
                <Link href="/tours">{t.nav.bookNow || "Explore Tours"}</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
