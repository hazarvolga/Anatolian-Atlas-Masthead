import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, BookOpen, Compass, Clock } from "lucide-react";
import {
  DEMO_EDITORIAL_DISCLAIMER,
  JOURNAL_ARTICLES,
} from "@/lib/data/journal-content";

export const metadata: Metadata = {
  title: "The Anatolian Journal — Archaeological & Architectural Monographs",
  description:
    "Fact-checked field monographs on Göbekli Tepe, Mimar Sinan’s acoustic engineering in İstanbul, Cappadocian ignimbrite geology, Patara’s Stadiasmus, Ephesus, and Aphrodisias.",
};

export default function JournalIndexPage() {
  const [featured, ...rest] = JOURNAL_ARTICLES;

  return (
    <main className="bg-background text-foreground min-h-screen pt-24 pb-24">
      <div className="container">
        {/* Masthead Header */}
        <header className="border-b border-border pb-10 mb-12">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-5 mb-6 border-b border-border font-mono text-xs tracking-widest uppercase text-text-secondary">
            <span>VOLUME IV · ANATOLIAN ATLAS MONOGRAPH SERIES</span>
            <span>6 VERIFIED FIELD DISPATCHES · GALATA RESEARCH DESK</span>
            <span>36°N–42°N / 26°E–45°E</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
            <div className="lg:col-span-8">
              <span className="editorial-kicker block mb-3">
                FIELD ARCHIVE & EDITORIAL MONOGRAPHS
              </span>
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-foreground leading-[1.06]">
                The Anatolian Journal
              </h1>
            </div>
            <div className="lg:col-span-4">
              <p className="text-sm sm:text-base text-text-secondary leading-relaxed">
                Stratigraphic notes, architectural geometry, and coastal epigraphy across six regions of Türkiye.
              </p>
            </div>
          </div>

          <div
            role="note"
            data-testid="journal-demo-disclaimer"
            className="mt-6 px-4 py-3 border border-border bg-card font-mono text-xs text-text-secondary"
          >
            {DEMO_EDITORIAL_DISCLAIMER}
          </div>
        </header>

        {/* Featured Monograph (Asymmetric 7/5 Split) */}
        {featured && (
          <section
            aria-label="Featured Monograph"
            className="mb-16 pb-16 border-b border-border"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
              <Link
                href={`/journal/${featured.slug}`}
                className="lg:col-span-7 group block overflow-hidden border border-border bg-card"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img
                    src={featured.heroImage}
                    alt={featured.heroCaption}
                    width={1400}
                    height={875}
                    fetchPriority="high"
                    decoding="async"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                  />
                  <div className="absolute top-4 left-4 bg-background/95 backdrop-blur-sm px-3 py-1.5 border border-border font-mono text-[11px] tracking-widest uppercase text-foreground">
                    {featured.folioNo} · {featured.category}
                  </div>
                </div>
                <div className="px-4 py-3 border-t border-border flex flex-wrap items-center justify-between gap-2 font-mono text-[11px] text-text-secondary">
                  <span>{featured.heroCaption}</span>
                  <span>{featured.coordinates}</span>
                </div>
              </Link>

              <div className="lg:col-span-5 flex flex-col justify-between h-full">
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-4">
                    <span className="px-2.5 py-1 text-[11px] font-mono uppercase tracking-widest border border-primary text-primary">
                      FEATURED MONOGRAPH
                    </span>
                    <span className="px-2.5 py-1 text-[11px] font-mono uppercase tracking-widest bg-card text-text-secondary border border-border">
                      DEMO EDITORIAL BYLINE
                    </span>
                  </div>

                  <Link href={`/journal/${featured.slug}`} className="group block">
                    <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-normal text-foreground group-hover:text-primary transition-colors leading-tight mb-4">
                      {featured.title}
                    </h2>
                  </Link>

                  <p className="text-base text-text-secondary leading-relaxed mb-6">
                    {featured.subtitle}
                  </p>

                  {/* Key Facts Table */}
                  <dl className="border-t border-border mb-6">
                    {featured.keyFacts.map((fact) => (
                      <div
                        key={fact.label}
                        className="py-2.5 border-b border-border flex items-baseline justify-between gap-4 text-xs"
                      >
                        <dt className="font-mono uppercase tracking-wider text-text-secondary">
                          {fact.label}
                        </dt>
                        <dd className="font-mono text-right text-foreground">
                          {fact.value}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                  <div className="flex items-center gap-4 font-mono text-xs text-text-secondary">
                    <span className="inline-flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      {featured.readingMinutes} MIN READ
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Compass className="w-3.5 h-3.5" />
                      {featured.regionName}
                    </span>
                  </div>

                  <Link
                    href={`/journal/${featured.slug}`}
                    className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-primary hover:underline"
                  >
                    Read Monograph
                    <ArrowUpRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Remaining 5 Monographs Archive Grid */}
        <section aria-label="All Monographs">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-mono text-xs uppercase tracking-widest text-text-secondary">
              INDEX OF FIELD DISPATCHES (02 — 06)
            </h2>
            <span className="font-mono text-xs text-text-secondary">
              SORTED BY FOLIO NUMBER
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {rest.map((article) => (
              <article
                key={article.slug}
                className="group flex flex-col justify-between border border-border bg-card transition-colors hover:border-primary"
              >
                <div>
                  <Link
                    href={`/journal/${article.slug}`}
                    className="block relative aspect-[3/2] overflow-hidden border-b border-border"
                  >
                    <img
                      src={article.heroImage}
                      alt={article.heroCaption}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                      loading="lazy"
                    />
                    <div className="absolute top-3 left-3 bg-background/95 px-2.5 py-1 border border-border font-mono text-[10px] tracking-widest uppercase text-foreground">
                      {article.folioNo} · {article.category}
                    </div>
                  </Link>

                  <div className="p-6">
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-3 font-mono text-[11px] text-text-secondary">
                      <span>{article.regionName}</span>
                      <span>{article.coordinates}</span>
                    </div>

                    <Link href={`/journal/${article.slug}`}>
                      <h3 className="font-serif text-xl font-normal text-foreground group-hover:text-primary transition-colors leading-snug mb-3">
                        {article.title}
                      </h3>
                    </Link>

                    <p className="text-sm text-text-secondary leading-relaxed mb-4 line-clamp-3">
                      {article.excerpt}
                    </p>
                  </div>
                </div>

                <div className="px-6 py-4 border-t border-border flex items-center justify-between gap-2 font-mono text-[11px] text-text-secondary">
                  <span className="inline-flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-primary" />
                    {article.readingMinutes} MIN · DEMO BYLINE
                  </span>
                  <Link
                    href={`/journal/${article.slug}`}
                    className="inline-flex items-center gap-1 uppercase tracking-widest text-primary font-medium"
                  >
                    Open Folio
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
