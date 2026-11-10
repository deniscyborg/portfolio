import { site } from "@/config/site";
import type { Dictionary } from "@/i18n";
import { Photo } from "@/components/Photo";
import { Section } from "@/components/Section";

export function Work({ dict }: { dict: Dictionary }) {
  const t = dict.work;
  const [featured, ...rest] = t.items;
  const demoLinks = [
    { href: site.links.demoShowcase, label: t.links.showcase },
    { href: site.links.demoApp, label: t.links.app },
    { href: site.links.demoAllure, label: t.links.report },
    { href: site.links.demoRepo, label: t.links.code },
  ];

  return (
    <Section id="work" index="03" title={t.title} lead={t.lead}>
      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <article className="bracket flex flex-col rounded-md border border-line-strong bg-panel p-7">
          <Badge open>{t.openSource}</Badge>
          <h3 className="mt-4 text-2xl font-semibold text-white">{featured.title}</h3>
          <p className="mt-1 font-mono text-xs text-mute">{featured.context}</p>
          <p className="mt-4 leading-relaxed text-dim">{featured.text}</p>
          <Tags tags={featured.tags} />
          <ul className="mt-auto flex flex-wrap gap-x-5 gap-y-2 pt-7 font-mono text-sm">
            {demoLinks.map((link) => (
              <li key={link.href}>
                <a href={link.href} className="text-phosphor underline decoration-phosphor-dim underline-offset-4 hover:decoration-phosphor">
                  {link.label} ↗
                </a>
              </li>
            ))}
          </ul>
        </article>

        <figure className="relative overflow-hidden rounded-md border border-line">
          <div className="scanlines relative h-full">
            <Photo
              name="quality-gate"
              widths={[480, 960]}
              sizes="(min-width: 1024px) 40vw, 100vw"
              width={960}
              height={1200}
              alt=""
              className="h-full max-h-[420px] w-full object-cover opacity-80 grayscale-[35%] lg:max-h-none"
            />
          </div>
          <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-bg via-bg/80 to-transparent p-5 pt-16 font-mono text-xs leading-relaxed text-dim">
            <span className="text-amber">quality_gate:</span> {t.gateCaption}
          </figcaption>
        </figure>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        {rest.map((item) => (
          <article key={item.id} className="rounded-md border border-line bg-panel p-6">
            <Badge>{t.nda}</Badge>
            <h3 className="mt-4 text-xl font-semibold text-white">{item.title}</h3>
            <p className="mt-1 font-mono text-xs text-mute">{item.context}</p>
            <p className="mt-3 leading-relaxed text-dim">{item.text}</p>
            <Tags tags={item.tags} />
          </article>
        ))}
      </div>
    </Section>
  );
}

function Badge({ children, open }: { children: React.ReactNode; open?: boolean }) {
  return (
    <span
      className={`inline-block self-start rounded px-2 py-0.5 font-mono text-[0.7rem] tracking-wide uppercase ${
        open ? "bg-phosphor/15 text-phosphor" : "bg-amber/10 text-amber"
      }`}
    >
      {children}
    </span>
  );
}

function Tags({ tags }: { tags: string[] }) {
  return (
    <ul className="mt-5 flex flex-wrap gap-2">
      {tags.map((tag) => (
        <li key={tag} className="rounded bg-panel-2 px-2 py-0.5 font-mono text-[0.75rem] text-dim">
          {tag}
        </li>
      ))}
    </ul>
  );
}
