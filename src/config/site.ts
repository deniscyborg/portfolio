/**
 * Всё, что меняется без правки вёрстки: домен, ссылки, контакты, цены.
 */
export const site = {
  /** Задаётся при сборке: NEXT_PUBLIC_SITE_URL=https://davydovden.com */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://davydovdenis.de",
  name: "Denis Davydov",

  links: {
    linkedin: "https://www.linkedin.com/in/denis-davydov-72bb51338/",
    github: "https://github.com/deniscyborg",
    demoShowcase: "https://report.usermanagementapp.com",
    demoApp: "https://usermanagementapp.com",
    demoAllure: "https://report.usermanagementapp.com/allure/",
    demoRepo: "https://github.com/deniscyborg/UserManagementAppTests",
  },

  /** Личная почта на новом домене. null — блок с почтой не показывается. */
  email: null as string | null,

  /** Телефон показывается на сайте (контакты, Impressum); в README на GitHub не публикуется */
  phone: { display: "+49 176 76343858", tel: "+4917676343858" } as { display: string; tel: string } | null,

  /**
   * true — Kleinunternehmer по §19 UStG: НДС не начисляется, на сайте другая сноска.
   * TODO: уточнить статус ИП.
   */
  smallBusiness: true, // Kleinunternehmer gem. § 19 UStG

  /**
   * Цены в евро без НДС. null — показывается «по запросу».
   * TODO: заполнить перед публикацией.
   */
  prices: {
    audit: null as number | null, // фикс за аудит
    framework: null as number | null, // «от» за фреймворк с нуля
    hourly: null as number | null, // ставка в час
  },
} as const;

export const locales = ["en", "de"] as const;
export type Locale = (typeof locales)[number];

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}
