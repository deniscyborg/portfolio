import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { notFound } from "next/navigation";
import { isLocale, site } from "@/config/site";
import { getDictionary } from "@/i18n";
import { ButtonLink } from "@/components/ButtonLink";
import { PricingCards, VatNote } from "@/components/PricingCards";
import { Section } from "@/components/Section";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

export async function generateMetadata({ params }: PageProps<"/[lang]/pricing">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const t = getDictionary(lang).pricing;
  return pageMetadata(lang, "/pricing/", { title: t.pageTitle, description: t.pageLead });
}

export default async function PricingPage({ params }: PageProps<"/[lang]/pricing">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = getDictionary(lang);
  const t = dict.pricing;

  return (
    <>
      <SiteHeader locale={lang} dict={dict} path="/pricing/" />
      <main>
        <header className="mx-auto max-w-6xl px-4 pt-20 sm:px-6">
          <p className="font-mono text-sm text-phosphor">
            <span className="text-mute">$ </span>cat pricing.md
          </p>
          <h1 className="mt-4 max-w-3xl text-4xl leading-tight font-semibold text-white sm:text-5xl">{t.pageTitle}</h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-dim">{t.pageLead}</p>
        </header>

        <div className="mx-auto max-w-6xl px-4 pt-14 sm:px-6">
          <PricingCards locale={lang} dict={dict} />
          <VatNote dict={dict} />
        </div>

        <Section index="01" title={t.process.title} lead={t.process.lead}>
          <ol className="grid gap-px overflow-hidden rounded-md border border-line bg-line md:grid-cols-2 lg:grid-cols-4">
            {t.process.steps.map((step, i) => (
              <li key={step.title} className="bg-panel p-6">
                <span className="font-mono text-sm text-phosphor">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-3 font-semibold text-white">{step.title}</h3>
                <p className="mt-2 text-[0.95rem] leading-relaxed text-dim">{step.text}</p>
              </li>
            ))}
          </ol>
        </Section>

        <Section index="02" title={t.terms.title}>
          <ul className="grid gap-x-10 gap-y-4 md:grid-cols-2">
            {t.terms.items.map((item) => (
              <li key={item} className="flex gap-3 leading-relaxed text-ink">
                <span className="font-mono text-phosphor" aria-hidden="true">
                  &gt;
                </span>
                {item}
              </li>
            ))}
          </ul>
        </Section>

        <Section index="03" title={t.faq.title}>
          <div className="divide-y divide-line rounded-md border border-line bg-panel">
            {t.faq.items.map((item) => (
              <details key={item.q} className="group px-6 py-5">
                <summary className="flex cursor-pointer list-none items-start justify-between gap-6 font-medium text-white">
                  {item.q}
                  <span className="font-mono text-phosphor transition-transform group-open:rotate-45" aria-hidden="true">
                    +
                  </span>
                </summary>
                <p className="mt-3 max-w-3xl leading-relaxed text-dim">{item.a}</p>
              </details>
            ))}
          </div>
        </Section>

        <div className="mx-auto max-w-6xl px-4 pt-16 sm:px-6">
          <div className="bracket flex flex-col items-start gap-6 rounded-md border border-line-strong bg-panel p-8 md:flex-row md:items-center md:justify-between">
            <p className="max-w-xl text-xl font-medium text-white">{t.ctaText}</p>
            <ButtonLink href={site.links.linkedin} external>
              {t.cta}
            </ButtonLink>
          </div>
        </div>
      </main>
      <SiteFooter locale={lang} dict={dict} />
    </>
  );
}
