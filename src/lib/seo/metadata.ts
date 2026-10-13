import type { Metadata } from "next";
import type { SeoConfig } from "./config";

export function applySeoConfig(defaults: Metadata, seo: SeoConfig): Metadata {
  return {
    ...defaults,
    ...(seo.seo_canonical_url
      ? { metadataBase: new URL(seo.seo_canonical_url) }
      : {}),
    ...(seo.seo_default_title
      ? {
          title: {
            default: seo.seo_default_title,
            template: "%s | DA LUZ CONSCIENTE",
          },
        }
      : {}),
    ...(seo.seo_default_description
      ? { description: seo.seo_default_description }
      : {}),
    ...(seo.seo_default_keywords?.length
      ? { keywords: seo.seo_default_keywords }
      : {}),
    openGraph: {
      ...defaults.openGraph,
      ...(seo.seo_og_type ? { type: seo.seo_og_type } : {}),
      ...(seo.seo_canonical_url ? { url: seo.seo_canonical_url } : {}),
      ...(seo.seo_og_title || seo.seo_default_title
        ? { title: seo.seo_og_title || seo.seo_default_title }
        : {}),
      ...(seo.seo_og_description || seo.seo_default_description
        ? { description: seo.seo_og_description || seo.seo_default_description }
        : {}),
      ...(seo.seo_og_image_url
        ? { images: [{ url: seo.seo_og_image_url }] }
        : {}),
    },
    twitter: {
      ...defaults.twitter,
      ...(seo.seo_twitter_card_type ? { card: seo.seo_twitter_card_type } : {}),
      ...(seo.seo_og_title || seo.seo_default_title
        ? { title: seo.seo_og_title || seo.seo_default_title }
        : {}),
      ...(seo.seo_og_description || seo.seo_default_description
        ? { description: seo.seo_og_description || seo.seo_default_description }
        : {}),
      ...(seo.seo_og_image_url ? { images: [seo.seo_og_image_url] } : {}),
    },
    verification: {
      ...defaults.verification,
      ...(seo.seo_google_site_verification
        ? { google: seo.seo_google_site_verification }
        : {}),
      ...(seo.seo_bing_webmaster_id
        ? {
            other: {
              ...defaults.verification?.other,
              "msvalidate.01": seo.seo_bing_webmaster_id,
            },
          }
        : {}),
    },
  };
}
