"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";

export default function NavbarDesktopNav() {
  const { t } = useLanguage();
  const pathname = usePathname();

  const navLinks = [
    { index: "01", name: t.nav.home || "Atlas", path: "/" },
    {
      index: "02",
      name: (t.nav as Record<string, string>).destinations || "Regions",
      path: "/destinations",
    },
    { index: "03", name: t.nav.tours || "Journeys", path: "/tours" },
    { index: "04", name: t.nav.gallery || "Archive", path: "/gallery" },
    { index: "05", name: t.nav.contact || "Inquiries", path: "/contact" },
  ];

  return (
    <nav aria-label="Primary navigation" className="h-full">
      <ul className="hidden lg:flex items-stretch h-full">
        {navLinks.map((link) => {
          const isActive =
            link.path === "/"
              ? pathname === "/"
              : pathname?.startsWith(link.path);

          return (
            <li
              key={link.path}
              className="flex items-stretch border-r border-border first:border-l"
            >
              <Link
                href={link.path}
                className={cn(
                  "relative px-5 xl:px-6 flex flex-col justify-center transition-colors duration-150 group",
                  isActive
                    ? "bg-card text-foreground"
                    : "text-text-secondary hover:text-foreground hover:bg-card/60"
                )}
              >
                <span className="text-[10px] uppercase tracking-[0.16em] text-primary tabular-nums leading-none mb-1">
                  {link.index}
                </span>
                <span className="text-xs uppercase tracking-[0.14em] font-medium leading-none">
                  {link.name}
                </span>
                <span
                  className={cn(
                    "absolute bottom-0 left-0 right-0 h-[2px] bg-primary transition-transform duration-200 origin-left",
                    isActive
                      ? "scale-x-100"
                      : "scale-x-0 group-hover:scale-x-100"
                  )}
                />
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
