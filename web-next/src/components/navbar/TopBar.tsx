"use client";


import Link from "next/link";
import { Calendar, Settings, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/ThemeToggle";
import LanguageSelector from "@/components/LanguageSelector";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { useIsAdmin } from "@/hooks/useUserRole";

export default function TopBar() {
  const { t } = useLanguage();
  const { user, signOut } = useAuth();
  const isAdmin = useIsAdmin();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="border-b border-border/10 bg-background/80 backdrop-blur-sm">
      <div className="container flex justify-between items-center py-2">
        {/* Left side - Language Selector */}
        <div className="flex items-center">
          <LanguageSelector />
        </div>
        
        {/* Right side - Theme Toggle + User Actions */}
        <div className="flex items-center space-x-4">
          <ThemeToggle />
          
          {user ? (
            <div className="flex items-center space-x-3">
              <Button asChild variant="ghost" size="sm" className="rounded-xl hover:bg-accent-vibrant/10 hover:text-accent-vibrant border border-transparent hover:border-accent-vibrant/20">
                <Link href="/my-reservations" className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4" />
                  <span className="hidden md:inline">My Bookings</span>
                </Link>
              </Button>
              
              {isAdmin && (
                <Button asChild variant="ghost" size="sm" className="rounded-xl hover:bg-accent-emerald/10 hover:text-accent-emerald border border-transparent hover:border-accent-emerald/20">
                  <Link href="/admin" className="flex items-center space-x-2">
                    <Settings className="h-4 w-4" />
                    <span className="hidden md:inline">Admin</span>
                  </Link>
                </Button>
              )}
              
              <div className="flex items-center space-x-3 px-3 py-1.5 bg-surface-elevated/80 backdrop-blur-sm rounded-xl border border-border/30 shadow-sm">
                <div className="w-2 h-2 bg-accent-emerald rounded-full animate-pulse" />
                <User className="h-4 w-4 text-accent-vibrant" />
                <span className="text-sm font-medium truncate max-w-24 hidden sm:inline">{user.email}</span>
              </div>
              
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleSignOut} 
                className="rounded-xl hover:bg-destructive/10 hover:text-destructive border border-transparent hover:border-destructive/20"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <Button asChild variant="ghost" size="sm" className="rounded-xl hover:bg-accent-vibrant/10 hover:text-accent-vibrant">
                <Link href="/auth">Login</Link>
              </Button>
              <Button asChild size="sm" className="btn-primary shadow-lg hover:shadow-xl hover:shadow-accent-vibrant/25">
                <Link href="/booking" className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4" />
                  <span className="hidden sm:inline">{t.nav.bookNow}</span>
                </Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
