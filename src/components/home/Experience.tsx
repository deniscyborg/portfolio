import type { Dictionary } from "@/i18n";
import { Photo } from "@/components/Photo";
import { Section } from "@/components/Section";

export function Experience({ dict }: { dict: Dictionary }) {
  const t = dict.experience;
  return (
    <Section id="experience" index="04" title={t.title}>
      <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
        <div>
          <ol className="relative space-y-10 border-l border-line pl-8">
            {t.jobs.map((job) => (
              <li key={job.role + job.period} className="relative">
                <span className="absolute top-1.5 -left-[37px] size-3 rounded-full border-2 border-phosphor bg-bg" aria-hidden="true" />
                <p className="font-mono text-xs text-phosphor">{job.period}</p>
                <h3 className="mt-1 text-lg font-semibold text-white">{job.role}</h3>
                <p className="text-sm text-mute">{job.company}</p>
                <p className="mt-2 max-w-2xl leading-relaxed text-dim">{job.text}</p>
              </li>
            ))}
          </ol>

          <h3 className="mt-14 font-mono text-sm text-phosphor">
            <span className="text-mute">## </span>
            {t.educationTitle}
          </h3>
          <ul className="mt-4 space-y-3">
            {t.education.map((item) => (
              <li key={item.school}>
                <p className="font-medium text-ink">{item.school}</p>
                <p className="text-sm text-mute">{item.degree}</p>
              </li>
            ))}
          </ul>
        </div>

        <figure className="scanlines relative hidden self-start overflow-hidden rounded-md border border-line lg:block">
          <Photo
            name="berlin-tower"
            widths={[480, 960]}
            sizes="320px"
            width={960}
            height={1200}
            alt="Berlin TV tower at night"
            className="w-full opacity-85"
          />
          <figcaption className="absolute bottom-3 left-3 rounded bg-bg/80 px-2 py-1 font-mono text-xs text-dim">
            <span className="text-phosphor">@</span> Berlin
          </figcaption>
        </figure>
      </div>
    </Section>
  );
}
