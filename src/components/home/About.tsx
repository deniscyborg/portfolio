import type { Dictionary } from "@/i18n";
import { Photo } from "@/components/Photo";
import { Section } from "@/components/Section";
import { VhsPortrait } from "@/components/home/VhsPortrait";

/** Текстовый блок в стиле терминала: команда и строки вывода */
function Terminal({ command, lines, className = "" }: { command: string; lines: string[]; className?: string }) {
  return (
    <pre
      className={`overflow-x-auto rounded-md border border-line bg-panel p-5 font-mono text-[0.85rem] leading-7 whitespace-pre-wrap sm:text-sm ${className}`}
    >
      <span className="text-phosphor">$</span> <span className="text-ink">{command}</span>
      {"\n"}
      {lines.map((line) => (
        <span key={line} className="block text-dim">
          {line}
        </span>
      ))}
    </pre>
  );
}

/** «Обо мне»: портрет и текст, ниже — интересы и три карточки «вне работы» */
export function About({ dict }: { dict: Dictionary }) {
  const t = dict.about;
  return (
    <Section id="about" index="05" title={t.title} lead={t.lead}>
      <div className="grid gap-6 lg:grid-cols-[280px_1fr] lg:gap-x-10">
        <figure className="bracket relative self-start overflow-hidden rounded-md border border-line-strong">
          <VhsPortrait alt={t.portraitAlt} />
        </figure>

        <Terminal command="cat about.txt" lines={t.lines} />

        <Terminal command="cat interests.txt" lines={t.interests} className="lg:text-[0.8rem] lg:leading-6" />

        <ul className="grid gap-4 sm:grid-cols-3">
          {t.cards.map((card) => (
            <li key={card.image} className="overflow-hidden rounded-md border border-line bg-panel">
              <div className="scanlines relative">
                <Photo
                  name={card.image}
                  widths={[480, 960]}
                  sizes="(min-width: 1024px) 240px, (min-width: 640px) 30vw, 100vw"
                  width={960}
                  height={1200}
                  alt={card.alt}
                  className="aspect-[4/5] w-full object-cover grayscale transition duration-300 hover:grayscale-0"
                />
                <div className="pointer-events-none absolute inset-0 bg-phosphor/15 mix-blend-color" />
              </div>
              <p className="px-4 py-3 font-mono text-xs text-dim">
                <span className="text-phosphor">#</span> {card.caption}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
