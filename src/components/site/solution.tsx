import { TrendingDown, Leaf, ShieldCheck, Radar, Activity, Bell } from "lucide-react";
import { solution } from "@/content";
import { Reveal, Section, SectionHead, Stagger, StaggerItem } from "./reveal";
import { MaskChip } from "./brand";
import { InstrumentPanel } from "./instrument-panel";

const benefitIcons = [TrendingDown, Leaf, ShieldCheck];

const flow = [
  { icon: Radar, label: "Detect", note: "Every iceberg, all-weather radar" },
  { icon: Activity, label: "Forecast", note: "Drift predicted hours ahead" },
  { icon: Bell, label: "Alert", note: "When it enters the corridor" },
];

const stages = solution.howItWorks.map((s) => ({ title: s.title, body: s.body }));

export function Solution() {
  return (
    <Section id="solution" className="relative overflow-hidden border-y border-ink/15 bg-paper-deep">
      <Reveal>
        <SectionHead title={solution.headline} intro={solution.subtext} />
      </Reveal>

      {/* The instrument: select a capability, read the figure */}
      <Reveal delay={0.08}>
        <div className="mt-12">
          <InstrumentPanel stages={stages} />
        </div>
      </Reveal>

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
        <div className="mt-12 rounded-lg border border-ink/70 bg-plate p-7 md:p-10">
          <div className="flex items-center gap-2.5">
            <MaskChip />
            <span className="font-mono text-[0.68rem] uppercase tracking-[0.16em] text-mask-ink">
              Flagship capability
            </span>
          </div>
          <h3 className="display-condensed mt-4 text-3xl font-extrabold text-ink md:text-4xl">
            {solution.flagship.title}
          </h3>
          <p className="mt-3 max-w-2xl leading-relaxed text-ink-soft">{solution.flagship.body}</p>

          <div className="relative mt-9 grid grid-cols-3 gap-4">
            <div
              aria-hidden="true"
              className="absolute inset-x-[17%] top-5 hidden h-px bg-ink/25 sm:block"
            />
            {flow.map((step) => (
              <div key={step.label} className="relative flex flex-col items-center text-center">
                <span className="relative flex size-10 items-center justify-center border border-ink bg-paper">
                  <step.icon className="size-4.5 text-ink" strokeWidth={1.75} />
                </span>
                <p className="mt-3 font-semibold text-ink">{step.label}</p>
                <p className="mt-1 text-xs text-ink-soft">{step.note}</p>
              </div>
            ))}
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
