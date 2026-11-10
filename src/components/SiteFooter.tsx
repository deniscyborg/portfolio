import Link from "next/link";
import { site, type Locale } from "@/config/site";
import type { Dictionary } from "@/i18n";
import { localePath } from "@/lib/format";

export function SiteFooter({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-24 border-t border-line">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 font-mono text-xs text-mute sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p>
          <span className="text-phosphor-dim">$</span> echo &quot;© {year} {site.name}&quot;
        </p>
        <ul className="flex flex-wrap gap-x-5 gap-y-2">
          <li>
            <a href={site.links.demoShowcase} className="hover:text-phosphor">
              {dict.footer.demo}
            </a>
          </li>
          <li>
            <a href={site.links.linkedin} className="hover:text-phosphor">
              LinkedIn
            </a>
          </li>
          <li>
            <Link href={localePath(locale, "/impressum/")} className="hover:text-phosphor">
              {dict.footer.imprint}
            </Link>
          </li>
          <li>
            <Link href={localePath(locale, "/privacy/")} className="hover:text-phosphor">
              {dict.footer.privacy}
            </Link>
          </li>
        </ul>
      </div>
    </footer>
  );
}
