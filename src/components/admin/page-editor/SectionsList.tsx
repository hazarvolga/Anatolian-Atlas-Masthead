
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Type, Trash2, MoveUp, MoveDown } from "lucide-react";

interface SectionsListProps {
  sections: any[];
  selectedSection: string | null;
  onSelectSection: (sectionId: string) => void;
  onRemoveSection: (sectionId: string) => void;
  onMoveSectionUp: (index: number) => void;
  onMoveSectionDown: (index: number) => void;
}

export default function SectionsList({ 
  sections, 
  selectedSection, 
  onSelectSection, 
  onRemoveSection, 
  onMoveSectionUp, 
  onMoveSectionDown 
}: SectionsListProps) {
  if (!sections || sections.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm">Current Sections</CardTitle>
        <CardDescription className="text-xs">
          Click to edit, use arrows to reorder
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        {sections.map((section: any, index: number) => (
          <div key={section.id} className="flex items-center gap-2">
            <Button
              variant={selectedSection === section.id ? "default" : "outline"}
              size="sm"
              className="flex-1 justify-start"
              onClick={() => onSelectSection(section.id)}
            >
              <Type className="h-4 w-4 mr-2" />
              {section.content?.title || `${section.type} Section`}
            </Button>
            <div className="flex flex-col gap-1">
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={() => onMoveSectionUp(index)}
                disabled={index === 0}
              >
                <MoveUp className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={() => onMoveSectionDown(index)}
                disabled={index === sections.length - 1}
              >
                <MoveDown className="h-3 w-3" />
              </Button>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-destructive"
              onClick={() => onRemoveSection(section.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
