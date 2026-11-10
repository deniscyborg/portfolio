import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { notFound } from "next/navigation";
import { isLocale } from "@/config/site";
import { getDictionary } from "@/i18n";
import { PostList } from "@/components/home/Closing";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { getPosts } from "@/lib/blog";

export async function generateMetadata({ params }: PageProps<"/[lang]/blog">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const t = getDictionary(lang).blog;
  return pageMetadata(lang, "/blog/", { title: t.pageTitle, description: t.lead });
}

export default async function BlogPage({ params }: PageProps<"/[lang]/blog">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = getDictionary(lang);
  const posts = getPosts(lang);

  return (
    <>
      <SiteHeader locale={lang} dict={dict} path="/blog/" />
      <main className="mx-auto max-w-6xl px-4 pt-20 sm:px-6">
        <p className="font-mono text-sm text-phosphor">
          <span className="text-mute">$ </span>ls ./blog
        </p>
        <h1 className="mt-4 text-4xl font-semibold text-white sm:text-5xl">{dict.blog.pageTitle}</h1>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-dim">{dict.blog.lead}</p>
        <div className="mt-12">
          {posts.length > 0 ? (
            <PostList locale={lang} dict={dict} posts={posts} />
          ) : (
            <p className="font-mono text-dim">{dict.blog.empty}</p>
          )}
        </div>
      </main>
      <SiteFooter locale={lang} dict={dict} />
    </>
  );
}
