"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api/client";
import { toast } from "sonner";
import { siteConfig } from "@/config/site";
import defaultThemeConfig, { type ThemeConfig } from "@/config/theme.config";

export type SiteSettings = {
  id: string;
  site_title: string;
  site_tagline?: string;
  site_logo_url?: string;
  favicon_url?: string;
  contact_email?: string;
  contact_phone?: string;
  address?: string;
  social_media_links?: Record<string, string>;
  default_meta_description?: string;
  default_meta_keywords?: string;
  canonical_url?: string;
  og_image?: string;
  og_image_url?: string;
  primary_color?: string;
  secondary_color?: string;
  copyright_text?: string;
  google_analytics_id?: string;
  google_tag_manager_id?: string;
  company_name?: string;
  tursab_license_no?: string;
  tax_id?: string;
  website_url?: string;
  support_email?: string;
  email_footer_text?: string;
  email_header_text?: string;
  unsubscribe_text?: string;
  theme_config?: ThemeConfig;
};

const DEFAULT_SITE_SETTINGS: SiteSettings = {
  id: "default-site-settings",
  site_title: siteConfig.brand.name,
  site_tagline: siteConfig.brand.tagline,
  contact_email: siteConfig.contact.email,
  contact_phone: siteConfig.contact.phone,
  address: siteConfig.contact.addressLines.join("\n"),
  social_media_links: siteConfig.social,
  default_meta_description: siteConfig.brand.description,
  canonical_url: "",
  og_image: "/demo/istanbul-bosphorus.jpg",
  og_image_url: "/demo/istanbul-bosphorus.jpg",
  company_name: "",
  tursab_license_no: siteConfig.brand.tursabLicenseNo,
  tax_id: "",
  theme_config: defaultThemeConfig,
};

function sanitizeSiteSettings(
  rawInput: any
): SiteSettings {
  const raw: Partial<SiteSettings> | null | undefined =
    rawInput?.value && typeof rawInput.value === "object"
      ? rawInput.value
      : rawInput;

  if (!raw) return DEFAULT_SITE_SETTINGS;
  const isLegacyTitle =
    !raw.site_title || /mare\s*sereno/i.test(raw.site_title);
  const isLegacyEmail =
    !raw.contact_email || /maresereno/i.test(raw.contact_email);
  const isLegacyAddress =
    !raw.address || /costa\s*bella|seaside\s*boulevard/i.test(raw.address);

  return {
    ...DEFAULT_SITE_SETTINGS,
    ...raw,
    site_title: isLegacyTitle ? siteConfig.brand.name : raw.site_title!,
    site_tagline:
      !raw.site_tagline || /resort|paradise/i.test(raw.site_tagline)
        ? siteConfig.brand.tagline
        : raw.site_tagline,
    contact_email: isLegacyEmail ? siteConfig.contact.email : raw.contact_email,
    contact_phone:
      !raw.contact_phone || raw.contact_phone.startsWith("+39")
        ? siteConfig.contact.phone
        : raw.contact_phone,
    address: isLegacyAddress
      ? siteConfig.contact.addressLines.join("\n")
      : raw.address,
    theme_config: raw.theme_config
      ? {
          ...defaultThemeConfig,
          ...raw.theme_config,
          motion: {
            ...defaultThemeConfig.motion,
            ...(raw.theme_config.motion || {}),
          },
          layout: {
            ...defaultThemeConfig.layout,
            ...(raw.theme_config.layout || {}),
          },
        }
      : defaultThemeConfig,
  };
}

export function useSiteSettings() {
  const queryClient = useQueryClient();

  const { data: settings, isLoading, error, refetch } = useQuery<SiteSettings>({
    queryKey: ["site-settings"],
    queryFn: async () => {
      try {
        const { data } = await api.get("/api/site-settings");
        return sanitizeSiteSettings(data);
      } catch {
        return DEFAULT_SITE_SETTINGS;
      }
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (updates: Partial<SiteSettings>) => {
      const { data } = await api.put("/api/admin/site-settings", updates);
      return data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["site-settings"], sanitizeSiteSettings(data));
      toast.success("Site settings and SSR theme updated.");
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to update settings."
      );
    },
  });

  return {
    settings: settings ?? DEFAULT_SITE_SETTINGS,
    isLoading,
    error,
    refetch,
    updateSettings: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
  };
}
