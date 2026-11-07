"use client";

import dynamic from "next/dynamic";

const DesignSystemStudio = dynamic(
  () => import("@/components/design-system/DesignSystemStudio"),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-[70vh] flex items-center justify-center bg-background">
        <p className="editorial-meta">Loading Design System Studio…</p>
      </div>
    ),
  }
);

export default function DesignSystemStudioLoader() {
  return <DesignSystemStudio />;
}
