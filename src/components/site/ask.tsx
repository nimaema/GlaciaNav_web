import { ask } from "@/content";
import { Reveal, Section, SectionHead, Stagger, StaggerItem } from "./reveal";

export function Ask() {
  return (
    <Section id="ask" className="bg-brand-surface">
      <Reveal>
        <SectionHead title={ask.headline} intro={ask.subtext} />
      </Reveal>

      <Stagger className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-3">
        {ask.items.map((item) => (
          <StaggerItem key={item.title} className="h-full">
            <div className="flex h-full flex-col rounded-2xl border border-brand/20 bg-card p-6">
              <span aria-hidden="true" className="font-heading text-2xl text-brand">
                ?
              </span>
              <h3 className="mt-3 font-heading text-lg font-semibold text-foreground">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {item.body}
              </p>
            </div>
          </StaggerItem>
        ))}
      </Stagger>
    </Section>
  );
}
