
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

interface PageSettingsProps {
  pageData: any;
  onPageDataChange: (data: any) => void;
}

export default function PageSettings({ pageData, onPageDataChange }: PageSettingsProps) {
  const updateField = (field: string, value: any) => {
    onPageDataChange({
      ...pageData,
      [field]: value
    });
  };

  return (
    <div className="flex-1 p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h2 className="text-2xl font-bold">Page Settings</h2>
          <p className="text-muted-foreground">Configure your page settings and SEO</p>
        </div>

        {/* Basic Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>Basic page information and URL settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Page Title</Label>
                <Input
                  id="title"
                  value={pageData.title || ""}
                  onChange={(e) => updateField("title", e.target.value)}
                  placeholder="Enter page title"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">URL Slug</Label>
                <Input
                  id="slug"
                  value={pageData.slug || ""}
                  onChange={(e) => updateField("slug", e.target.value)}
                  placeholder="page-url-slug"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select 
                  value={pageData.status || "draft"} 
                  onValueChange={(value) => updateField("status", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="template">Template Type</Label>
                <Select 
                  value={pageData.template_type || "default"} 
                  onValueChange={(value) => updateField("template_type", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Default</SelectItem>
                    <SelectItem value="homepage">Homepage</SelectItem>
                    <SelectItem value="listing">Listing</SelectItem>
                    <SelectItem value="contact">Contact</SelectItem>
                    <SelectItem value="legal">Legal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="homepage"
                checked={pageData.is_homepage || false}
                onCheckedChange={(checked) => updateField("is_homepage", checked)}
              />
              <Label htmlFor="homepage">Set as Homepage</Label>
            </div>
          </CardContent>
        </Card>

        {/* SEO Settings */}
        <Card>
          <CardHeader>
            <CardTitle>SEO Settings</CardTitle>
            <CardDescription>Search engine optimization settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="meta_title">SEO Title</Label>
              <Input
                id="meta_title"
                value={pageData.meta_title || ""}
                onChange={(e) => updateField("meta_title", e.target.value)}
                placeholder="SEO optimized title"
              />
              <p className="text-xs text-muted-foreground">
                Recommended length: 50-60 characters
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="meta_description">SEO Description</Label>
              <Textarea
                id="meta_description"
                value={pageData.meta_description || ""}
                onChange={(e) => updateField("meta_description", e.target.value)}
                placeholder="SEO description for search engines"
                rows={3}
              />
              <p className="text-xs text-muted-foreground">
                Recommended length: 150-160 characters
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="meta_keywords">Keywords</Label>
              <Input
                id="meta_keywords"
                value={pageData.meta_keywords?.join(", ") || ""}
                onChange={(e) => updateField("meta_keywords", e.target.value.split(",").map((k: string) => k.trim()))}
                placeholder="keyword1, keyword2, keyword3"
              />
              <p className="text-xs text-muted-foreground">
                Separate keywords with commas
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Page Structure */}
        <Card>
          <CardHeader>
            <CardTitle>Page Structure</CardTitle>
            <CardDescription>Advanced page configuration</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Current Sections</Label>
              <div className="text-sm text-muted-foreground">
                {pageData.sections && pageData.sections.length > 0 ? (
                  <p>{pageData.sections.length} section(s) configured</p>
                ) : (
                  <p>No sections added yet. Use the Visual Editor to add sections.</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
