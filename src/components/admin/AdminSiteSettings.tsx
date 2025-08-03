import React, { useState, useEffect } from "react";
import { useSiteSettings, SiteSettings } from "@/hooks/useSiteSettings";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, Settings, Info, Palette, Share2, Contact, Copyright, Search } from "lucide-react";
import LoadingSpinner from "./LoadingSpinner";
import ErrorAlert from "./ErrorAlert";

type SettingsKey = keyof Omit<SiteSettings, 'id' | 'social_media_links'>;

const settingFields: { id: SettingsKey; label: string; placeholder: string; icon: React.ReactNode; section: string }[] = [
  { id: 'site_title', label: 'Site Title', placeholder: 'e.g., NextStopTurkey', icon: <Info className="h-4 w-4" />, section: 'General' },
  { id: 'site_tagline', label: 'Site Tagline', placeholder: 'Your adventure starts here', icon: <Info className="h-4 w-4" />, section: 'General' },
  { id: 'company_name', label: 'Company Name', placeholder: 'Your Company LLC', icon: <Info className="h-4 w-4" />, section: 'General' },
  { id: 'website_url', label: 'Website URL', placeholder: 'https://example.com', icon: <Info className="h-4 w-4" />, section: 'General' },
  { id: 'contact_email', label: 'Contact Email', placeholder: 'contact@example.com', icon: <Contact className="h-4 w-4" />, section: 'Contact' },
  { id: 'support_email', label: 'Support Email', placeholder: 'support@example.com', icon: <Contact className="h-4 w-4" />, section: 'Contact' },
  { id: 'contact_phone', label: 'Contact Phone', placeholder: '+1 234 567 890', icon: <Contact className="h-4 w-4" />, section: 'Contact' },
  { id: 'address', label: 'Company Address', placeholder: '123 Main St, Anytown, USA', icon: <Contact className="h-4 w-4" />, section: 'Contact' },
  { id: 'primary_color', label: 'Primary Color', placeholder: '#000000', icon: <Palette className="h-4 w-4" />, section: 'Branding' },
  { id: 'secondary_color', label: 'Secondary Color', placeholder: '#FFFFFF', icon: <Palette className="h-4 w-4" />, section: 'Branding' },
  { id: 'copyright_text', label: 'Copyright Text', placeholder: `© ${new Date().getFullYear()} Your Company. All rights reserved.`, icon: <Copyright className="h-4 w-4" />, section: 'Footer' },
  { id: 'default_meta_description', label: 'Default Meta Description', placeholder: 'Discover amazing tours in Turkey.', icon: <Search className="h-4 w-4" />, section: 'SEO' },
  { id: 'default_meta_keywords', label: 'Default Meta Keywords', placeholder: 'Turkey, tours, travel, Istanbul', icon: <Search className="h-4 w-4" />, section: 'SEO' },
  { id: 'google_analytics_id', label: 'Google Analytics ID', placeholder: 'UA-XXXXX-Y', icon: <Share2 className="h-4 w-4" />, section: 'Integrations' },
  { id: 'google_tag_manager_id', label: 'Google Tag Manager ID', placeholder: 'GTM-XXXX', icon: <Share2 className="h-4 w-4" />, section: 'Integrations' },
];

const socialPlatforms = ['facebook', 'twitter', 'instagram', 'linkedin', 'youtube'];

export default function AdminSiteSettings() {
  const { settings, isLoading, error, refetch, updateSettings, isUpdating } = useSiteSettings();
  const [formState, setFormState] = useState<Partial<SiteSettings>>({});

  useEffect(() => {
    if (settings) {
      setFormState(settings);
    }
  }, [settings]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };

  const handleSocialChange = (platform: string, value: string) => {
    setFormState(prev => ({
      ...prev,
      social_media_links: {
        ...(prev.social_media_links || {}),
        [platform]: value,
      },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateSettings(formState);
  };

  if (isLoading) {
    return <div className="text-center py-16"><LoadingSpinner size="lg" text="Loading settings..." /></div>;
  }

  if (error) {
    return <ErrorAlert title="Failed to load settings" message={error instanceof Error ? error.message : "An unknown error occurred."} onRetry={refetch} retryLabel="Reload Settings" />;
  }

  const renderSection = (sectionName: string) => (
    <div key={sectionName} className="space-y-4">
      <h3 className="text-lg font-semibold text-primary flex items-center gap-2">
        {settingFields.find(f => f.section === sectionName)?.icon}
        {sectionName}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-6 border-l-2 border-border">
        {settingFields.filter(f => f.section === sectionName).map(field => (
          <div key={field.id}>
            <Label htmlFor={field.id}>{field.label}</Label>
            <Input
              id={field.id}
              name={field.id}
              value={formState[field.id] || ''}
              onChange={handleInputChange}
              placeholder={field.placeholder}
              className="mt-1"
            />
          </div>
        ))}
        {sectionName === 'Integrations' && (
          <div className="md:col-span-2">
            <Label>Social Media Links</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1">
              {socialPlatforms.map(platform => (
                <div key={platform} className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground capitalize">{platform}</span>
                  <Input
                    name={platform}
                    value={formState.social_media_links?.[platform] || ''}
                    onChange={(e) => handleSocialChange(platform, e.target.value)}
                    placeholder={`https://...`}
                    className="pl-24"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <form onSubmit={handleSubmit}>
      <Card className="shadow-sm border-border/50">
        <CardHeader>
          <CardTitle className="text-xl md:text-2xl flex items-center gap-2">
            <Settings className="h-6 w-6" />
            Site Settings
          </CardTitle>
          <CardDescription>Manage global settings for your website, including SEO, contact info, and branding.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          {['General', 'Contact', 'Branding', 'Footer', 'SEO', 'Integrations'].map(section => renderSection(section))}
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={isUpdating}>
            {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Changes
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
