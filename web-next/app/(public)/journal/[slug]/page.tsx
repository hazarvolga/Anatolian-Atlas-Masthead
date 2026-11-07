import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowUpRight,
  BookOpen,
  Clock,
  Compass,
  FileCheck2,
  MapPin,
} from "lucide-react";
import {
  JOURNAL_ARTICLES,
  getJournalArticleBySlug,
} from "@/lib/data/journal-content";
import {
  buildPageSeoMetadata,
  getServerLocale,
} from "@/lib/i18n/server-locale";
import {
  buildBreadcrumbJsonLd,
  buildJournalArticleJsonLd,
} from "@/lib/seo/jsonld";
import JsonLd from "@/components/seo/JsonLd";

export async function generateStaticParams() {
  return JOURNAL_ARTICLES.map((article) => ({
    slug: article.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = getJournalArticleBySlug(slug);

  if (!article) {
    return {
      title: "Monograph Not Found",
    };
  }

  return buildPageSeoMetadata({
    pathname: `/journal/${article.slug}`,
    title: `${article.title} — ${article.folioNo}`,
    description: article.subtitle,
    openGraphType: "article",
    images: [article.heroImage],
  });
}

export default async function JournalArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const locale = await getServerLocale();
  const article = getJournalArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const relatedArticles = JOURNAL_ARTICLES.filter(
    (a) => a.slug !== article.slug
  ).slice(0, 2);

  return (
    <main className="bg-background text-foreground min-h-screen pt-24 pb-24">
      <JsonLd
        data={[
          buildJournalArticleJsonLd(article, locale),
          buildBreadcrumbJsonLd(
            [
              { name: "Atlas", path: "/" },
              { name: "The Anatolian Journal", path: "/journal" },
              { name: article.folioNo, path: `/journal/${article.slug}` },
            ],
            locale
          ),
        ]}
      />
      <article className="container">
        {/* Breadcrumb & Folio Top Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-8 border-b border-border">
          <Link
            href="/journal"
            className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-text-secondary hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Journal Index
          </Link>

          <div className="flex flex-wrap items-center gap-3 font-mono text-xs uppercase tracking-widest text-text-secondary">
            <span>{article.folioNo}</span>
            <span>·</span>
            <span>{article.category}</span>
            <span>·</span>
            <span>{article.coordinates}</span>
          </div>
        </div>

        {/* Editorial Header */}
        <header className="max-w-4xl mb-12">
          <div className="flex flex-wrap items-center gap-2.5 mb-5">
            <span className="px-2.5 py-1 font-mono text-[11px] uppercase tracking-widest border border-primary text-primary">
              {article.regionName}
            </span>
            <span className="px-2.5 py-1 font-mono text-[11px] uppercase tracking-widest bg-card text-text-secondary border border-border">
              {article.author.demoNotice}
            </span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl lg:text-[52px] font-normal text-foreground leading-[1.08] tracking-tight mb-6">
            {article.title}
          </h1>

          <p className="text-lg sm:text-xl text-text-secondary leading-relaxed mb-8">
            {article.subtitle}
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-5 border-y border-border font-mono text-xs">
            <div>
              <span className="block text-[10px] uppercase tracking-widest text-text-secondary mb-1">
                EDITORIAL DESK
              </span>
              <span className="text-foreground">{article.author.name}</span>
            </div>
            <div>
              <span className="block text-[10px] uppercase tracking-widest text-text-secondary mb-1">
                ELEVATION & DATUM
              </span>
              <span className="text-foreground">{article.elevation}</span>
            </div>
            <div>
              <span className="block text-[10px] uppercase tracking-widest text-text-secondary mb-1">
                READING TIME
              </span>
              <span className="inline-flex items-center gap-1.5 text-foreground">
                <Clock className="w-3.5 h-3.5 text-primary" />
                {article.readingMinutes} Minutes
              </span>
            </div>
            <div>
              <span className="block text-[10px] uppercase tracking-widest text-text-secondary mb-1">
                PUBLISHED DATE
              </span>
              <span className="text-foreground">{article.publishedAt}</span>
            </div>
          </div>
        </header>

        {/* Full-Width Archival Plate */}
        <figure className="mb-14 border border-border bg-card">
          <div className="relative aspect-[21/9] overflow-hidden">
            <img
              src={article.heroImage}
              alt={article.heroCaption}
              className="w-full h-full object-cover"
            />
          </div>
          <figcaption className="px-5 py-3.5 border-t border-border flex flex-wrap items-center justify-between gap-4 font-mono text-xs text-text-secondary">
            <span>PLATE I — {article.heroCaption}</span>
            <span>COORDINATES: {article.coordinates}</span>
          </figcaption>
        </figure>

        {/* 12-Column Swiss Grid Body: 4-Col Sidebar Dossier + 8-Col Monograph Prose */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Sidebar: Key Facts & Related Field Route */}
          <aside className="lg:col-span-4 space-y-8 lg:sticky lg:top-28">
            <div className="p-6 border border-border bg-card">
              <h2 className="font-mono text-xs uppercase tracking-widest text-primary mb-4 flex items-center gap-2">
                <Compass className="w-4 h-4" />
                STRATIGRAPHIC & FIELD DATA
              </h2>
              <dl className="divide-y divide-border">
                {article.keyFacts.map((fact) => (
                  <div key={fact.label} className="py-3">
                    <dt className="font-mono text-[11px] uppercase tracking-wider text-text-secondary mb-1">
                      {fact.label}
                    </dt>
                    <dd className="font-mono text-xs text-foreground">
                      {fact.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            {/* Related Regional Dossier & Tour CTA */}
            <div className="p-6 border border-border bg-card">
              <span className="font-mono text-[10px] uppercase tracking-widest text-primary block mb-2">
                FIELD EXPEDITION LINK
              </span>
              <h3 className="font-serif text-xl text-foreground mb-2">
                Examine This Site in the Field
              </h3>
              <p className="text-xs text-text-secondary leading-relaxed mb-5">
                Our small-group itineraries in {article.regionName} include on-site contextual briefings aligned with this monograph.
              </p>
              <div className="flex flex-col gap-2.5">
                <Link
                  href={`/tours/${article.relatedTourId}`}
                  className="btn-primary py-2.5 px-4 inline-flex items-center justify-between text-xs font-mono uppercase tracking-widest"
                >
                  <span>Inspect Field Itinerary</span>
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
                <Link
                  href={`/destinations/${article.regionId}`}
                  className="btn-outline py-2.5 px-4 inline-flex items-center justify-between text-xs font-mono uppercase tracking-widest"
                >
                  <span>Regional Dossier ({article.regionName})</span>
                  <MapPin className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </aside>

          {/* Right Column: Monograph Sections & Verified Citations */}
          <div className="lg:col-span-8 space-y-12">
            {article.sections.map((section) => (
              <section key={section.id} id={section.id} className="space-y-5">
                <h2 className="font-serif text-2xl sm:text-3xl font-normal text-foreground tracking-tight border-b border-border pb-3">
                  {section.heading}
                </h2>
                {section.paragraphs.map((para, idx) => (
                  <p
                    key={idx}
                    className="text-base sm:text-lg text-foreground leading-[1.8] font-normal"
                  >
                    {para}
                  </p>
                ))}

                {section.pullQuote && (
                  <blockquote className="my-8 pl-6 border-l-2 border-primary py-2 bg-card p-6">
                    <p className="font-serif text-xl sm:text-2xl italic text-foreground leading-relaxed mb-3">
                      “{section.pullQuote.text}”
                    </p>
                    <footer className="font-mono text-xs uppercase tracking-widest text-text-secondary">
                      — {section.pullQuote.attribution}
                    </footer>
                  </blockquote>
                )}
              </section>
            ))}

            {/* Verified Academic & Institutional Citations */}
            <section
              aria-label="Verified Sources and Citations"
              className="pt-8 border-t border-border"
            >
              <div className="flex items-center justify-between gap-4 mb-4">
                <h2 className="font-mono text-xs uppercase tracking-widest text-primary flex items-center gap-2">
                  <FileCheck2 className="w-4 h-4" />
                  PRIMARY ARCHAEOLOGICAL & INSTITUTIONAL SOURCES
                </h2>
                <span className="font-mono text-[11px] text-text-secondary">
                  FACT-CHECKED DOSSIER
                </span>
              </div>

              <ul className="space-y-3">
                {article.citations.map((cit, index) => (
                  <li
                    key={cit.id}
                    className="p-4 border border-border bg-card flex flex-wrap items-baseline justify-between gap-2 text-xs font-mono"
                  >
                    <div>
                      <span className="text-primary mr-2">
                        [0{index + 1}]
                      </span>
                      <strong className="text-foreground">
                        {cit.source}
                      </strong>{" "}
                      — <span className="text-text-secondary">{cit.publication}</span> ({cit.year})
                    </div>
                    {cit.url && (
                      <a
                        href={cit.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-primary hover:underline"
                      >
                        Verify Reference
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </section>

            {/* Further Reading in the Monograph Series */}
            <section className="pt-8 border-t border-border">
              <h2 className="font-mono text-xs uppercase tracking-widest text-text-secondary mb-6 flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                CONTINUE READING IN THE ARCHIVE
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {relatedArticles.map((rel) => (
                  <Link
                    key={rel.slug}
                    href={`/journal/${rel.slug}`}
                    className="group p-5 border border-border bg-card hover:border-primary transition-colors"
                  >
                    <span className="font-mono text-[10px] uppercase tracking-widest text-primary block mb-2">
                      {rel.folioNo} · {rel.regionName}
                    </span>
                    <h3 className="font-serif text-lg text-foreground group-hover:text-primary transition-colors leading-snug mb-2">
                      {rel.title}
                    </h3>
                    <span className="font-mono text-[11px] text-text-secondary inline-flex items-center gap-1">
                      Read Monograph <ArrowUpRight className="w-3.5 h-3.5" />
                    </span>
                  </Link>
                ))}
              </div>
            </section>
          </div>
        </div>
      </article>
    </main>
  );
}
