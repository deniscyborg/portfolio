import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/config/site";
import { getDictionary } from "@/i18n";
import { LegalPage } from "@/components/LegalPage";

export async function generateMetadata({ params }: PageProps<"/[lang]/impressum">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  return { title: getDictionary(lang).legal.imprintTitle, robots: { index: false } };
}

export default async function ImprintPage({ params }: PageProps<"/[lang]/impressum">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = getDictionary(lang);
  return <LegalPage locale={lang} dict={dict} title={dict.legal.imprintTitle} path="/impressum/" />;
}
