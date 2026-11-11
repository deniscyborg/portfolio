/**
 * Everything that changes without touching the layout: domain, links, contacts, prices.
 */
export const site = {
  /** Set at build time: NEXT_PUBLIC_SITE_URL=https://davydovden.com */
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

  /** Contact email on the site's domain. null hides the email block. */
  email: "info@davydovdenis.de" as string | null,

  telegram: { handle: "@Dcyborg", url: "https://t.me/Dcyborg" } as { handle: string; url: string } | null,

  /** Phone is shown on the site (contacts, Impressum); not published in the GitHub README */
  phone: { display: "+49 176 76343858", tel: "+4917676343858" } as { display: string; tel: string } | null,

  /** Ladungsfähige Anschrift for the Impressum (§ 5 DDG) */
  address: { street: "Karl-Stieler-Str. 18", zip: "12167", city: "Berlin", country: { en: "Germany", de: "Deutschland" } },

  /** USt-IdNr, shown in the Impressum */
  vatId: "DE459105802",

  /**
   * true: Kleinunternehmer under §19 UStG — no VAT charged, the site shows a different note.
   * TODO: confirm the business status.
   */
  smallBusiness: true, // Kleinunternehmer gem. § 19 UStG

  /**
   * Prices in EUR excluding VAT. null shows "on request".
   * TODO: fill in.
   */
  prices: {
    audit: null as number | null, // fixed price for the audit
    framework: null as number | null, // "from" price for a framework from scratch
    hourly: null as number | null, // hourly rate
  },
} as const;

export const locales = ["en", "de"] as const;
export type Locale = (typeof locales)[number];

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}
