import { useState } from "react";
import { market } from "@/content";
import { Reveal, Section, SectionHead } from "./reveal";
import { MarketMap } from "./market-map";
import { PlateFrame } from "./brand";

const ZONE_SWATCH = ["bg-strata-4", "bg-strata-5", "bg-mask outline outline-1 outline-ink/40"];

export function Market() {
  const [active, setActive] = useState(market.phases.length - 1);

  return (
    <Section id="market" className="relative overflow-hidden border-y border-ink/15 bg-paper-deep">
      <Reveal>
        <SectionHead title={market.headline} intro={market.whyNow} />
      </Reveal>

      <div className="mt-14 grid grid-cols-1 items-center gap-10 lg:grid-cols-[1fr_1fr] lg:gap-16">
        {/* The coverage chart */}
        <Reveal>
          <div className="relative mx-auto aspect-square w-full max-w-md overflow-hidden rounded-lg border border-ink/70 bg-plate">
            <MarketMap active={active} />
            <div className="pointer-events-none absolute inset-x-4 top-3 flex items-center justify-between font-mono text-[0.6rem] uppercase tracking-[0.14em]">
              <span className="text-ink-faint">Coverage · reach</span>
              <span className="text-ink">{market.phases[active].title}</span>
            </div>
            <PlateFrame className="m-2.5" />
          </div>
        </Reveal>

        {/* The three horizons, in rollout order */}
        <Reveal delay={0.1}>
          <div className="flex flex-col">
            {market.phases.map((phase, i) => {
              const on = i === active;
              return (
                <button
                  key={phase.no}
                  type="button"
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  onClick={() => setActive(i)}
                  className={`group grid grid-cols-[auto_1fr] items-start gap-x-4 border-t border-ink/15 py-5 text-left transition-opacity last:border-b focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 ${
                    on ? "" : "opacity-55 hover:opacity-100"
                  }`}
                >
                  <span className="mt-1.5 flex items-center gap-2.5">
                    <span className={`size-2.5 transition-transform ${ZONE_SWATCH[i]} ${on ? "scale-125" : "scale-100"}`} />
                    <span className="font-mono text-sm text-ink-faint tabular-nums">{phase.no}</span>
                  </span>
                  <span>
                    <h3 className="display-condensed text-xl font-extrabold text-ink">{phase.title}</h3>
                    <p className="mt-1 max-w-md text-sm leading-relaxed text-ink-soft">{phase.body}</p>
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
