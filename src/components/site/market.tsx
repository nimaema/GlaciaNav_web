import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { market } from "@/content";
import { Reveal, Section, SectionHead } from "./reveal";
import { ArcticChart, ZONES } from "./arctic-chart";
import { DataLabel, PlateFrame } from "./brand";

/**
 * Where the coverage goes. The chart is a north-polar plot and each horizon is
 * drawn at the latitudes and longitudes it actually occupies, so stepping
 * through the rollout moves real ground rather than growing a decorative ring.
 */

/** The sea area each horizon opens, in thousands of square kilometres. */
const AREA = [115, 1_240, 3_600];

function extent(i: number) {
  const z = ZONES[i];
  const lon = (l: number) => `${Math.abs(l)}°${l < 0 ? "W" : "E"}`;
  return `${z.lat[0]}–${z.lat[1]}°N · ${lon(z.lon[0])}–${lon(z.lon[1])}`;
}

export function Market() {
  const [active, setActive] = useState(0);
  const reduce = useReducedMotion();
  const peak = Math.max(...AREA);

  return (
    <Section id="market" className="relative overflow-hidden border-y border-ink/15 bg-paper-deep">
      <Reveal>
        <SectionHead title={market.headline} intro={market.whyNow} />
      </Reveal>

      <div className="mt-14 grid grid-cols-1 items-start gap-10 lg:grid-cols-[1fr_1fr] lg:gap-16">
        {/* The polar chart */}
        <Reveal>
          <div className="relative mx-auto aspect-square w-full max-w-lg overflow-hidden rounded-lg border border-ink/70 bg-plate">
            <ArcticChart active={active} />
            <div className="pointer-events-none absolute inset-x-4 top-3 flex items-start justify-between">
              <DataLabel>Coverage · polar plot</DataLabel>
              <span className="max-w-[42%] text-right font-mono text-[0.6rem] uppercase leading-tight tracking-[0.14em] text-ink">
                {market.phases[active].title}
              </span>
            </div>
            <div className="pointer-events-none absolute inset-x-4 bottom-3 flex items-end justify-between">
              <span className="font-mono text-[0.58rem] tracking-[0.1em] text-ink-faint">
                {extent(active)}
              </span>
              <span className="font-mono text-[0.58rem] uppercase tracking-[0.12em] text-mask-ink">
                {AREA[active].toLocaleString("en-US")} k km²
              </span>
            </div>
            <PlateFrame className="m-2.5" />
          </div>
        </Reveal>

        {/* The three horizons */}
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
                  aria-pressed={on}
                  className={`group relative border-t border-ink/15 py-6 pl-5 text-left transition-colors last:border-b focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 ${
                    on ? "" : "opacity-60 hover:opacity-100"
                  }`}
                >
                  {/* which horizon is selected */}
                  <motion.span
                    aria-hidden="true"
                    className="absolute inset-y-0 left-0 w-[3px] origin-top bg-mask"
                    initial={false}
                    animate={{ scaleY: on ? 1 : 0 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  />
                  <div className="flex items-baseline justify-between gap-4">
                    <h3 className="display-condensed text-xl font-extrabold text-ink">
                      {phase.title}
                    </h3>
                    <span className="shrink-0 font-mono text-[0.62rem] tracking-[0.1em] text-ink-faint tabular-nums">
                      {phase.no}
                    </span>
                  </div>
                  <p className="mt-1.5 max-w-md text-sm leading-relaxed text-ink-soft">
                    {phase.body}
                  </p>

                  {/* sea area opened, to the same scale across all three */}
                  <div className="mt-4 flex items-center gap-3">
                    <div className="h-1.5 flex-1 bg-ink/10">
                      <motion.div
                        className={`h-full ${on ? "bg-mask" : "bg-strata-3"}`}
                        style={{ transformOrigin: "left" }}
                        initial={reduce ? false : { scaleX: 0 }}
                        whileInView={{ scaleX: AREA[i] / peak }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.15 * i, ease: [0.16, 1, 0.3, 1] }}
                      />
                    </div>
                    <span className="w-24 shrink-0 text-right font-mono text-[0.6rem] uppercase tracking-[0.1em] text-ink-faint tabular-nums">
                      {AREA[i].toLocaleString("en-US")} k km²
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
