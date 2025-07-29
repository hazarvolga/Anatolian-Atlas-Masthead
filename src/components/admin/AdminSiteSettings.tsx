
import React, { useState } from "react";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

export default function AdminSiteSettings() {
  const { settings, isLoading, updateSettings, updating } = useSiteSettings();

  const [form, setForm] = useState(() => ({
    site_title: settings?.site_title ?? "",
    site_tagline: settings?.site_tagline ?? "",
    site_logo_url: settings?.site_logo_url ?? "",
    favicon_url: settings?.favicon_url ?? "",
    contact_email: settings?.contact_email ?? "",
    contact_phone: settings?.contact_phone ?? "",
    address: settings?.address ?? "",
    social_media_links: settings?.social_media_links ?? {},
    default_meta_description: settings?.default_meta_description ?? "",
    default_meta_keywords: settings?.default_meta_keywords ?? "",
    og_image_url: settings?.og_image_url ?? "",
    primary_color: settings?.primary_color ?? "",
    secondary_color: settings?.secondary_color ?? "",
    copyright_text: settings?.copyright_text ?? "",
    google_analytics_id: settings?.google_analytics_id ?? "",
    google_tag_manager_id: settings?.google_tag_manager_id ?? "",
  }));

  // Sync form with settings loaded
  React.useEffect(() => {
    if (settings) {
      setForm({
        site_title: settings.site_title ?? "",
        site_tagline: settings.site_tagline ?? "",
        site_logo_url: settings.site_logo_url ?? "",
        favicon_url: settings.favicon_url ?? "",
        contact_email: settings.contact_email ?? "",
        contact_phone: settings.contact_phone ?? "",
        address: settings.address ?? "",
        social_media_links: settings.social_media_links ?? {},
        default_meta_description: settings.default_meta_description ?? "",
        default_meta_keywords: settings.default_meta_keywords ?? "",
        og_image_url: settings.og_image_url ?? "",
        primary_color: settings.primary_color ?? "",
        secondary_color: settings.secondary_color ?? "",
        copyright_text: settings.copyright_text ?? "",
        google_analytics_id: settings.google_analytics_id ?? "",
        google_tag_manager_id: settings.google_tag_manager_id ?? "",
      });
    }
  }, [settings]);

  // Handle logo & favicon upload
  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>, field: "site_logo_url" | "favicon_url") {
    const file = e.target.files?.[0];
    if (!file) return;
    const filePath = `branding/${field}_${Date.now()}_${file.name}`;
    
    // Placeholder for backend file upload API
    // You will need to implement a backend API for file uploads (e.g., /api/admin/upload-asset)
    // For now, this will just log a message and not actually upload.
    console.warn('File upload is not yet implemented via backend. File:', file.name, 'Path:', filePath);
    toast.info('File upload is not yet implemented. Please upload manually.');
    // const response = await axios.post(`${API_BASE_URL}/api/admin/upload-asset`, formData);
    // const url = response.data.url;
    const url = `https://placeholder.com/${filePath}`; // Dummy URL

    setForm(prev => ({
      ...prev,
      [field]: url,
    }));
    toast.success("Upload successful!");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      await updateSettings(form);
      toast.success("Site settings saved!");
    } catch (err: any) {
      toast.error("Failed to save settings: " + err.message);
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  // Social media links: JSON
  const handleSocialChange = (platform: string, value: string) => {
    setForm(f => ({
      ...f,
      social_media_links: {
        ...(f.social_media_links || {}),
        [platform]: value,
      },
    }));
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Site Settings & SEO</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label>Site Title</Label>
              <Input name="site_title" value={form.site_title} onChange={handleInputChange} />
            </div>
            <div>
              <Label>Site Tagline</Label>
              <Input name="site_tagline" value={form.site_tagline} onChange={handleInputChange} />
            </div>
            <div>
              <Label>Site Logo</Label>
              <Input type="file" accept="image/*" onChange={e => handleFileUpload(e, "site_logo_url")} />
              {form.site_logo_url && (
                <img src={form.site_logo_url} className="h-14 mt-2" alt="Logo preview" />
              )}
            </div>
            <div>
              <Label>Favicon</Label>
              <Input type="file" accept="image/*" onChange={e => handleFileUpload(e, "favicon_url")} />
              {form.favicon_url && (
                <img src={form.favicon_url} className="h-8 mt-2" alt="Favicon preview" />
              )}
            </div>
            <div>
              <Label>Contact Email</Label>
              <Input name="contact_email" value={form.contact_email} onChange={handleInputChange} />
            </div>
            <div>
              <Label>Contact Phone</Label>
              <Input name="contact_phone" value={form.contact_phone} onChange={handleInputChange} />
            </div>
            <div className="md:col-span-2">
              <Label>Address</Label>
              <Input name="address" value={form.address} onChange={handleInputChange} />
            </div>
            <div className="md:col-span-2 flex flex-wrap gap-4">
              {["facebook", "instagram", "twitter", "linkedin", "youtube"].map(platform => (
                <div key={platform}>
                  <Label className="capitalize">{platform}</Label>
                  <Input
                    name={platform}
                    value={form.social_media_links?.[platform] || ""}
                    onChange={e => handleSocialChange(platform, e.target.value)}
                  />
                </div>
              ))}
            </div>
            <div>
              <Label>Primary Color</Label>
              <Input name="primary_color" type="color" value={form.primary_color} onChange={handleInputChange} />
            </div>
            <div>
              <Label>Secondary Color</Label>
              <Input name="secondary_color" type="color" value={form.secondary_color} onChange={handleInputChange} />
            </div>
            <div className="md:col-span-2">
              <Label>Default Meta Description</Label>
              <Input name="default_meta_description" value={form.default_meta_description} onChange={handleInputChange} />
            </div>
            <div className="md:col-span-2">
              <Label>Default Meta Keywords</Label>
              <Input name="default_meta_keywords" value={form.default_meta_keywords} onChange={handleInputChange} />
            </div>
            <div className="md:col-span-2">
              <Label>OpenGraph Image URL</Label>
              <Input name="og_image_url" value={form.og_image_url} onChange={handleInputChange} />
            </div>
            <div className="md:col-span-2">
              <Label>Copyright</Label>
              <Input name="copyright_text" value={form.copyright_text} onChange={handleInputChange} />
            </div>
            <div>
              <Label>Google Analytics ID</Label>
              <Input name="google_analytics_id" value={form.google_analytics_id} onChange={handleInputChange} />
            </div>
            <div>
              <Label>Google Tag Manager ID</Label>
              <Input name="google_tag_manager_id" value={form.google_tag_manager_id} onChange={handleInputChange} />
            </div>
          </div>
          <Button type="submit" disabled={updating}>
            {updating ? "Saving..." : "Save Settings"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
