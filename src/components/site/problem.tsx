import { problem } from "@/content";
import { Reveal, Section, SectionHead, Stagger, StaggerItem } from "./reveal";
import { ChartGrid, MarkWatermark } from "./brand";
import { SkewCard } from "./cards";

export function Problem() {
  return (
    <Section id="problem" className="relative overflow-hidden">
      <ChartGrid tone="ink" fade="top" className="opacity-50" />
      <MarkWatermark
        src="/favicon.svg"
        className="pointer-events-none absolute -left-24 top-10 hidden w-72 opacity-[0.04] lg:block"
      />

      <div className="relative">
        <Reveal>
          <SectionHead title={problem.headline} intro={problem.subtext} />
        </Reveal>

        {/* Informative stat band */}
        <Reveal delay={0.05}>
          <div className="mt-12 grid grid-cols-1 divide-y divide-border overflow-hidden rounded-2xl border border-brand/15 bg-gradient-to-br from-brand-surface/60 to-card sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            {problem.stats.map((stat) => (
              <div key={stat.label} className="flex flex-col gap-2 p-6 md:p-7">
                <span className="font-mono text-4xl font-medium leading-none tracking-tight text-brand-strong md:text-5xl">
                  {stat.value}
                </span>
                <span className="text-sm leading-relaxed text-muted-foreground">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </Reveal>

        {/* Compounding crises as skew-reveal cards */}
        <Stagger className="mt-8 grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
          {problem.crises.map((crisis) => (
            <StaggerItem key={crisis.title} className="h-full min-h-[260px]">
              <SkewCard>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[0.7rem] uppercase tracking-[0.18em] text-brand-strong">
                    {crisis.kicker}
                  </span>
                  <span className="rounded-full border border-brand/30 bg-card/70 px-2.5 py-1 font-mono text-[0.65rem] text-brand-strong">
                    {crisis.metric}
                  </span>
                </div>
                <h3 className="mt-5 font-heading text-xl font-semibold text-foreground">
                  {crisis.title}
                </h3>
                <p className="mt-2.5 flex-1 text-sm leading-relaxed text-foreground/70">
                  {crisis.body}
                </p>
              </SkewCard>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </Section>
  );
}
