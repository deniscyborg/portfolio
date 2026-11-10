import Link from "next/link";
import { site, type Locale } from "@/config/site";
import type { Dictionary } from "@/i18n";
import { ButtonLink } from "@/components/ButtonLink";
import { PricingCards, VatNote } from "@/components/PricingCards";
import { Section } from "@/components/Section";
import type { PostMeta } from "@/lib/blog";
import { formatDate, localePath } from "@/lib/format";

export function PricingTeaser({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const t = dict.pricing;
  return (
    <Section id="pricing" index="05" title={t.title} lead={t.lead}>
      <PricingCards locale={locale} dict={dict} compact />
      <VatNote dict={dict} />
      <div className="mt-8">
        <ButtonLink href={localePath(locale, "/pricing/")} variant="ghost">
          {t.homeLink}
        </ButtonLink>
      </div>
    </Section>
  );
}

export function BlogTeaser({ locale, dict, posts }: { locale: Locale; dict: Dictionary; posts: PostMeta[] }) {
  const t = dict.blog;
  if (posts.length === 0) return null;
  return (
    <Section id="blog" index="06" title={t.title} lead={t.lead}>
      <PostList locale={locale} dict={dict} posts={posts.slice(0, 3)} />
      <div className="mt-8">
        <ButtonLink href={localePath(locale, "/blog/")} variant="ghost">
          {t.all}
        </ButtonLink>
      </div>
    </Section>
  );
}

export function PostList({ locale, dict, posts }: { locale: Locale; dict: Dictionary; posts: PostMeta[] }) {
  return (
    <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => (
        <li key={post.slug}>
          <Link
            href={localePath(locale, `/blog/${post.slug}/`)}
            className="group flex h-full flex-col rounded-md border border-line bg-panel p-6 transition-colors hover:border-phosphor-dim hover:bg-panel-2"
          >
            <p className="font-mono text-xs text-mute">
              {formatDate(post.date, locale)} · {dict.blog.minutes.replace("{n}", String(post.readingMinutes))}
            </p>
            <h3 className="mt-3 text-lg leading-snug font-semibold text-white group-hover:text-phosphor">{post.title}</h3>
            <p className="mt-3 leading-relaxed text-dim">{post.description}</p>
            <span className="mt-auto pt-5 font-mono text-sm text-phosphor">{dict.blog.read} →</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

export function Contact({ dict }: { dict: Dictionary }) {
  const t = dict.contact;
  const channels = [
    { label: t.linkedin, value: "linkedin.com/in/denis-davydov", href: site.links.linkedin },
    { label: t.github, value: "github.com/deniscyborg", href: site.links.github },
    ...(site.email ? [{ label: t.email, value: site.email, href: `mailto:${site.email}` }] : []),
    ...(site.phone ? [{ label: t.phone, value: site.phone.display, href: `tel:${site.phone.tel}` }] : []),
  ];

  return (
    <Section id="contact" index="07" title={t.title}>
      <div className="bracket grid gap-10 rounded-md border border-line-strong bg-panel p-8 md:grid-cols-2 md:p-12">
        <div>
          <p className="text-3xl leading-tight font-semibold text-white">{t.headline}</p>
          <p className="mt-4 leading-relaxed text-dim">{t.text}</p>
          <div className="mt-8">
            <ButtonLink href={site.links.linkedin} external>
              {dict.hero.ctaPrimary}
            </ButtonLink>
          </div>
        </div>
        <dl className="space-y-5 font-mono text-sm">
          {channels.map((c) => (
            <div key={c.label}>
              <dt className="text-xs text-mute">{c.label.toLowerCase()}:</dt>
              <dd>
                <a href={c.href} className="text-ink hover:text-phosphor">
                  {c.value}
                </a>
              </dd>
            </div>
          ))}
          <div>
            <dt className="text-xs text-mute">location:</dt>
            <dd className="text-ink">{t.location}</dd>
          </div>
        </dl>
      </div>
    </Section>
  );
}
