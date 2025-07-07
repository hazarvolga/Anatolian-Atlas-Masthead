
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useCreatePage, useUpdatePage } from "@/hooks/usePages";
import { X, Save } from "lucide-react";

interface AdminPageFormProps {
  page?: any;
  onClose: () => void;
  onSave: () => void;
}

export default function AdminPageForm({ page, onClose, onSave }: AdminPageFormProps) {
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    meta_title: "",
    meta_description: "",
    meta_keywords: [] as string[],
    status: "draft",
    template_type: "default",
    is_homepage: false,
    content: {}
  });

  const createPage = useCreatePage();
  const updatePage = useUpdatePage();

  useEffect(() => {
    if (page) {
      setFormData({
        title: page.title || "",
        slug: page.slug || "",
        meta_title: page.meta_title || "",
        meta_description: page.meta_description || "",
        meta_keywords: page.meta_keywords || [],
        status: page.status || "draft",
        template_type: page.template_type || "default",
        is_homepage: page.is_homepage || false,
        content: page.content || {}
      });
    }
  }, [page]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (page) {
        await updatePage.mutateAsync({ id: page.id, updates: formData });
      } else {
        await createPage.mutateAsync(formData);
      }
      onSave();
      onClose();
    } catch (error) {
      console.error("Error saving page:", error);
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  };

  const handleTitleChange = (title: string) => {
    setFormData(prev => ({
      ...prev,
      title,
      slug: !page ? generateSlug(title) : prev.slug // Only auto-generate slug for new pages
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>{page ? "Edit Page" : "Create New Page"}</CardTitle>
            <CardDescription>
              {page ? "Update page information and settings" : "Create a new page for your website"}
            </CardDescription>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Page Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="Enter page title"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">URL Slug</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                  placeholder="page-url-slug"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}>
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
                <Select value={formData.template_type} onValueChange={(value) => setFormData(prev => ({ ...prev, template_type: value }))}>
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
                checked={formData.is_homepage}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_homepage: checked }))}
              />
              <Label htmlFor="homepage">Set as Homepage</Label>
            </div>

            <div className="space-y-2">
              <Label htmlFor="meta_title">SEO Title</Label>
              <Input
                id="meta_title"
                value={formData.meta_title}
                onChange={(e) => setFormData(prev => ({ ...prev, meta_title: e.target.value }))}
                placeholder="SEO optimized title"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="meta_description">SEO Description</Label>
              <Textarea
                id="meta_description"
                value={formData.meta_description}
                onChange={(e) => setFormData(prev => ({ ...prev, meta_description: e.target.value }))}
                placeholder="SEO description for search engines"
                rows={3}
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={createPage.isPending || updatePage.isPending}
              >
                <Save className="h-4 w-4 mr-2" />
                {page ? "Update Page" : "Create Page"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
