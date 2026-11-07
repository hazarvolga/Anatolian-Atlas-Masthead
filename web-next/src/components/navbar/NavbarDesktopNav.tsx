"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";

export default function NavbarDesktopNav() {
  const { t } = useLanguage();
  const pathname = usePathname();

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

  return (
    <nav aria-label="Primary navigation">
      <ul className="hidden lg:flex items-center space-x-1">
        {navLinks.map((link) => {
          const isActive =
            link.path === "/"
              ? pathname === "/"
              : pathname?.startsWith(link.path);

          return (
            <li key={link.path}>
              <Link
                href={link.path}
                className={cn(
                  "px-4 py-2 rounded-md text-sm font-medium transition-colors duration-150",
                  isActive
                    ? "text-primary font-semibold bg-primary/5"
                    : "text-text-secondary hover:text-foreground hover:bg-muted/60"
                )}
              >
                {link.name}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
