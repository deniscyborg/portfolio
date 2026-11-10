import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { notFound } from "next/navigation";
import { isLocale } from "@/config/site";
import { getDictionary } from "@/i18n";
import { LegalPage } from "@/components/LegalPage";
import { PrivacyContent } from "@/components/legal/LegalContent";

export async function generateMetadata({ params }: PageProps<"/[lang]/privacy">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const title = getDictionary(lang).legal.privacyTitle;
  return { ...pageMetadata(lang, "/privacy/", { title, description: title }), robots: { index: false } };
}

export default async function PrivacyPage({ params }: PageProps<"/[lang]/privacy">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = getDictionary(lang);
  return <LegalPage locale={lang} dict={dict} title={dict.legal.privacyTitle} path="/privacy/">
      <PrivacyContent locale={lang} />
    </LegalPage>;
}
