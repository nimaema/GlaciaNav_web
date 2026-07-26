import { ask } from "@/content";
import { Reveal, Section, SectionHead, Stagger, StaggerItem } from "./reveal";
import { MaskChip } from "./brand";

/**
 * The asks, set as open field questions in the survey log: plain stacked
 * entries, each flagged with a mask chip because each is an open detection
 * the team is still hunting.
 */
export function Ask() {
  return (
    <Section id="ask" className="relative overflow-hidden">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
        <Reveal>
          <SectionHead title={ask.headline} intro={ask.subtext} />
        </Reveal>

        <Stagger className="flex flex-col">
          {ask.items.map((item) => (
            <StaggerItem key={item.title}>
              <div className="group grid grid-cols-[auto_1fr] items-start gap-x-4 border-t border-ink/15 py-6 last:border-b">
                <MaskChip className="mt-2" />
                <div>
                  <h3 className="display-condensed text-xl font-extrabold text-ink">{item.title}</h3>
                  <p className="mt-1.5 max-w-lg text-sm leading-relaxed text-ink-soft">{item.body}</p>
                </div>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </Section>
  );
}
