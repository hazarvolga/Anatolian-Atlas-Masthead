
import { useState } from "react";
import { Link } from "react-router-dom";
import { Compass } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";

export default function NavbarDesktopNav() {
  const { t } = useLanguage();
  const [navHovered, setNavHovered] = useState<string | null>(null);
  
  const navLinks = [
    { name: t.nav.home, path: "/", icon: null },
    { name: "Destinations", path: "/destinations", icon: Compass },
    { name: t.nav.tours, path: "/tours", icon: null },
    // { name: t.nav.amenities, path: "/amenities", icon: null }, // Amenities kaldırıldı
    { name: t.nav.gallery, path: "/gallery", icon: null },
    { name: t.nav.contact, path: "/contact", icon: null }
  ];

  return (
    <ul className="hidden lg:flex items-center space-x-2">
      {navLinks.map(link => (
        <li key={link.name} className="relative">
          <Link 
            to={link.path} 
            className={cn(
              "px-5 py-3 rounded-xl font-medium transition-all duration-300 relative group",
              "hover:bg-surface-elevated hover:text-accent-vibrant hover:shadow-lg hover:shadow-accent-vibrant/10",
              "before:absolute before:inset-0 before:rounded-xl before:bg-gradient-to-r before:from-accent-vibrant/5 before:to-accent-coral/5",
              "before:opacity-0 before:transition-opacity before:duration-300 hover:before:opacity-100",
              "after:absolute after:bottom-1 after:left-1/2 after:-translate-x-1/2",
              "after:w-0 after:h-0.5 after:bg-gradient-to-r after:from-accent-vibrant after:to-accent-coral after:transition-all after:duration-300",
              "hover:after:w-3/4"
            )}
            onMouseEnter={() => setNavHovered(link.name)}
            onMouseLeave={() => setNavHovered(null)}
          >
            <span className="relative z-10">{link.name}</span>
            {navHovered === link.name && (
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-accent-vibrant/10 to-accent-coral/10 animate-scale-in" />
            )}
          </Link>
        </li>
      ))}
    </ul>
  );
}

