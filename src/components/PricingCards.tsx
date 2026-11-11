import { site, type Locale } from "@/config/site";
import type { Dictionary } from "@/i18n";
import { formatPrice } from "@/lib/format";

type PlanId = keyof typeof site.prices;

function isPlanId(id: string): id is PlanId {
  return id in site.prices;
}

function priceLabel(id: string, locale: Locale, t: Dictionary["pricing"]) {
  // The plan id in the dictionary must match a key in site.prices
  if (!isPlanId(id)) throw new Error(`Unknown pricing plan "${id}"`);
  const value = site.prices[id];
  if (value === null) return { main: t.onRequest, prefix: "", suffix: "" };
  return {
    main: formatPrice(value, locale),
    prefix: id === "framework" ? `${t.from} ` : "",
    suffix: id === "hourly" ? ` ${t.perHour}` : "",
  };
}

type Props = {
  locale: Locale;
  dict: Dictionary;
  /** Home page shows 3 items per plan, the pricing page shows all */
  compact?: boolean;
};

export function PricingCards({ locale, dict, compact }: Props) {
  const t = dict.pricing;
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {t.plans.map((plan) => {
        const price = priceLabel(plan.id, locale, t);
        const features = compact ? plan.features.slice(0, 3) : plan.features;
        return (
          <article
            key={plan.id}
            className={`relative flex flex-col rounded-md border p-7 ${
              plan.featured ? "bracket border-phosphor-dim bg-panel-2" : "border-line bg-panel"
            }`}
          >
            {plan.featured && (
              <span className="absolute -top-3 left-6 rounded bg-phosphor px-2 py-0.5 font-mono text-[0.7rem] text-bg uppercase">
                {t.popular}
              </span>
            )}
            <h3 className="text-lg font-semibold text-white">{plan.name}</h3>
            <p className="mt-1 font-mono text-xs text-mute">{plan.unit}</p>
            <p className="mt-6 font-mono">
              {price.prefix && <span className="text-sm text-dim">{price.prefix}</span>}
              <span className="text-3xl font-semibold text-amber">{price.main}</span>
              {price.suffix && <span className="text-sm text-dim">{price.suffix}</span>}
            </p>
            {!compact && <p className="mt-4 leading-relaxed text-dim">{plan.summary}</p>}
            <ul className="mt-6 space-y-3">
              {features.map((feature) => (
                <li key={feature} className="flex gap-3 text-[0.95rem] leading-relaxed text-ink">
                  <span className="font-mono text-phosphor" aria-hidden="true">
                    ✓
                  </span>
                  {feature}
                </li>
              ))}
            </ul>
            {!compact && (
              <p className="mt-auto pt-6 font-mono text-xs leading-relaxed text-mute">
                <span className="text-phosphor-dim">best_for:</span> {plan.bestFor}
              </p>
            )}
          </article>
        );
      })}
    </div>
  );
}

export function VatNote({ dict }: { dict: Dictionary }) {
  return <p className="mt-6 font-mono text-xs text-mute">* {site.smallBusiness ? dict.pricing.vatNoteSmallBusiness : dict.pricing.vatNote}</p>;
}
