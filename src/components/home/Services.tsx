import type { Dictionary } from "@/i18n";
import { Section } from "@/components/Section";

const ICONS: Record<string, string> = {
  frameworks: "</>",
  cicd: "->",
  mobile: "[]",
  desktop: "▭",
  embedded: "⌁",
  ai: "◉",
};

export function Services({ dict }: { dict: Dictionary }) {
  const t = dict.services;
  return (
    <Section id="services" index="01" title={t.title} lead={t.lead}>
      <ul className="grid gap-px overflow-hidden rounded-md border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
        {t.items.map((item) => (
          <li key={item.id} className="group bg-panel p-6 transition-colors hover:bg-panel-2">
            <span className="font-mono text-lg text-phosphor" aria-hidden="true">
              {ICONS[item.id]}
            </span>
            <h3 className="mt-4 text-lg font-semibold text-white">{item.title}</h3>
            <p className="mt-2 leading-relaxed text-dim">{item.text}</p>
          </li>
        ))}
      </ul>
    </Section>
  );
}

export function Expertise({ dict }: { dict: Dictionary }) {
  const t = dict.expertise;
  return (
    <Section id="expertise" index="02" title={t.title} lead={t.lead}>
      <dl className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {t.groups.map((group) => (
          <div key={group.name}>
            <dt className="font-mono text-xs text-mute">
              <span className="text-phosphor-dim">#</span> {group.name}
            </dt>
            <dd className="mt-3 flex flex-wrap gap-2">
              {group.items.map((skill) => (
                <span key={skill} className="rounded border border-line-strong bg-panel px-2.5 py-1 font-mono text-[0.8rem] text-ink">
                  {skill}
                </span>
              ))}
            </dd>
          </div>
        ))}
      </dl>
    </Section>
  );
}
