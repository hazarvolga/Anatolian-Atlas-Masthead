
import React from "react";
import { Helmet } from "react-helmet-async";
import { useSiteSettings } from "@/hooks/useSiteSettings";

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  canonical?: string;
  noIndex?: boolean;
}

export default function SEOHead({
  title,
  description,
  keywords,
  image,
  canonical,
  noIndex,
}: SEOHeadProps) {
  const { settings } = useSiteSettings();

  const metaTitle = title || settings?.site_title || "Mare Sereno";
  const metaDesc = description || settings?.default_meta_description || "Premium travel experiences";
  const metaKeys = keywords || settings?.default_meta_keywords || "travel, mare sereno, tours";
  const ogImage = image || settings?.og_image_url || settings?.site_logo_url;

  return (
    <Helmet>
      <title>{metaTitle}</title>
      <meta name="description" content={metaDesc} />
      <meta name="keywords" content={metaKeys} />
      <meta property="og:title" content={metaTitle} />
      <meta property="og:description" content={metaDesc} />
      {ogImage && <meta property="og:image" content={ogImage} />}
      {canonical && <link rel="canonical" href={canonical} />}
      {settings?.favicon_url && <link rel="icon" href={settings.favicon_url} type="image/png" />}
      {noIndex && <meta name="robots" content="noindex, nofollow" />}
      {/* Structured Data - LocalBusiness örneği */}
      <script type="application/ld+json">{`
        {
          "@context": "https://schema.org",
          "@type": "TravelAgency",
          "name": "${metaTitle}",
          "url": "${canonical || window.location.href}",
          "logo": "${settings?.site_logo_url}",
          "email": "${settings?.contact_email}",
          "telephone": "${settings?.contact_phone}",
          "address": "${settings?.address}",
          "description": "${metaDesc}",
          "sameAs": [${Object.values(settings?.social_media_links || {}).map(u => `"${u}"`).join(", ")}]
        }
      `}</script>
      {/* Google Analytics & Tag Manager Scripts */}
      {settings?.google_analytics_id && (
        <script async src={`https://www.googletagmanager.com/gtag/js?id=${settings.google_analytics_id}`}></script>
      )}
      {settings?.google_analytics_id && (
        <script>{`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${settings.google_analytics_id}');
        `}</script>
      )}
      {settings?.google_tag_manager_id && (
        <script>{`
          (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start': new Date().getTime(), event:'gtm.js'});var f=d.getElementsByTagName(s)[0], j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src= 'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f); })(window,document,'script','dataLayer','${settings.google_tag_manager_id}');
        `}</script>
      )}
    </Helmet>
  );
}
