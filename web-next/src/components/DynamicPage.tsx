"use client";

import { useRouter } from "next/navigation";
import { usePage } from "@/hooks/usePages";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { sanitizeHtml, sanitizeSafeImageUrl } from "@/lib/security/sanitizeHtml";
import { ArrowLeft, Layout } from "lucide-react";

interface PageSection {
  id: string;
  type: string;
  content: Record<string, unknown>;
  settings?: Record<string, unknown>;
}

const SectionRenderer = ({ section }: { section: PageSection }) => {
  switch (section.type) {
    case "hero": {
      const safeBgUrl = sanitizeSafeImageUrl(section.content?.backgroundImage);
      const title =
        typeof section.content?.title === "string" && section.content.title
          ? section.content.title
          : "Editorial Dossier";
      const subtitle =
        typeof section.content?.subtitle === "string"
          ? section.content.subtitle
          : "";
      const ctaText =
        typeof section.content?.ctaText === "string"
          ? section.content.ctaText
          : "";

      return (
        <section
          className="relative min-h-[24rem] flex items-center justify-center bg-surface-container border-b border-border text-foreground"
          style={{
            backgroundImage: safeBgUrl ? `url("${safeBgUrl}")` : undefined,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {safeBgUrl && (
            <div
              className="absolute inset-0 bg-background/75 backdrop-blur-[2px]"
              aria-hidden="true"
            />
          )}
          <div className="relative z-10 container mx-auto px-4 py-16 text-center max-w-3xl space-y-5">
            <p className="editorial-kicker">Archival Dispatch</p>
            <h1 className="font-serif text-4xl md:text-5xl tracking-tight text-foreground">
              {title}
            </h1>
            {subtitle && (
              <p className="text-lg text-text-secondary max-w-2xl mx-auto">
                {subtitle}
              </p>
            )}
            {ctaText && (
              <div className="pt-2">
                <Button size="lg" className="btn-primary">
                  {ctaText}
                </Button>
              </div>
            )}
          </div>
        </section>
      );
    }

    case "content": {
      const rawHtml =
        section.content?.content ?? section.content?.html ?? "";
      const safeHtml = sanitizeHtml(rawHtml);
      const title =
        typeof section.content?.title === "string"
          ? section.content.title
          : "";

      return (
        <section className="py-16 md:py-24 border-b border-border">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              {title && (
                <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-8">
                  {title}
                </h2>
              )}
              <div
                className="prose prose-lg max-w-none text-text-secondary leading-relaxed space-y-4"
                dangerouslySetInnerHTML={{ __html: safeHtml }}
              />
            </div>
          </div>
        </section>
      );
    }

    case "cards": {
      const title =
        typeof section.content?.title === "string"
          ? section.content.title
          : "";
      const cards = Array.isArray(section.content?.cards)
        ? (section.content.cards as Array<{ title?: string; description?: string }>)
        : [];

      return (
        <section className="py-16 md:py-24 bg-surface-container border-b border-border">
          <div className="container mx-auto px-4">
            {title && (
              <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-12">
                {title}
              </h2>
            )}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cards.map((card, index) => (
                <Card key={index} className="card-elevated">
                  <CardContent className="p-7">
                    <span className="editorial-kicker block mb-3">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <h3 className="font-serif text-xl text-foreground mb-3">
                      {card.title}
                    </h3>
                    <p className="text-sm text-text-secondary leading-relaxed">
                      {card.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      );
    }

    default:
      return (
        <section className="py-10">
          <div className="container mx-auto px-4">
            <Card className="card-container">
              <CardContent className="p-6">
                <p className="text-sm text-text-secondary">
                  Unsupported section block: <code>{section.type}</code>
                </p>
              </CardContent>
            </Card>
          </div>
        </section>
      );
  }
};

export default function DynamicPage({ slug }: { slug: string }) {
  const { data: page, isLoading, error } = usePage(slug || "");
  const router = useRouter();

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-background">
        <div className="space-y-3 text-center">
          <div className="h-8 w-48 bg-muted animate-pulse mx-auto" />
          <p className="editorial-meta">Loading archival page…</p>
        </div>
      </div>
    );
  }

  if (error || !page) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-background px-4">
        <div className="text-center max-w-md space-y-4 border border-border bg-card p-10">
          <p className="editorial-kicker">404 — Document Missing</p>
          <h1 className="font-serif text-3xl text-foreground">Page Not Found</h1>
          <p className="text-sm text-text-secondary">
            The requested monograph or policy page is not available in the current index.
          </p>
          <div className="pt-2">
            <Button onClick={() => router.push("/")} className="btn-outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Return to Masthead
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const pageWithSections = page as unknown as {
    title?: string;
    content?: unknown;
    sections?: PageSection[];
  };
  const sections: PageSection[] = Array.isArray(pageWithSections.content)
    ? (pageWithSections.content as PageSection[])
    : Array.isArray(pageWithSections.sections)
      ? pageWithSections.sections
      : [];

  return (
    <div className="flex-1 bg-background">
      {sections.length > 0 ? (
        sections.map((section) => (
          <SectionRenderer key={section.id} section={section} />
        ))
      ) : (
        <div className="min-h-[60vh] flex items-center justify-center px-4">
          <div className="text-center max-w-md border border-border bg-card p-10">
            <Layout className="h-8 w-8 mx-auto mb-4 text-text-secondary" />
            <h1 className="font-serif text-3xl text-foreground mb-3">
              {page.title}
            </h1>
            <p className="text-sm text-text-secondary">
              This page has no published sections yet.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
