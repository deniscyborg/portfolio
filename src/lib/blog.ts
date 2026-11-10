import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { marked } from "marked";
import type { Locale } from "@/config/site";

const BLOG_DIR = path.join(process.cwd(), "content", "blog");
const WORDS_PER_MINUTE = 200;

export type PostMeta = {
  slug: string;
  locale: Locale;
  title: string;
  description: string;
  date: string;
  tags: string[];
  readingMinutes: number;
};

export type Post = PostMeta & { html: string };

function readPost(locale: Locale, file: string): Post {
  const raw = fs.readFileSync(path.join(BLOG_DIR, locale, file), "utf8");
  const { data, content } = matter(raw);

  for (const field of ["title", "description", "date"] as const) {
    if (!data[field]) throw new Error(`content/blog/${locale}/${file}: missing "${field}" in front matter`);
  }

  const words = content.trim().split(/\s+/).length;
  return {
    slug: file.replace(/\.md$/, ""),
    locale,
    title: String(data.title),
    description: String(data.description),
    // gray-matter превращает YYYY-MM-DD в Date — приводим к строке
    date: new Date(data.date).toISOString().slice(0, 10),
    tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
    readingMinutes: Math.max(1, Math.round(words / WORDS_PER_MINUTE)),
    // Статьи — наш собственный контент из репозитория, поэтому HTML не санитизируется
    html: marked.parse(content, { async: false }),
  };
}

export function getPosts(locale: Locale): PostMeta[] {
  const dir = path.join(BLOG_DIR, locale);
  if (!fs.existsSync(dir)) return [];

  return fs
    .readdirSync(dir)
    .filter((file) => file.endsWith(".md"))
    .map((file) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars -- в списке тело статьи не нужно
      const { html, ...meta } = readPost(locale, file);
      return meta;
    })
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function getPost(locale: Locale, slug: string): Post | null {
  const file = `${slug}.md`;
  return fs.existsSync(path.join(BLOG_DIR, locale, file)) ? readPost(locale, file) : null;
}
