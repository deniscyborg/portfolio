import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale, locales, site } from "@/config/site";
import { getDictionary } from "@/i18n";
import { ButtonLink } from "@/components/ButtonLink";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { getPost, getPosts } from "@/lib/blog";
import { formatDate, localePath } from "@/lib/format";

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.flatMap((lang) => getPosts(lang).map((post) => ({ lang, slug: post.slug })));
}

export async function generateMetadata({ params }: PageProps<"/[lang]/blog/[slug]">): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!isLocale(lang)) return {};
  const post = getPost(lang, slug);
  if (!post) return {};
  return pageMetadata(lang, `/blog/${slug}/`, {
    title: post.title,
    description: post.description,
    type: "article",
    publishedTime: post.date,
  });
}

export default async function PostPage({ params }: PageProps<"/[lang]/blog/[slug]">) {
  const { lang, slug } = await params;
  if (!isLocale(lang)) notFound();
  const post = getPost(lang, slug);
  if (!post) notFound();
  const dict = getDictionary(lang);
  // Translations share the same slug; without a translation the switcher links to the post list
  const other = lang === "en" ? "de" : "en";
  const switchPath = getPost(other, slug) ? `/blog/${slug}/` : "/blog/";

  return (
    <>
      <SiteHeader locale={lang} dict={dict} path={switchPath} />
      <main className="mx-auto max-w-3xl px-4 pt-16 sm:px-6">
        <Link href={localePath(lang, "/blog/")} className="font-mono text-sm text-dim hover:text-phosphor">
          ← {dict.blog.back}
        </Link>
        <article className="mt-8">
          <header className="border-b border-line pb-8">
            <p className="font-mono text-xs text-mute">
              {formatDate(post.date, lang)} · {dict.blog.minutes.replace("{n}", String(post.readingMinutes))}
            </p>
            <h1 className="mt-4 text-3xl leading-tight font-semibold text-white sm:text-4xl">{post.title}</h1>
            <p className="mt-4 text-lg leading-relaxed text-dim">{post.description}</p>
            {post.tags.length > 0 && (
              <ul className="mt-5 flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <li key={tag} className="rounded bg-panel-2 px-2 py-0.5 font-mono text-xs text-dim">
                    #{tag}
                  </li>
                ))}
              </ul>
            )}
          </header>
          <div className="prose-terminal" dangerouslySetInnerHTML={{ __html: post.html }} />
        </article>

        <aside className="bracket mt-16 rounded-md border border-line-strong bg-panel p-7">
          <p className="text-lg font-medium text-white">{dict.blog.ctaText}</p>
          <div className="mt-5">
            <ButtonLink href={site.links.linkedin} external>
              {dict.hero.ctaPrimary}
            </ButtonLink>
          </div>
        </aside>
      </main>
      <SiteFooter locale={lang} dict={dict} />
    </>
  );
}
