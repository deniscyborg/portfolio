import { notFound } from "next/navigation";
import { isLocale } from "@/config/site";
import { getDictionary } from "@/i18n";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { BlogTeaser, Contact, PricingTeaser } from "@/components/home/Closing";
import { Experience } from "@/components/home/Experience";
import { Hero } from "@/components/home/Hero";
import { Expertise, Services } from "@/components/home/Services";
import { Work } from "@/components/home/Work";
import { getPosts } from "@/lib/blog";

export default async function HomePage({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = getDictionary(lang);

  return (
    <>
      <SiteHeader locale={lang} dict={dict} />
      <main>
        <Hero locale={lang} dict={dict} />
        <Services dict={dict} />
        <Expertise dict={dict} />
        <Work dict={dict} />
        <Experience dict={dict} />
        <PricingTeaser locale={lang} dict={dict} />
        <BlogTeaser locale={lang} dict={dict} posts={getPosts(lang)} />
        <Contact dict={dict} />
      </main>
      <SiteFooter locale={lang} dict={dict} />
    </>
  );
}
