import { siteConfig } from "@/config/site.config";
import type { DemoTour } from "@/lib/data/demo-content";
import type { Destination } from "@/hooks/useDestinations";
import type { JournalArticle } from "@/lib/data/journal-content";
import {
  buildAbsoluteLocalizedUrl,
  type SupportedLocale,
} from "@/lib/i18n/locale-utils";

function parseCoordsPair(coords?: string): {
  latitude: number;
  longitude: number;
} | null {
  if (!coords) return null;
  const nums = coords.match(/\d+(?:\.\d+)?/g);
  if (!nums || nums.length < 2) return null;
  const latitude = Number(nums[0]);
  const longitude = Number(nums[1]);
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return null;
  return { latitude, longitude };
}

export function buildTravelAgencyJsonLd(locale: SupportedLocale = "en") {
  const baseUrl = siteConfig.seo.siteUrl.replace(/\/$/, "");
  const officeGeo = parseCoordsPair(siteConfig.contact.coordinates);
  const sameAs = [
    siteConfig.social.instagram,
    siteConfig.social.youtube,
    siteConfig.social.linkedin,
  ].filter(Boolean);

  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    "@id": `${baseUrl}/#organization`,
    name: siteConfig.brand.name,
    alternateName: siteConfig.brand.tagline,
    description: siteConfig.brand.description,
    url: buildAbsoluteLocalizedUrl("/", locale),
    currenciesAccepted: siteConfig.currency.code,
  };

  if (siteConfig.brand.tursabLicenseNo) {
    schema.identifier = {
      "@type": "PropertyValue",
      name: "TÜRSAB Travel Agency License",
      value: siteConfig.brand.tursabLicenseNo,
    };
  }

  if (siteConfig.contact.phone) {
    schema.telephone = siteConfig.contact.phone;
  }

  if (siteConfig.contact.email) {
    schema.email = siteConfig.contact.email;
  }

  if (siteConfig.contact.addressLines.length > 0) {
    schema.address = {
      "@type": "PostalAddress",
      streetAddress: siteConfig.contact.addressLines.join(", "),
      addressCountry: "TR",
    };
  }

  if (officeGeo) {
    schema.geo = {
      "@type": "GeoCoordinates",
      latitude: officeGeo.latitude,
      longitude: officeGeo.longitude,
    };
  }

  if (sameAs.length > 0) {
    schema.sameAs = sameAs;
  }

  return schema;
}

export function buildBreadcrumbJsonLd(
  items: Array<{ name: string; path: string }>,
  locale: SupportedLocale = "en"
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: item.name,
      item: buildAbsoluteLocalizedUrl(item.path, locale),
    })),
  };
}

export function buildTouristTripJsonLd(
  tour: DemoTour,
  locale: SupportedLocale = "en"
) {
  const baseUrl = siteConfig.seo.siteUrl.replace(/\/$/, "");
  const tourUrl = buildAbsoluteLocalizedUrl(`/tours/${tour.id}`, locale);
  const itineraryItems = Array.isArray(tour.itinerary)
    ? tour.itinerary.map((dayItem, index) => ({
        "@type": "ListItem",
        position: dayItem.day || index + 1,
        item: {
          "@type": "TouristAttraction",
          name: `Day ${dayItem.day || index + 1}: ${dayItem.title}`,
          description: dayItem.description,
        },
      }))
    : [];

  return {
    "@context": "https://schema.org",
    "@type": ["TouristTrip", "Product"],
    "@id": `${tourUrl}#trip`,
    name: tour.title || tour.name,
    description: tour.description,
    image:
      tour.images && tour.images.length > 0 ? tour.images : [tour.image_url],
    url: tourUrl,
    touristType: [
      "Cultural & Archaeological Travelers",
      "Small-Group Private Expeditions",
    ],
    provider: {
      "@type": "TravelAgency",
      "@id": `${baseUrl}/#organization`,
      name: siteConfig.brand.name,
    },
    ...(itineraryItems.length > 0
      ? {
          itinerary: {
            "@type": "ItemList",
            numberOfItems: itineraryItems.length,
            itemListElement: itineraryItems,
          },
        }
      : {}),
    offers: {
      "@type": "Offer",
      url: buildAbsoluteLocalizedUrl(`/book/${tour.id}`, locale),
      priceCurrency: siteConfig.currency.code,
      price: String(tour.price_adult || tour.price || 0),
      availability: "https://schema.org/InStock",
      seller: {
        "@type": "TravelAgency",
        name: siteConfig.brand.name,
      },
    },
  };
}

export function buildTourFaqJsonLd(tour: DemoTour) {
  const title = tour.title || tour.name;
  const durationDays = tour.duration || 1;
  const maxGuests = tour.max_participants || tour.max_group_size || 10;
  const price = tour.price_adult || tour.price || 0;

  const faqs = [
    {
      question: `How many days is the ${title} itinerary and what is the maximum group size?`,
      answer: `This route spans ${durationDays} ${
        durationDays === 1 ? "day" : "days"
      } departing from ${
        tour.departure_location || tour.city || "Türkiye"
      }, capped at a maximum of ${maxGuests} guests per departure.`,
    },
    {
      question: `What is included in the €${price} per-guest tariff for ${title}?`,
      answer:
        tour.included && tour.included.length > 0
          ? `The tariff includes: ${tour.included.join("; ")}.`
          : "The tariff includes specialist guiding, private climate-controlled ground transport, and scheduled site entry tickets.",
    },
    {
      question: `How do reservations and the 20% deposit option work?`,
      answer: `Reservations can be settled in full (€${price}) or secured with a 20% deposit (€${Math.round(
        price * 0.2
      )}) via the online reservation ledger.`,
    },
  ];

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.answer,
      },
    })),
  };
}

export function buildTouristDestinationJsonLd(
  destination: Destination,
  relatedTours: DemoTour[] = [],
  locale: SupportedLocale = "en"
) {
  const destUrl = buildAbsoluteLocalizedUrl(
    `/destinations/${destination.id}`,
    locale
  );
  const geo = parseCoordsPair(destination.coords);

  return {
    "@context": "https://schema.org",
    "@type": "TouristDestination",
    "@id": `${destUrl}#destination`,
    name: destination.name,
    description: destination.description,
    url: destUrl,
    image: destination.image_url,
    touristType: ["Archaeology", "Architecture", "Culinary & Coastal Heritage"],
    ...(geo
      ? {
          geo: {
            "@type": "GeoCoordinates",
            latitude: geo.latitude,
            longitude: geo.longitude,
          },
        }
      : {}),
    ...(relatedTours.length > 0
      ? {
          includesAttraction: relatedTours.map((t) => ({
            "@type": "TouristAttraction",
            name: t.title || t.name,
            url: buildAbsoluteLocalizedUrl(`/tours/${t.id}`, locale),
          })),
        }
      : {}),
  };
}

export function buildJournalArticleJsonLd(
  article: JournalArticle,
  locale: SupportedLocale = "en"
) {
  const baseUrl = siteConfig.seo.siteUrl.replace(/\/$/, "");
  const articleUrl = buildAbsoluteLocalizedUrl(
    `/journal/${article.slug}`,
    locale
  );

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${articleUrl}#article`,
    headline: article.title,
    alternativeHeadline: article.subtitle,
    description: article.excerpt,
    image: [article.heroImage],
    datePublished: article.publishedAt,
    dateModified: article.publishedAt,
    author: {
      "@type": "Organization",
      name: article.author.name,
    },
    publisher: {
      "@type": "TravelAgency",
      "@id": `${baseUrl}/#organization`,
      name: siteConfig.brand.name,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": articleUrl,
    },
    citation: article.citations.map(
      (c) => `${c.source}, "${c.publication}" (${c.year})`
    ),
  };
}
