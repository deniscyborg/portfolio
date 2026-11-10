import Link from "next/link";
import type { Locale } from "@/config/site";
import type { Dictionary } from "@/i18n";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { localePath } from "@/lib/format";

type Props = {
  locale: Locale;
  dict: Dictionary;
  title: string;
  path: string;
};

/**
 * Заготовка Impressum / Datenschutz.
 * TODO: заполнить юридически корректным текстом до публикации сайта (обязательно для ИП в Германии).
 */
export function LegalPage({ locale, dict, title, path }: Props) {
  return (
    <>
      <SiteHeader locale={locale} dict={dict} path={path} />
      <main className="mx-auto max-w-3xl px-4 pt-20 sm:px-6">
        <h1 className="text-4xl font-semibold text-white">{title}</h1>
        <p className="mt-6 font-mono text-dim">{dict.legal.placeholder}</p>
        <Link href={localePath(locale)} className="mt-10 inline-block font-mono text-sm text-phosphor hover:underline">
          ← {dict.legal.back}
        </Link>
      </main>
      <SiteFooter locale={locale} dict={dict} />
    </>
  );
}
