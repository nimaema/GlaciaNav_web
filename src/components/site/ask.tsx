import { ask } from "@/content";
import { Reveal, Section, SectionHead, Stagger, StaggerItem } from "./reveal";
import { ChartGrid, Hexagon } from "./brand";

export function Ask() {
  return (
    <Section id="ask" className="relative overflow-hidden bg-brand-surface">
      <ChartGrid tone="ink" fade="radial" className="opacity-60" />
      <div className="relative">
        <Reveal>
          <SectionHead title={ask.headline} intro={ask.subtext} />
        </Reveal>

        <Stagger className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-3">
          {ask.items.map((item, i) => (
            <StaggerItem key={item.title} className="h-full">
              <div className="group flex h-full flex-col rounded-2xl border border-brand/20 bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-brand/50 hover:shadow-[0_24px_48px_-24px_color-mix(in_srgb,var(--brand-strong)_40%,transparent)]">
                <span className="relative flex size-12 items-center justify-center">
                  <Hexagon
                    variant="outline"
                    strokeWidth={3}
                    className="absolute inset-0 size-full text-brand/40 transition-colors duration-300 group-hover:text-brand"
                  />
                  <span className="relative font-mono text-sm font-medium text-brand-strong">
                    0{i + 1}
                  </span>
                </span>
                <h3 className="mt-5 font-heading text-lg font-semibold text-foreground">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {item.body}
                </p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </Section>
  );
}
