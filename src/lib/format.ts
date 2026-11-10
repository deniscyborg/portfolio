import type { Locale } from "@/config/site";

const LOCALE_TAGS: Record<Locale, string> = { en: "en-GB", de: "de-DE" };

export function formatPrice(value: number, locale: Locale): string {
  return new Intl.NumberFormat(LOCALE_TAGS[locale], {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatDate(iso: string, locale: Locale): string {
  return new Intl.DateTimeFormat(LOCALE_TAGS[locale], {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(iso));
}

/** Путь страницы с учётом языка: localePath("de", "/blog/") -> "/de/blog/" */
export function localePath(locale: Locale, path = "/"): string {
  return `/${locale}${path.startsWith("/") ? path : `/${path}`}`;
}
