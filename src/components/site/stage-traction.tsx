import { stage, traction } from "@/content";
import { Badge } from "@/components/ui/badge";
import { Reveal, Section, Stagger, StaggerItem } from "./reveal";

export function StageTraction() {
  return (
    <Section id="traction">
      <div className="grid grid-cols-1 gap-x-14 gap-y-12 lg:grid-cols-2">
        {/* Stage */}
        <Reveal>
          <h2 className="font-heading text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
            {stage.headline}
          </h2>
          <Badge variant="secondary" className="mt-5 font-mono text-xs tracking-wide">
            {stage.status}
          </Badge>
          <ul className="mt-6 flex flex-col gap-4">
            {stage.points.map((point) => (
              <li key={point} className="flex gap-3">
                <span
                  aria-hidden="true"
                  className="mt-2 h-px w-5 shrink-0 bg-brand"
                />
                <span className="text-sm leading-relaxed text-muted-foreground md:text-base">
                  {point}
                </span>
              </li>
            ))}
          </ul>
        </Reveal>

        {/* Traction */}
        <Reveal delay={0.08}>
          <h2 className="font-heading text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
            {traction.headline}
          </h2>
          <Stagger className="mt-6 flex flex-col divide-y divide-border border-t border-border">
            {traction.items.map((item) => (
              <StaggerItem key={item.kicker}>
                <div className="flex flex-col gap-1.5 py-5 sm:flex-row sm:gap-6">
                  <span className="font-mono text-xs uppercase tracking-[0.16em] text-brand-strong sm:w-44 sm:shrink-0 sm:pt-0.5">
                    {item.kicker}
                  </span>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {item.body}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </Reveal>
      </div>
    </Section>
  );
}
