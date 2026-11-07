import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="max-w-xl w-full border border-border bg-card">
        <div className="px-6 py-4 border-b border-border bg-foreground text-background flex items-center justify-between text-[11px] uppercase tracking-[0.16em] tabular-nums">
          <span>ARCHIVE ERROR 404</span>
          <span>UNMAPPED COORDINATE</span>
        </div>
        <div className="p-8 sm:p-12 space-y-6">
          <span className="editorial-kicker block">
            DOSSIER NOT FOUND IN ARCHIVE
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl text-foreground leading-tight">
            This route or folio has moved.
          </h1>
          <p className="text-sm sm:text-base text-text-secondary leading-relaxed">
            The page you requested is outside our current regional index. Return to the main Anatolian Atlas masthead or inspect our scheduled journeys.
          </p>
          <div className="pt-4 flex flex-wrap gap-3">
            <Link href="/" className="btn-primary">
              <ArrowLeft className="h-4 w-4 mr-2" />
              <span>Return to Atlas</span>
            </Link>
            <Link href="/tours" className="btn-outline">
              <span>Inspect Journeys</span>
              <ArrowUpRight className="h-4 w-4 ml-2" />
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
