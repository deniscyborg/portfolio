import type { Metadata } from "next";
import { locales, site, type Locale } from "@/config/site";

/** Картинка для превью ссылок: JPG 1200×630 — мессенджеры и соцсети не всегда понимают WebP */
export const ogImage = { url: "/og.jpg", width: 1200, height: 630, alt: "Denis Davydov — software test automation, freelance SDET in Berlin" };

type PageSeo = {
  title?: string;
  description: string;
  type?: "website" | "article";
  publishedTime?: string;
  /** Заголовок для превью, если отличается от title (у главной title задан шаблоном) */
  ogTitle?: string;
};

/**
 * Метаданные одной страницы: canonical, языковые версии (hreflang) и Open Graph.
 * path — путь без языка, с завершающим слэшем: "/", "/pricing/", "/blog/slug/".
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
