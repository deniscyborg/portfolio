import Link from "next/link";
import type { Locale } from "@/config/site";
import type { Dictionary } from "@/i18n";
import { localePath } from "@/lib/format";

type Props = {
  locale: Locale;
  dict: Dictionary;
  /** Путь текущей страницы без префикса языка — для переключателя EN/DE */
  path?: string;
};

export function SiteHeader({ locale, dict, path = "/" }: Props) {
  const home = localePath(locale);
  const items = [
    { href: `${home}#services`, label: dict.nav.services },
    { href: `${home}#work`, label: dict.nav.work },
    { href: `${home}#experience`, label: dict.nav.experience },
    { href: localePath(locale, "/pricing/"), label: dict.nav.pricing },
    { href: localePath(locale, "/blog/"), label: dict.nav.blog },
    { href: `${home}#contact`, label: dict.nav.contact },
  ];
  const other: Locale = locale === "en" ? "de" : "en";

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bg/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-6 gap-y-2 px-4 py-3 sm:h-16 sm:flex-nowrap sm:px-6 sm:py-0">
        <Link href={home} className="shrink-0 font-mono text-sm text-ink hover:text-phosphor">
          <span className="text-phosphor">~/</span>davydov<span className="cursor !h-[0.95em] !w-[0.5em]" aria-hidden="true" />
        </Link>

        {/* Горизонтальное меню; на телефоне — отдельной строкой с прокруткой и затуханием у края */}
        <nav
          aria-label="Main"
          className="order-last -mx-2 w-full overflow-x-auto [mask-image:linear-gradient(to_right,black_85%,transparent)] [scrollbar-width:none] sm:order-none sm:w-auto sm:flex-1 sm:[mask-image:none]"
        >
          <ul className="flex w-max gap-1 px-2 font-mono text-[0.82rem] sm:mx-auto">
            {items.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="block rounded px-2.5 py-1.5 text-dim transition-colors hover:bg-panel-2 hover:text-phosphor"
                >
                  <span className="text-mute">[</span>
                  {item.label}
                  <span className="text-mute">]</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <Link
          href={localePath(other, path)}
          hrefLang={other}
          aria-label={dict.nav.switchLanguage}
          className="ml-auto shrink-0 rounded border border-line-strong px-2 py-1 font-mono text-xs text-dim hover:border-phosphor hover:text-phosphor"
        >
          <span className={locale === "en" ? "text-phosphor" : ""}>EN</span>
          <span className="text-mute"> | </span>
          <span className={locale === "de" ? "text-phosphor" : ""}>DE</span>
        </Link>
      </div>
    </header>
  );
}
