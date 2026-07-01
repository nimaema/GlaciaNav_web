import { useState } from "react";
import { market } from "@/content";
import { Reveal, Section, SectionHead } from "./reveal";
import { MarketMap } from "./market-map";

const ZONE_SWATCH = ["bg-brand", "bg-brand-strong", "bg-signal"];
const ZONE_TEXT = ["text-brand", "text-brand-strong", "text-signal"];

export function Market() {
  const [active, setActive] = useState(market.phases.length - 1);

  return (
    <Section id="market" className="relative overflow-hidden bg-card">
      <Reveal>
        <SectionHead title={market.headline} intro={market.whyNow} />
      </Reveal>

      <div className="mt-14 grid grid-cols-1 items-center gap-10 lg:grid-cols-[1fr_1fr] lg:gap-16">
        {/* The expansion map */}
        <Reveal>
          <div className="relative mx-auto aspect-square w-full max-w-md overflow-hidden rounded-2xl border border-border bg-abyss">
            <MarketMap active={active} />
            <div className="pointer-events-none absolute inset-0 p-4">
              <div className="flex items-center justify-between font-mono text-[0.6rem] uppercase tracking-[0.16em]">
                <span className="text-muted-foreground">Coverage · reach</span>
                <span className={ZONE_TEXT[active]}>{market.phases[active].title}</span>
              </div>
              {["left-3 top-9 border-l border-t", "right-3 top-9 border-r border-t", "left-3 bottom-3 border-l border-b", "right-3 bottom-3 border-r border-b"].map((p) => (
                <span key={p} className={`absolute size-3 border-brand/40 ${p}`} />
              ))}
            </div>
          </div>
        </Reveal>

        {/* Phase list — hover/focus to expand the map */}
        <Reveal delay={0.1}>
          <div className="flex flex-col">
            <p className="mb-2 font-mono text-[0.65rem] uppercase tracking-[0.2em] text-muted-foreground">
              Go-to-market · three horizons
            </p>
            {market.phases.map((phase, i) => {
              const on = i === active;
              return (
                <button
                  key={phase.no}
                  type="button"
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  onClick={() => setActive(i)}
                  className={`group grid grid-cols-[auto_1fr] items-start gap-x-4 border-t border-border py-5 text-left transition-colors last:border-b ${
                    on ? "" : "opacity-60 hover:opacity-100"
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <span className={`size-2.5 rounded-full transition-transform ${ZONE_SWATCH[i]} ${on ? "scale-125" : "scale-100"}`} />
                    <span className="font-mono text-sm text-muted-foreground tabular-nums">{phase.no}</span>
                  </span>
                  <span>
                    <h3 className="font-heading text-lg font-semibold text-foreground">{phase.title}</h3>
                    <p className="mt-1 max-w-md text-sm leading-relaxed text-muted-foreground">{phase.body}</p>
                  </span>
                </button>
              );
            })}
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
