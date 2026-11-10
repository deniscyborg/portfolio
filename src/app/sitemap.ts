import type { MetadataRoute } from "next";
import { locales, site } from "@/config/site";
import { getPosts } from "@/lib/blog";

export const dynamic = "force-static";

/** Карта сайта для поисковиков: каждая страница с её языковыми версиями (hreflang) */
export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ["/", "/pricing/", "/blog/", ...getPosts("en").map((p) => `/blog/${p.slug}/`)];

  return paths.flatMap((path) =>
    locales.map((lang) => ({
      url: `${site.url}/${lang}${path}`,
      changeFrequency: path === "/" ? ("monthly" as const) : ("yearly" as const),
      priority: path === "/" ? 1 : path === "/pricing/" ? 0.8 : 0.6,
      alternates: {
        languages: Object.fromEntries(locales.map((l) => [l, `${site.url}/${l}${path}`])),
      },
    })),
  );
}
