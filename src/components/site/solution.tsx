import { TrendingDown, Leaf, ShieldCheck, Radar, Activity, Bell } from "lucide-react";
import { solution } from "@/content";
import { Reveal, Section, Stagger, StaggerItem } from "./reveal";
import { DataLabel, MaskChip } from "./brand";
import { TransectFigure } from "./transect-figure";

const benefitIcons = [TrendingDown, Leaf, ShieldCheck];

const flow = [
  { icon: Radar, label: "Detect", note: "Every iceberg, all-weather radar" },
  { icon: Activity, label: "Forecast", note: "Drift predicted hours ahead" },
  { icon: Bell, label: "Alert", note: "When it enters the corridor" },
];

/**
 * The solution as one figure read three ways: a survey line across the basin
 * with classification, thickness and drift stacked on a shared axis. The three
 * capabilities are named alongside the panels they produce, so the section
 * argues from a single piece of evidence rather than swapping pictures in a
 * box.
 */
export function Solution() {
  return (
    <Section id="solution" className="relative overflow-hidden border-y border-ink/15 bg-paper-deep">
      <Reveal>
        <div className="grid grid-cols-1 items-end gap-6 border-b-2 border-ink pb-8 lg:grid-cols-[1fr_auto]">
          <h2 className="display-condensed max-w-[18ch] text-4xl font-extrabold leading-[0.95] text-ink md:text-5xl lg:text-6xl">
            {solution.headline}
          </h2>
          <p className="max-w-md text-base leading-relaxed text-ink-soft lg:text-right">
            {solution.subtext}
          </p>
        </div>
      </Reveal>

      {/* The survey line */}
      <Reveal delay={0.08}>
        <div className="mt-10">
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <DataLabel className="text-mask-ink">
              Figure 02 · survey line 047, Bothnian Bay
            </DataLabel>
            <DataLabel>65°N · one satellite pass</DataLabel>
          </div>
          <div className="mt-5">
            <TransectFigure />
          </div>
        </div>
      </Reveal>

      {/* What produced each panel */}
      <div className="mt-14 grid grid-cols-1 gap-px bg-ink/15 md:grid-cols-3">
        {solution.howItWorks.map((s, i) => (
          <Reveal key={s.title} delay={i * 0.08} className="bg-paper-deep">
            <div className={`flex h-full flex-col gap-3 py-7 md:px-7 ${i === 0 ? "md:pl-0" : ""}`}>
              <span className="font-mono text-[0.68rem] tabular-nums text-mask-ink">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="display-condensed text-2xl font-extrabold text-ink">{s.title}</h3>
              <p className="text-sm leading-relaxed text-ink-soft">{s.body}</p>
            </div>
          </Reveal>
        ))}
      </div>

      {/* What a better ice picture is worth on the bridge */}
      <Stagger className="mt-14 grid grid-cols-1 border-y border-ink/20 sm:grid-cols-3">
        {solution.benefits.map((b, i) => {
          const Icon = benefitIcons[i];
          return (
            <StaggerItem key={b.title}>
              <div
                className={`flex h-full items-start gap-3.5 py-6 sm:px-6 ${
                  i > 0 ? "border-t border-ink/15 sm:border-l sm:border-t-0" : "sm:pl-0"
                }`}
              >
                <Icon className="mt-0.5 size-5 shrink-0 text-ink" strokeWidth={1.75} />
                <div>
                  <p className="font-semibold text-ink">{b.title}</p>
                  <p className="mt-1 text-sm text-ink-soft">{b.note}</p>
                </div>
              </div>
            </StaggerItem>
          );
        })}
      </Stagger>
      <Reveal>
        <p className="mt-3 flex items-start gap-2 font-mono text-[0.65rem] leading-relaxed tracking-[0.04em] text-ink-faint">
          <MaskChip className="mt-[0.2em]" />
          {solution.benefitsNote}
        </p>
      </Reveal>

      {/* Flagship: iceberg movement prediction */}
      <Reveal delay={0.05}>
        <div className="mt-14 border-t-2 border-ink pt-8">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <DataLabel className="text-mask-ink">Flagship capability</DataLabel>
              <h3 className="display-condensed mt-3 text-3xl font-extrabold text-ink md:text-4xl">
                {solution.flagship.title}
              </h3>
              <p className="mt-3 max-w-xl leading-relaxed text-ink-soft">{solution.flagship.body}</p>
            </div>
            <div className="flex gap-8">
              {flow.map((step, i) => (
                <div key={step.label} className="flex max-w-[9rem] flex-col gap-2">
                  <span className="flex items-center gap-2">
                    <step.icon className="size-4 text-ink" strokeWidth={1.75} />
                    <span className="font-mono text-[0.6rem] tabular-nums text-ink-faint">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </span>
                  <span className="font-semibold text-ink">{step.label}</span>
                  <span className="text-xs leading-relaxed text-ink-soft">{step.note}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
