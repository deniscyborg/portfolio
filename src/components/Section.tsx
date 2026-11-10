import type { ReactNode } from "react";

type Props = {
  id?: string;
  index?: string;
  title: string;
  lead?: string;
  children: ReactNode;
  className?: string;
};

/** Раздел с заголовком в стиле «01 / services» */
export function Section({ id, index, title, lead, children, className = "" }: Props) {
  return (
    <section id={id} className={`mx-auto max-w-6xl px-4 pt-24 sm:px-6 ${className}`} aria-labelledby={id ? `${id}-title` : undefined}>
      <header className="mb-10 max-w-3xl">
        <h2 id={id ? `${id}-title` : undefined} className="font-mono text-sm tracking-wide text-phosphor">
          {index && <span className="text-mute">{index} / </span>}
          {title}
        </h2>
        {lead && <p className="mt-3 text-2xl leading-snug font-medium text-ink sm:text-3xl">{lead}</p>}
      </header>
      {children}
    </section>
  );
}
