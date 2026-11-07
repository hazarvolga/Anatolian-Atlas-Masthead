"use client";

import React, { useState, useEffect } from "react";
import { useSiteSettings, SiteSettings } from "@/hooks/useSiteSettings";
import { useDesignSystem } from "@/contexts/DesignSystemContext";
import defaultThemeConfig, { type ThemeConfig } from "@/config/theme.config";
import { validateSafeSeoUrl } from "@/lib/seo/validate-seo-fields";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { toast } from "sonner";
import {
  Loader2,
  Settings,
  Info,
  Palette,
  Share2,
  Contact,
  Copyright,
  Search,
  ShieldCheck,
  LayoutGrid,
} from "lucide-react";
import LoadingSpinner from "./LoadingSpinner";
import ErrorAlert from "./ErrorAlert";

type SettingsKey = keyof Omit<
  SiteSettings,
  "id" | "social_media_links" | "theme_config"
>;

const settingFields: {
  id: SettingsKey;
  label: string;
  placeholder: string;
  icon: React.ReactNode;
  section: string;
}[] = [
  {
    id: "site_title",
    label: "Site Title",
    placeholder: "e.g., NextStopTurkey",
    icon: <Info className="h-4 w-4" />,
    section: "General",
  },
  {
    id: "site_tagline",
    label: "Site Tagline",
    placeholder: "Anatolian Geographic & Cultural Monograph",
    icon: <Info className="h-4 w-4" />,
    section: "General",
  },
  {
    id: "website_url",
    label: "Website URL (Absolute http/https)",
    placeholder: "https://nextstopturkey.com",
    icon: <Info className="h-4 w-4" />,
    section: "General",
  },
  {
    id: "company_name",
    label: "Verified Legal Entity Name (JSON-LD)",
    placeholder: "Leave blank until verified prior to launch",
    icon: <ShieldCheck className="h-4 w-4" />,
    section: "Verified Agency Identity",
  },
  {
    id: "tursab_license_no",
    label: "Verified TÜRSAB License No (JSON-LD)",
    placeholder: "Leave blank until verified prior to launch",
    icon: <ShieldCheck className="h-4 w-4" />,
    section: "Verified Agency Identity",
  },
  {
    id: "tax_id",
    label: "Verified Tax ID / MERSİS (JSON-LD)",
    placeholder: "Leave blank until verified prior to launch",
    icon: <ShieldCheck className="h-4 w-4" />,
    section: "Verified Agency Identity",
  },
  {
    id: "contact_email",
    label: "Contact Email",
    placeholder: "concierge@yourdomain.com",
    icon: <Contact className="h-4 w-4" />,
    section: "Contact",
  },
  {
    id: "support_email",
    label: "Support Email",
    placeholder: "support@yourdomain.com",
    icon: <Contact className="h-4 w-4" />,
    section: "Contact",
  },
  {
    id: "contact_phone",
    label: "Contact Phone",
    placeholder: "+90 ...",
    icon: <Contact className="h-4 w-4" />,
    section: "Contact",
  },
  {
    id: "address",
    label: "Company Address",
    placeholder: "Verified street address, İstanbul, Türkiye",
    icon: <Contact className="h-4 w-4" />,
    section: "Contact",
  },
  {
    id: "canonical_url",
    label: "Default Canonical URL (Server-Validated)",
    placeholder: "https://nextstopturkey.com or /",
    icon: <Search className="h-4 w-4" />,
    section: "SEO",
  },
  {
    id: "og_image",
    label: "Default OpenGraph Image URL (Server-Validated)",
    placeholder: "/demo/istanbul-bosphorus.jpg or https://...",
    icon: <Search className="h-4 w-4" />,
    section: "SEO",
  },
  {
    id: "default_meta_description",
    label: "Default Meta Description",
    placeholder: "Curated cultural and archaeological journeys across Türkiye.",
    icon: <Search className="h-4 w-4" />,
    section: "SEO",
  },
  {
    id: "default_meta_keywords",
    label: "Default Meta Keywords",
    placeholder: "Türkiye, Anatolia, cultural journeys, İstanbul, Cappadocia",
    icon: <Search className="h-4 w-4" />,
    section: "SEO",
  },
  {
    id: "copyright_text",
    label: "Copyright Text",
    placeholder: `© ${new Date().getFullYear()} NextStopTurkey. All rights reserved.`,
    icon: <Copyright className="h-4 w-4" />,
    section: "Footer",
  },
  {
    id: "google_analytics_id",
    label: "Google Analytics ID",
    placeholder: "G-XXXXXXXXXX",
    icon: <Share2 className="h-4 w-4" />,
    section: "Integrations",
  },
  {
    id: "google_tag_manager_id",
    label: "Google Tag Manager ID",
    placeholder: "GTM-XXXXXXX",
    icon: <Share2 className="h-4 w-4" />,
    section: "Integrations",
  },
];

const socialPlatforms = [
  "facebook",
  "twitter",
  "instagram",
  "linkedin",
  "youtube",
];

export default function AdminSiteSettings() {
  const { settings, isLoading, error, refetch, updateSettings, isUpdating } =
    useSiteSettings();
  const { config: liveThemeConfig, replaceConfig } = useDesignSystem();
  const [formState, setFormState] = useState<Partial<SiteSettings>>({});
  const [themeState, setThemeState] = useState<ThemeConfig>(
    liveThemeConfig || defaultThemeConfig
  );
  const [seoValidationError, setSeoValidationError] = useState<string | null>(
    null
  );

  useEffect(() => {
    if (settings) {
      setFormState(settings);
      if (settings.theme_config) {
        setThemeState(settings.theme_config);
      }
    }
  }, [settings]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSeoValidationError(null);
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSocialChange = (platform: string, value: string) => {
    setFormState((prev) => ({
      ...prev,
      social_media_links: {
        ...(prev.social_media_links || {}),
        [platform]: value,
      },
    }));
  };

  const handleThemeFieldChange = (
    field: "preset" | "mode" | "radius" | "density",
    value: string
  ) => {
    setThemeState((prev) => ({
      ...prev,
      [field]: value as any,
    }));
  };

  const handleMotionChange = (level: ThemeConfig["motion"]["level"]) => {
    setThemeState((prev) => ({
      ...prev,
      motion: { ...prev.motion, level },
    }));
  };

  const handleLayoutChange = <K extends keyof ThemeConfig["layout"]>(
    key: K,
    value: ThemeConfig["layout"][K]
  ) => {
    setThemeState((prev) => ({
      ...prev,
      layout: {
        ...prev.layout,
        [key]: value,
      },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSeoValidationError(null);

    const canonicalCheck = validateSafeSeoUrl(
      formState.canonical_url,
      "canonical_url"
    );
    if (!canonicalCheck.valid) {
      setSeoValidationError(canonicalCheck.error || "Invalid canonical_url");
      toast.error(canonicalCheck.error || "Invalid canonical_url");
      return;
    }

    const ogImageCheck = validateSafeSeoUrl(formState.og_image, "og_image");
    if (!ogImageCheck.valid) {
      setSeoValidationError(ogImageCheck.error || "Invalid og_image");
      toast.error(ogImageCheck.error || "Invalid og_image");
      return;
    }

    await updateSettings({
      ...formState,
      canonical_url: canonicalCheck.sanitized,
      og_image: ogImageCheck.sanitized,
      og_image_url: ogImageCheck.sanitized,
      theme_config: themeState,
    });
    replaceConfig(themeState);
  };

  if (isLoading) {
    return (
      <div className="text-center py-16">
        <LoadingSpinner size="lg" text="Loading settings..." />
      </div>
    );
  }

  if (error) {
    return (
      <ErrorAlert
        title="Failed to load settings"
        message={
          error instanceof Error ? error.message : "An unknown error occurred."
        }
        onRetry={refetch}
        retryLabel="Reload Settings"
      />
    );
  }

  const renderSection = (sectionName: string) => (
    <div key={sectionName} className="space-y-4">
      <h3 className="text-lg font-semibold text-primary flex items-center gap-2">
        {settingFields.find((f) => f.section === sectionName)?.icon}
        {sectionName}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-6 border-l-2 border-border">
        {settingFields
          .filter((f) => f.section === sectionName)
          .map((field) => (
            <div key={field.id}>
              <Label htmlFor={field.id}>{field.label}</Label>
              <Input
                id={field.id}
                name={field.id}
                value={(formState[field.id] as string) || ""}
                onChange={handleInputChange}
                placeholder={field.placeholder}
                className="mt-1"
              />
            </div>
          ))}
        {sectionName === "Integrations" && (
          <div className="md:col-span-2">
            <Label>Social Media Links</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1">
              {socialPlatforms.map((platform) => (
                <div key={platform} className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground capitalize">
                    {platform}
                  </span>
                  <Input
                    name={platform}
                    value={formState.social_media_links?.[platform] || ""}
                    onChange={(e) =>
                      handleSocialChange(platform, e.target.value)
                    }
                    placeholder="https://..."
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
    <form onSubmit={handleSubmit} data-testid="admin-site-settings-form">
      <Card className="shadow-sm border-border/50">
        <CardHeader>
          <CardTitle className="text-xl md:text-2xl flex items-center gap-2">
            <Settings className="h-6 w-6" />
            Site Settings, SSR Theme & SEO Controls
          </CardTitle>
          <CardDescription>
            Manage SSR design system tokens, layout variants, server-validated
            SEO metadata (`canonical_url`, `og_image`), and verified agency
            credentials.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-10">
          {/* SSR Design System & Layout Preset Studio */}
          <div className="space-y-4" data-testid="admin-theme-studio-section">
            <h3 className="text-lg font-semibold text-primary flex items-center gap-2">
              <Palette className="h-4 w-4" />
              Design System & SSR Theme Preset (Zero-Flash SSR)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pl-6 border-l-2 border-border">
              <div>
                <Label htmlFor="theme-preset-select">Brand Concept Preset</Label>
                <select
                  id="theme-preset-select"
                  value={themeState.preset}
                  onChange={(e) =>
                    handleThemeFieldChange("preset", e.target.value)
                  }
                  className="mt-1 w-full h-10 px-3 rounded border border-border bg-background text-sm"
                >
                  <option value="anatolian-atlas">
                    Anatolian Atlas (Warm Limestone & Terracotta)
                  </option>
                  <option value="aegean-linen">
                    Aegean Linen (Sun-Bleached Chalk & Cobalt)
                  </option>
                  <option value="ottoman-noir">
                    Ottoman Noir (Obsidian & Burnished Brass)
                  </option>
                </select>
              </div>

              <div>
                <Label htmlFor="theme-mode-select">Color Mode</Label>
                <select
                  id="theme-mode-select"
                  value={themeState.mode}
                  onChange={(e) =>
                    handleThemeFieldChange("mode", e.target.value)
                  }
                  className="mt-1 w-full h-10 px-3 rounded border border-border bg-background text-sm"
                >
                  <option value="light">Light (Paper / Linen)</option>
                  <option value="dark">Dark (Bosphorus Ink / Obsidian)</option>
                </select>
              </div>

              <div>
                <Label htmlFor="theme-radius-select">Corner Geometry</Label>
                <select
                  id="theme-radius-select"
                  value={themeState.radius}
                  onChange={(e) =>
                    handleThemeFieldChange("radius", e.target.value)
                  }
                  className="mt-1 w-full h-10 px-3 rounded border border-border bg-background text-sm"
                >
                  <option value="sharp">Sharp (0px Editorial Plate)</option>
                  <option value="soft">Soft (Architectural Radius)</option>
                </select>
              </div>

              <div>
                <Label htmlFor="theme-density-select">Spatial Density</Label>
                <select
                  id="theme-density-select"
                  value={themeState.density}
                  onChange={(e) =>
                    handleThemeFieldChange("density", e.target.value)
                  }
                  className="mt-1 w-full h-10 px-3 rounded border border-border bg-background text-sm"
                >
                  <option value="airy">Airy (Gallery Spread)</option>
                  <option value="comfortable">Comfortable (Compact)</option>
                </select>
              </div>

              <div>
                <Label htmlFor="theme-motion-select">Motion Level</Label>
                <select
                  id="theme-motion-select"
                  value={themeState.motion.level}
                  onChange={(e) =>
                    handleMotionChange(
                      e.target.value as ThemeConfig["motion"]["level"]
                    )
                  }
                  className="mt-1 w-full h-10 px-3 rounded border border-border bg-background text-sm"
                >
                  <option value="full">Full (GSAP + Lenis Cinema)</option>
                  <option value="subtle">Subtle (Gentle Reveals)</option>
                  <option value="off">Off (Zero Motion)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Layout Variants */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-primary flex items-center gap-2">
              <LayoutGrid className="h-4 w-4" />
              Section Registry & Layout Variants
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pl-6 border-l-2 border-border">
              <div>
                <Label htmlFor="layout-home-select">Home Hero Variant</Label>
                <select
                  id="layout-home-select"
                  value={themeState.layout.home}
                  onChange={(e) =>
                    handleLayoutChange("home", e.target.value as any)
                  }
                  className="mt-1 w-full h-10 px-3 rounded border border-border bg-background text-sm"
                >
                  <option value="masthead">Masthead (7/5 Editorial)</option>
                  <option value="split-cinema">
                    Split Cinema (5/7 Interactive Atlas)
                  </option>
                </select>
              </div>

              <div>
                <Label htmlFor="layout-dest-select">
                  Destination Index Variant
                </Label>
                <select
                  id="layout-dest-select"
                  value={themeState.layout.destinationIndex}
                  onChange={(e) =>
                    handleLayoutChange(
                      "destinationIndex",
                      e.target.value as any
                    )
                  }
                  className="mt-1 w-full h-10 px-3 rounded border border-border bg-background text-sm"
                >
                  <option value="map-index">
                    Map Index (5/7 Tabular Dossier)
                  </option>
                  <option value="grid-mosaic">
                    Grid Mosaic (Alternating 7/5 & 5/7)
                  </option>
                </select>
              </div>

              <div>
                <Label htmlFor="layout-tourcard-select">
                  Tour Card Variant
                </Label>
                <select
                  id="layout-tourcard-select"
                  value={themeState.layout.tourCard}
                  onChange={(e) =>
                    handleLayoutChange("tourCard", e.target.value as any)
                  }
                  className="mt-1 w-full h-10 px-3 rounded border border-border bg-background text-sm"
                >
                  <option value="portrait-4x5">Portrait 4:5 Plate</option>
                  <option value="landscape-row">Landscape Row</option>
                  <option value="minimal-list">Minimal Archival List</option>
                </select>
              </div>

              <div>
                <Label htmlFor="layout-header-select">Header Variant</Label>
                <select
                  id="layout-header-select"
                  value={themeState.layout.header}
                  onChange={(e) =>
                    handleLayoutChange("header", e.target.value as any)
                  }
                  className="mt-1 w-full h-10 px-3 rounded border border-border bg-background text-sm"
                >
                  <option value="swiss-bar">Swiss Hairline Bar</option>
                  <option value="centered-logo">Centered Editorial Logo</option>
                </select>
              </div>

              <div>
                <Label htmlFor="layout-footer-select">Footer Variant</Label>
                <select
                  id="layout-footer-select"
                  value={themeState.layout.footer}
                  onChange={(e) =>
                    handleLayoutChange("footer", e.target.value as any)
                  }
                  className="mt-1 w-full h-10 px-3 rounded border border-border bg-background text-sm"
                >
                  <option value="atlas-columns">Atlas 4-Column Colophon</option>
                  <option value="big-wordmark">Monumental Wordmark</option>
                </select>
              </div>
            </div>
          </div>

          {seoValidationError && (
            <div
              role="alert"
              data-testid="seo-validation-error"
              className="p-4 border border-red-500/40 bg-red-500/10 text-red-600 text-sm rounded"
            >
              {seoValidationError}
            </div>
          )}

          {[
            "SEO",
            "Verified Agency Identity",
            "General",
            "Contact",
            "Footer",
            "Integrations",
          ].map((section) => renderSection(section))}
        </CardContent>

        <CardFooter>
          <Button type="submit" disabled={isUpdating}>
            {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Changes & Revalidate SSR
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
