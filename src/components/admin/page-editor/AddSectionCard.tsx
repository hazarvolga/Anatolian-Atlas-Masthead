
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Type, Image, Grid3X3, Code, Layout } from "lucide-react";

interface SectionType {
  id: string;
  name: string;
  icon: any;
  description: string;
}

interface AddSectionCardProps {
  onAddSection: (type: string) => void;
}

const sectionTypes: SectionType[] = [
  {
    id: "hero",
    name: "Hero Section",
    icon: Layout,
    description: "Banner with title, subtitle and CTA"
  },
  {
    id: "content",
    name: "Content Block",
    icon: Type,
    description: "Rich text content section"
  },
  {
    id: "cards",
    name: "Cards Grid",
    icon: Grid3X3,
    description: "Grid of cards with images and text"
  },
  {
    id: "image",
    name: "Image Section",
    icon: Image,
    description: "Full width image with optional text"
  },
  {
    id: "custom",
    name: "Custom HTML",
    icon: Code,
    description: "Custom HTML/CSS content"
  }
];

export default function AddSectionCard({ onAddSection }: AddSectionCardProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm">Add New Section</CardTitle>
        <CardDescription className="text-xs">
          Choose a section type to add to your page
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        {sectionTypes.map((section) => (
          <Button
            key={section.id}
            variant="outline"
            size="sm"
            className="w-full justify-start h-auto p-3"
            onClick={() => onAddSection(section.id)}
          >
            <section.icon className="h-4 w-4 mr-2 flex-shrink-0" />
            <div className="text-left">
              <div className="font-medium text-xs">{section.name}</div>
              <div className="text-xs text-muted-foreground">{section.description}</div>
            </div>
          </Button>
        ))}
      </CardContent>
    </Card>
  );
}
