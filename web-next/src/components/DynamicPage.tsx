"use client";

import { useRouter } from "next/navigation";
import { usePage } from "@/hooks/usePages";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Layout } from "lucide-react";

interface PageSection {
  id: string;
  type: string;
  content: any;
  settings: any;
}

const SectionRenderer = ({ section }: { section: PageSection }) => {
  switch (section.type) {
    case 'hero':
      return (
        <div
          className="relative h-96 flex items-center justify-center bg-gradient-to-r from-blue-600 to-purple-600 text-white"
          style={{
            backgroundImage: section.content?.backgroundImage
              ? `url(${section.content.backgroundImage})`
              : undefined,
            backgroundSize: "cover",
            backgroundPosition: "center"
          }}
        >
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold">
              {section.content?.title || "Hero Title"}
            </h1>
            <p className="text-xl opacity-90">
              {section.content?.subtitle || "Hero subtitle goes here"}
            </p>
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
              {section.content?.ctaText || "Call to Action"}
            </Button>
          </div>
        </div>
      );

    case 'content':
      return (
        <div className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto prose prose-lg">
              <h2 className="text-3xl font-bold mb-6">
                {section.content?.title}
              </h2>
              <div
                dangerouslySetInnerHTML={{
                  __html: section.content?.content || section.content?.html || ''
                }}
              />
            </div>
          </div>
        </div>
      );

    case 'cards':
      return (
        <div className="py-16 bg-muted/50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">
              {section.content?.title}
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {section.content?.cards?.map((card: any, index: number) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-3">{card.title}</h3>
                    <p className="text-muted-foreground">{card.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      );

    default:
      return (
        <div className="py-8">
          <div className="container mx-auto px-4">
            <Card>
              <CardContent className="p-6">
                <p className="text-muted-foreground">
                  Unknown section type: {section.type}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      );
  }
};

export default function DynamicPage({ slug }: { slug: string }) {
  const { data: page, isLoading, error } = usePage(slug || '');
  const router = useRouter();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !page) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Page Not Found</h1>
          <p className="text-muted-foreground mb-8">
            The page you&apos;re looking for doesn&apos;t exist.
          </p>
          <Button onClick={() => router.push('/')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Home
          </Button>
        </div>
      </div>
    );
  }

  // Parse sections from content field if it exists
  const pageWithSections = page as any;
  const sections = pageWithSections.content && Array.isArray(pageWithSections.content)
    ? pageWithSections.content
    : pageWithSections.sections || [];

  return (
    <div className="flex-1">
      {sections.length > 0 ? (
        sections.map((section: PageSection) => (
          <SectionRenderer key={section.id} section={section} />
        ))
      ) : (
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center">
            <Layout className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <h1 className="text-4xl font-bold mb-4">{page.title}</h1>
            <p className="text-muted-foreground">This page has no content yet.</p>
          </div>
        </div>
      )}
    </div>
  );
}
