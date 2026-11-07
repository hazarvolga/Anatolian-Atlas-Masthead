import { Link } from "react-router-dom";
import { Calendar, Settings, User, LogOut, Compass, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { useIsAdmin } from "@/hooks/useUserRole";
import ThemeToggle from "@/components/ThemeToggle";
import LanguageSelector from "@/components/LanguageSelector";

interface NavbarMobileMenuProps {
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
}

export default function NavbarMobileMenu({ mobileMenuOpen, setMobileMenuOpen }: NavbarMobileMenuProps) {
  const { t } = useLanguage();
  const { user, signOut } = useAuth();
  const isAdmin = useIsAdmin();
  
  const navLinks = [
    { name: t.nav.home, path: "/", icon: null },
    { name: "Destinations", path: "/destinations", icon: Compass },
    { name: t.nav.tours, path: "/tours", icon: null },
    { name: t.nav.gallery, path: "/gallery", icon: null },
    { name: t.nav.contact, path: "/contact", icon: null }
  ];

  const handleSignOut = async () => {
    await signOut();
    setMobileMenuOpen(false);
  };

  return (
    <div className={cn(
      "fixed inset-0 z-40 lg:hidden transition-all duration-500 ease-out",
      mobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
    )}>
      <div 
        className={cn(
          "absolute inset-0 bg-black/40 backdrop-blur-sm transition-all duration-500",
          mobileMenuOpen ? "opacity-100" : "opacity-0"
        )} 
        onClick={() => setMobileMenuOpen(false)} 
      />
      <div className={cn(
        "absolute inset-y-0 right-0 w-96 max-w-[90vw] bg-background/95 backdrop-blur-xl border-l border-border/20 p-6 transition-all duration-500 ease-out shadow-2xl",
        mobileMenuOpen ? "translate-x-0" : "translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          {/* Mobile Header */}
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-border/20">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-br from-accent-vibrant to-accent-coral rounded-xl flex items-center justify-center shadow-lg">
                <Compass className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-xl bg-gradient-to-r from-accent-vibrant to-accent-coral bg-clip-text text-transparent">
                  Mare Sereno
                </h2>
                <p className="text-xs text-text-tertiary">Premium Travel</p>
              </div>
            </div>
          </div>

          {/* Mobile Top Bar Controls */}
          <div className="flex items-center justify-between mb-6 p-4 bg-surface-elevated/50 rounded-xl border border-border/30">
            <div className="flex items-center space-x-4">
              <LanguageSelector />
              <div className="w-px h-6 bg-border/30" />
              <ThemeToggle />
            </div>
          </div>
          
          {/* Mobile Navigation */}
          <nav className="flex-1 space-y-2">
            {navLinks.map(link => (
              <Link 
                key={link.name}
                to={link.path} 
                className="flex items-center space-x-4 px-4 py-4 rounded-xl hover:bg-surface-elevated hover:text-accent-vibrant transition-all duration-300 group"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.icon && <link.icon className="h-5 w-5 group-hover:text-accent-vibrant transition-colors" />}
                <span className="font-medium">{link.name}</span>
                <div className="ml-auto w-2 h-2 bg-accent-vibrant/20 rounded-full group-hover:bg-accent-vibrant transition-colors" />
              </Link>
            ))}
            
            {user && (
              <>
                <div className="w-full h-px bg-border/20 my-4" />
                <Link 
                  to="/my-reservations" 
                  className="flex items-center space-x-4 px-4 py-4 rounded-xl hover:bg-surface-elevated hover:text-accent-vibrant transition-all duration-300 group"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Calendar className="h-5 w-5 group-hover:text-accent-vibrant transition-colors" />
                  <span className="font-medium">My Bookings</span>
                </Link>
                {isAdmin && (
                  <Link 
                    to="/admin" 
                    className="flex items-center space-x-4 px-4 py-4 rounded-xl hover:bg-surface-elevated hover:text-accent-emerald transition-all duration-300 group"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Settings className="h-5 w-5 group-hover:text-accent-emerald transition-colors" />
                    <span className="font-medium">Admin Panel</span>
                  </Link>
                )}
              </>
            )}
          </nav>
          
          {/* Mobile Footer */}
          <div className="pt-6 border-t border-border/20 space-y-4">
            {user ? (
              <>
                <div className="flex items-center space-x-4 p-4 bg-surface-elevated rounded-xl border border-border/30">
                  <div className="w-3 h-3 bg-accent-emerald rounded-full animate-pulse" />
                  <User className="h-5 w-5 text-accent-vibrant" />
                  <div className="flex-1">
                    <span className="text-sm font-medium block truncate">{user.email}</span>
                    <span className="text-xs text-text-tertiary">Online</span>
                  </div>
                </div>
                <Button 
                  onClick={handleSignOut} 
                  variant="outline" 
                  className="w-full rounded-xl hover:bg-destructive/10 hover:text-destructive hover:border-destructive/50 h-12"
                >
                  <LogOut className="h-4 w-4 mr-3" />
                  Sign Out
                </Button>
              </>
            ) : (
              <div className="space-y-3">
                <Button asChild variant="outline" className="w-full rounded-xl h-12 hover:bg-accent-vibrant/10 hover:text-accent-vibrant hover:border-accent-vibrant/50">
                  <Link to="/auth" onClick={() => setMobileMenuOpen(false)}>
                    <User className="h-4 w-4 mr-3" />
                    Login
                  </Link>
                </Button>
                <Button asChild className="w-full btn-primary h-12 shadow-lg">
                  <Link to="/booking" onClick={() => setMobileMenuOpen(false)}>
                    <Calendar className="h-4 w-4 mr-3" />
                    {t.nav.bookNow}
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
