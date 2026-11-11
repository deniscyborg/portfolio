import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, site } from "@/config/site";
import { getDictionary } from "@/i18n";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { BlogTeaser, Contact, PricingTeaser } from "@/components/home/Closing";
import { About } from "@/components/home/About";
import { Experience } from "@/components/home/Experience";
import { Hero } from "@/components/home/Hero";
import { Expertise, Services } from "@/components/home/Services";
import { Work } from "@/components/home/Work";
import { getPosts } from "@/lib/blog";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const { meta } = getDictionary(lang);
  // No title here: the home page takes it from the layout without the "· Denis Davydov" template
  return pageMetadata(lang, "/", { description: meta.description, ogTitle: meta.title });
}

export default async function HomePage({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = getDictionary(lang);

  // Structured data: tells search engines this is a test automation service based in Berlin
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: `${site.name} — ${dict.meta.serviceName}`,
    description: dict.meta.description,
    url: `${site.url}/${lang}/`,
    image: `${site.url}/og.jpg`,
    email: site.email ?? undefined,
    telephone: site.phone?.tel,
    address: { "@type": "PostalAddress", addressLocality: site.address.city, postalCode: site.address.zip, addressCountry: "DE" },
    areaServed: [{ "@type": "Country", name: "Germany" }, { "@type": "Place", name: "European Union" }],
    availableLanguage: ["en", "de", "ru"],
    founder: { "@type": "Person", name: site.name, jobTitle: "Freelance SDET", sameAs: [site.links.linkedin, site.links.github] },
    sameAs: [site.links.linkedin, site.links.github],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: dict.meta.serviceName,
      itemListElement: dict.services.items.map((s) => ({
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: s.title, description: s.text },
      })),
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <SiteHeader locale={lang} dict={dict} />
      <main>
        <Hero locale={lang} dict={dict} />
        <Services dict={dict} />
        <Expertise dict={dict} />
        <Work dict={dict} />
        <Experience dict={dict} />
        <About dict={dict} />
        <PricingTeaser locale={lang} dict={dict} />
        <BlogTeaser locale={lang} dict={dict} posts={getPosts(lang)} />
        <Contact dict={dict} />
      </main>
      <SiteFooter locale={lang} dict={dict} />
    </>
  );
}
