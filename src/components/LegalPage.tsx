import Link from "next/link";
import type { ReactNode } from "react";
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
  children: ReactNode;
};

/** Layout for legal pages: header, title, text, back link. */
export function LegalPage({ locale, dict, title, path, children }: Props) {
  return (
    <>
      <SiteHeader locale={locale} dict={dict} path={path} />
      <main className="mx-auto max-w-3xl px-4 pt-20 sm:px-6">
        <h1 className="text-4xl font-semibold text-white">{title}</h1>
        <div className="mt-6">{children}</div>
        <Link href={localePath(locale)} className="mt-10 inline-block font-mono text-sm text-phosphor hover:underline">
          ← {dict.legal.back}
        </Link>
      </main>
      <SiteFooter locale={locale} dict={dict} />
    </>
  );
}
