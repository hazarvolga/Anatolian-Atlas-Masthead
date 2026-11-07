"use client";


import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SectionEditorProps {
  section: any;
  onUpdateSection: (sectionId: string, field: string, value: any) => void;
}

export default function SectionEditor({ section, onUpdateSection }: SectionEditorProps) {
  if (!section) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-muted-foreground">
          Select a section to edit its properties
        </CardContent>
      </Card>
    );
  }

  const handleChange = (field: string, value: any) => {
    onUpdateSection(section.id, field, value);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit {section.type} Section</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {section.type === "hero" && (
          <>
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={section.content?.title || ""}
                onChange={(e) => handleChange("title", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="subtitle">Subtitle</Label>
              <Input
                id="subtitle"
                value={section.content?.subtitle || ""}
                onChange={(e) => handleChange("subtitle", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={section.content?.description || ""}
                onChange={(e) => handleChange("description", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="buttonText">Button Text</Label>
              <Input
                id="buttonText"
                value={section.content?.buttonText || ""}
                onChange={(e) => handleChange("buttonText", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="buttonLink">Button Link</Label>
              <Input
                id="buttonLink"
                value={section.content?.buttonLink || ""}
                onChange={(e) => handleChange("buttonLink", e.target.value)}
              />
            </div>
          </>
        )}

        {section.type === "content" && (
          <>
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={section.content?.title || ""}
                onChange={(e) => handleChange("title", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                value={section.content?.content || ""}
                onChange={(e) => handleChange("content", e.target.value)}
                rows={6}
              />
            </div>
          </>
        )}

        {section.type === "gallery" && (
          <div>
            <Label htmlFor="title">Gallery Title</Label>
            <Input
              id="title"
              value={section.content?.title || ""}
              onChange={(e) => handleChange("title", e.target.value)}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
