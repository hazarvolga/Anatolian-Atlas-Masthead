import type { Metadata } from "next";
import { notFound } from "next/navigation";
import DynamicPage from "@/components/DynamicPage";
import { fetchServerJson } from "@/lib/api/server";

interface DynamicPageData {
  title?: string;
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string[];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const result = await fetchServerJson<DynamicPageData>(
    `/api/pages/${encodeURIComponent(slug)}`
  );

  if (!result.ok) {
    return { title: "Page" };
  }

  return {
    title: result.data.meta_title || result.data.title || "Page",
    description: result.data.meta_description || undefined,
    keywords: Array.isArray(result.data.meta_keywords)
      ? result.data.meta_keywords
      : undefined,
  };
}

export default async function DynamicRoutePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const result = await fetchServerJson<DynamicPageData>(
    `/api/pages/${encodeURIComponent(slug)}`
  );

  // A missing page is a real 404. Network/backend failures fall through to the
  // client renderer, which keeps the legacy "Page Not Found" UI.
  if (!result.ok) {
    if (result.status === 404) {
      notFound();
    }
  }

  return <DynamicPage slug={slug} />;
}
