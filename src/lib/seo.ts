import type { Metadata } from "next";
import { locales, site, type Locale } from "@/config/site";

/** Link preview image: JPG 1200×630 — messengers and social networks do not always support WebP */
export const ogImage = { url: "/og.jpg", width: 1200, height: 630, alt: "Denis Davydov — software test automation, freelance SDET in Berlin" };

type PageSeo = {
  title?: string;
  description: string;
  type?: "website" | "article";
  publishedTime?: string;
  /** Preview title if it differs from title (the home page title comes from a template) */
  ogTitle?: string;
};

/**
 * Metadata for one page: canonical, language versions (hreflang) and Open Graph.
 * path: path without the language, with a trailing slash: "/", "/pricing/", "/blog/slug/".
 */
export function pageMetadata(lang: Locale, path: string, seo: PageSeo): Metadata {
  const url = `/${lang}${path}`;
  const languages: Record<string, string> = Object.fromEntries(locales.map((l) => [l, `/${l}${path}`]));
  languages["x-default"] = `/en${path}`;
  const ogTitle = seo.ogTitle ?? seo.title;

  return {
    ...(seo.title ? { title: seo.title } : {}),
    description: seo.description,
    alternates: { canonical: url, languages },
    openGraph: {
      type: seo.type ?? "website",
      url,
      siteName: site.name,
      title: ogTitle,
      description: seo.description,
      locale: lang === "de" ? "de_DE" : "en_GB",
      alternateLocale: lang === "de" ? ["en_GB"] : ["de_DE"],
      images: [ogImage],
      ...(seo.publishedTime ? { publishedTime: seo.publishedTime } : {}),
    },
    twitter: { card: "summary_large_image", title: ogTitle, description: seo.description, images: [ogImage.url] },
  };
}
