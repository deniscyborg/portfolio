import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { isLocale, locales, site } from "@/config/site";
import { getDictionary } from "@/i18n";
import { fontVariables } from "@/lib/fonts";
import "../globals.css";

// Только /en и /de; любые другие префиксы — 404 на этапе сборки
export const dynamicParams = false;

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export const viewport: Viewport = {
  themeColor: "#070b09",
  colorScheme: "dark",
};

export async function generateMetadata({ params }: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const dict = getDictionary(lang);

  return {
    metadataBase: new URL(site.url),
    title: { default: dict.meta.title, template: `%s · ${site.name}` },
    description: dict.meta.description,
    authors: [{ name: site.name, url: site.links.linkedin }],
    openGraph: {
      type: "website",
      siteName: site.name,
      title: dict.meta.title,
      description: dict.meta.description,
      locale: lang === "de" ? "de_DE" : "en_GB",
      images: [{ url: "/images/hero-1280.webp", width: 1280, height: 720 }],
    },
    icons: { icon: "/favicon.svg" },
  };
}

export default async function LocaleLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  return (
    <html lang={lang} className={fontVariables}>
      <body>{children}</body>
    </html>
  );
}
