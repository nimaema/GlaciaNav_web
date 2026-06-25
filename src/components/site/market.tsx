import { market } from "@/content";
import { Reveal, Section, SectionHead, Stagger, StaggerItem } from "./reveal";

export function Market() {
  return (
    <Section id="market" className="bg-card">
      <Reveal>
        <SectionHead title={market.headline} intro={market.whyNow} />
      </Reveal>

      <Stagger className="relative mt-16 grid grid-cols-1 gap-10 sm:grid-cols-3">
        {/* Sequence connector (desktop) */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-5 hidden h-px bg-border sm:block"
        />
        {market.phases.map((phase, i) => (
          <StaggerItem key={phase.no}>
            <div className="relative">
              <div className="flex size-10 items-center justify-center rounded-full border border-brand bg-card font-mono text-sm font-medium text-brand-strong">
                {i + 1}
              </div>
              <h3 className="mt-5 font-heading text-lg font-semibold text-foreground">
                {phase.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {phase.body}
              </p>
            </div>
          </StaggerItem>
        ))}
      </Stagger>
    </Section>
  );
}
