import { Flame, BadgeEuro, CloudFog } from "lucide-react";
import { problem } from "@/content";
import { Reveal, Section, SectionHead, Stagger, StaggerItem } from "./reveal";

const icons = [Flame, BadgeEuro, CloudFog];

export function Problem() {
  return (
    <Section id="problem">
      <Reveal>
        <SectionHead title={problem.headline} intro={problem.subtext} />
      </Reveal>

      {/* Scale-of-pain stat */}
      <Reveal delay={0.05}>
        <div className="mt-12 flex flex-col gap-3 border-y border-border py-8 sm:flex-row sm:items-end sm:gap-6">
          <span className="font-mono text-5xl font-medium leading-none tracking-tight text-brand-strong md:text-6xl">
            {problem.stat.value}
          </span>
          <span className="max-w-xs text-sm leading-relaxed text-muted-foreground sm:pb-1">
            {problem.stat.label}
          </span>
        </div>
      </Reveal>

      {/* Three compounding crises */}
      <Stagger className="mt-14 grid grid-cols-1 gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
        {problem.crises.map((crisis, i) => {
          const Icon = icons[i];
          return (
            <StaggerItem key={crisis.title}>
              <div className="border-t-2 border-brand pt-5">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs uppercase tracking-[0.18em] text-brand-strong">
                    {crisis.kicker}
                  </span>
                  <Icon className="size-5 text-brand" strokeWidth={1.75} />
                </div>
                <h3 className="mt-4 font-heading text-xl font-semibold text-foreground">
                  {crisis.title}
                </h3>
                <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">
                  {crisis.body}
                </p>
                <p className="mt-4 font-mono text-xs text-muted-foreground">
                  {crisis.metric}
                </p>
              </div>
            </StaggerItem>
          );
        })}
      </Stagger>
    </Section>
  );
}
