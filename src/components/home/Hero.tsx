import { site, type Locale } from "@/config/site";
import type { Dictionary } from "@/i18n";
import { ButtonLink } from "@/components/ButtonLink";
import { Photo } from "@/components/Photo";
import { localePath } from "@/lib/format";

export function Hero({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const t = dict.hero;
  const lines = [
    { prompt: true, text: "whoami" },
    { prompt: false, text: `${site.name} — ${t.role}`, strong: true },
    { prompt: true, text: "cat location.txt" },
    { prompt: false, text: t.location },
    { prompt: true, text: "dotnet test ./UserManagementApp" },
    { prompt: false, text: `✓ ${t.testsLine}`, ok: true },
  ];

  return (
    <section className="relative isolate overflow-hidden border-b border-line">
      {/* Photo of a Berlin square: dimmed, tinted and covered with scanlines */}
      <div className="scanlines absolute inset-0 -z-10">
        <Photo
          name="hero"
          widths={[640, 1280, 1920]}
          sizes="100vw"
          width={1920}
          height={1080}
          alt=""
          priority
          className="h-full w-full object-cover opacity-30 grayscale"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-bg/40 via-bg/70 to-bg" />
        <div className="absolute inset-0 bg-phosphor/5 mix-blend-color" />
      </div>

      <div className="mx-auto grid max-w-6xl gap-12 px-4 pt-20 pb-24 sm:px-6 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:pt-28">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full border border-phosphor-dim/60 bg-panel/80 px-3 py-1 font-mono text-xs text-phosphor">
            <span className="size-2 animate-pulse rounded-full bg-phosphor" aria-hidden="true" />
            {t.status}
          </p>
          <h1 className="mt-6 text-4xl leading-tight font-semibold tracking-tight text-balance hyphens-auto break-words text-white sm:text-5xl">
            {t.headline}
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-dim">{t.lead}</p>
          <div className="mt-9 flex flex-wrap gap-3">
            <ButtonLink href={site.links.linkedin} external>
              {t.ctaPrimary}
            </ButtonLink>
            <ButtonLink href={`${localePath(locale)}#work`} variant="ghost">
              {t.ctaSecondary}
            </ButtonLink>
          </div>
        </div>

        <div className="bracket rounded-md border border-line-strong bg-panel/90 shadow-[0_0_60px_-20px_rgb(61_255_154/0.35)]">
          <div className="flex items-center gap-2 border-b border-line px-4 py-2.5 font-mono text-xs text-mute">
            <span className="size-2.5 rounded-full bg-danger/70" />
            <span className="size-2.5 rounded-full bg-amber/70" />
            <span className="size-2.5 rounded-full bg-phosphor/70" />
            <span className="ml-2">denis@berlin: ~</span>
          </div>
          <pre className="overflow-x-auto p-5 font-mono text-[0.85rem] leading-7 whitespace-pre-wrap sm:text-sm">
            {lines.map((line, i) => (
              <span key={i} className="type-line block" style={{ "--i": i } as React.CSSProperties}>
                {line.prompt ? (
                  <>
                    <span className="text-phosphor">$</span> <span className="text-ink">{line.text}</span>
                  </>
                ) : (
                  <span className={line.ok ? "text-phosphor glow" : line.strong ? "text-white" : "text-dim"}>{line.text}</span>
                )}
              </span>
            ))}
            <span className="type-line block" style={{ "--i": lines.length } as React.CSSProperties}>
              <span className="text-phosphor">$</span>
              <span className="cursor" aria-hidden="true" />
            </span>
          </pre>
        </div>
      </div>

      <dl className="mx-auto grid max-w-6xl gap-px border-t border-line bg-line sm:grid-cols-3">
        {t.stats.map((stat) => (
          <div key={stat.label} className="flex flex-col-reverse bg-bg/80 px-4 py-6 sm:px-6">
            <dt className="mt-1 text-sm text-dim">{stat.label}</dt>
            <dd className="font-mono text-3xl font-semibold text-phosphor glow">{stat.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
