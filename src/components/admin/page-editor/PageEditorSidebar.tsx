
import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import AddSectionCard from "./AddSectionCard";
import SectionsList from "./SectionsList";
import SectionEditor from "./SectionEditor";
import { getDefaultContent } from "./utils/sectionDefaults";

interface PageEditorSidebarProps {
  pageData: any;
  onPageDataChange: (data: any) => void;
}

export default function PageEditorSidebar({ pageData, onPageDataChange }: PageEditorSidebarProps) {
  const [selectedSection, setSelectedSection] = useState<string | null>(null);

  const addSection = (type: string) => {
    const newSection = {
      id: `section-${Date.now()}`,
      type,
      content: getDefaultContent(type),
      settings: {}
    };

    const updatedSections = [...(pageData.sections || []), newSection];
    onPageDataChange({
      ...pageData,
      sections: updatedSections
    });
  };

  const updateSection = (sectionId: string, field: string, value: any) => {
    const updatedSections = pageData.sections?.map((section: any) => {
      if (section.id === sectionId) {
        return {
          ...section,
          content: {
            ...section.content,
            [field]: value
          }
        };
      }
      return section;
    });

    onPageDataChange({
      ...pageData,
      sections: updatedSections
    });
  };

  const removeSection = (sectionId: string) => {
    const updatedSections = pageData.sections?.filter((section: any) => section.id !== sectionId);
    onPageDataChange({
      ...pageData,
      sections: updatedSections
    });
    if (selectedSection === sectionId) {
      setSelectedSection(null);
    }
  };

  const moveSectionUp = (index: number) => {
    if (index === 0) return;
    const updatedSections = [...pageData.sections];
    [updatedSections[index], updatedSections[index - 1]] = [updatedSections[index - 1], updatedSections[index]];
    onPageDataChange({
      ...pageData,
      sections: updatedSections
    });
  };

  const moveSectionDown = (index: number) => {
    if (index === pageData.sections.length - 1) return;
    const updatedSections = [...pageData.sections];
    [updatedSections[index], updatedSections[index + 1]] = [updatedSections[index + 1], updatedSections[index]];
    onPageDataChange({
      ...pageData,
      sections: updatedSections
    });
  };

  const getSelectedSection = () => {
    if (!selectedSection) return null;
    return pageData.sections?.find((section: any) => section.id === selectedSection);
  };

  const selectedSectionData = getSelectedSection();

  return (
    <div className="w-80 border-r bg-background">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">Page Sections</h2>
        <p className="text-sm text-muted-foreground">Add and manage page sections</p>
      </div>

      <ScrollArea className="h-full">
        <div className="p-4 space-y-4">
          <AddSectionCard onAddSection={addSection} />

          <SectionsList
            sections={pageData.sections}
            selectedSection={selectedSection}
            onSelectSection={setSelectedSection}
            onRemoveSection={removeSection}
            onMoveSectionUp={moveSectionUp}
            onMoveSectionDown={moveSectionDown}
          />

          <SectionEditor
            section={selectedSectionData}
            onUpdateSection={updateSection}
          />
        </div>
      </ScrollArea>
    </div>
  );
}
