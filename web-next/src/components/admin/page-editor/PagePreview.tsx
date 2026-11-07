"use client";


import { Card } from "@/components/ui/card";
import { Monitor, Tablet, Smartphone, Layout } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface PagePreviewProps {
  pageData: any;
  onPageDataChange: (data: any) => void;
}

export default function PagePreview({ pageData, onPageDataChange }: PagePreviewProps) {
  const [viewMode, setViewMode] = useState<"desktop" | "tablet" | "mobile">("desktop");

  const getPreviewWidth = () => {
    switch (viewMode) {
      case "mobile":
        return "w-[375px]";
      case "tablet":
        return "w-[768px]";
      default:
        return "w-full";
    }
  };

  const renderSection = (section: any) => {
    switch (section.type) {
      case "hero":
        return (
          <div 
            key={section.id}
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

      case "content":
        return (
          <div key={section.id} className="py-12 px-6">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold mb-6">
                {section.content?.title || "Content Title"}
              </h2>
              <div 
                className="prose max-w-none"
                dangerouslySetInnerHTML={{ 
                  __html: section.content?.content || "<p>Content goes here...</p>" 
                }}
              />
            </div>
          </div>
        );

      case "cards":
        return (
          <div key={section.id} className="py-12 px-6 bg-gray-50">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12">
                {section.content?.title || "Cards Section"}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {(section.content?.cards || []).map((card: any, index: number) => (
                  <Card key={index} className="p-6">
                    {card.image && (
                      <img 
                        src={card.image} 
                        alt={card.title}
                        className="w-full h-48 object-cover rounded-lg mb-4"
                      />
                    )}
                    <h3 className="text-xl font-semibold mb-2">{card.title}</h3>
                    <p className="text-gray-600">{card.description}</p>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        );

      case "image":
        return (
          <div key={section.id} className="py-12">
            {section.content?.image && (
              <div className="max-w-6xl mx-auto px-6">
                <img 
                  src={section.content.image}
                  alt={section.content?.altText || ""}
                  className="w-full h-96 object-cover rounded-lg"
                />
                {section.content?.caption && (
                  <p className="text-center text-gray-600 mt-4">
                    {section.content.caption}
                  </p>
                )}
              </div>
            )}
          </div>
        );

      case "custom":
        return (
          <div 
            key={section.id}
            dangerouslySetInnerHTML={{ 
              __html: section.content?.html || "<div>Custom HTML content</div>" 
            }}
          />
        );

      default:
        return (
          <div key={section.id} className="py-8 px-6 border-2 border-dashed border-gray-300">
            <p className="text-center text-gray-500">
              Unknown section type: {section.type}
            </p>
          </div>
        );
    }
  };

  return (
    <div className="flex-1 bg-gray-100">
      {/* Preview Header */}
      <div className="flex items-center justify-between p-4 bg-white border-b">
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === "desktop" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("desktop")}
          >
            <Monitor className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "tablet" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("tablet")}
          >
            <Tablet className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "mobile" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("mobile")}
          >
            <Smartphone className="h-4 w-4" />
          </Button>
        </div>
        <div className="text-sm text-gray-600">
          Preview: {pageData.title}
        </div>
      </div>

      {/* Preview Content */}
      <div className="flex justify-center p-8">
        <div className={`${getPreviewWidth()} bg-white min-h-screen shadow-lg transition-all duration-300`}>
          {pageData.sections && pageData.sections.length > 0 ? (
            pageData.sections.map((section: any) => renderSection(section))
          ) : (
            <div className="flex items-center justify-center h-96 text-gray-500">
              <div className="text-center">
                <Layout className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No sections added yet</p>
                <p className="text-sm">Add sections from the sidebar to start building your page</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
