import { motion, useReducedMotion } from "framer-motion";
import { market } from "@/content";
import { Reveal, Section, SectionHead, Stagger, StaggerItem } from "./reveal";
import { ChartGrid, Hexagon } from "./brand";

export function Market() {
  const reduce = useReducedMotion();

  return (
    <Section id="market" className="relative overflow-hidden bg-card">
      <ChartGrid tone="ink" fade="radial" className="opacity-50" />

      <div className="relative">
        <Reveal>
          <SectionHead title={market.headline} intro={market.whyNow} />
        </Reveal>

        <div className="relative mt-16">
          {/* The route: a drawn line with a travelling vessel, through the waypoints */}
          <div className="pointer-events-none absolute inset-x-[16.66%] top-7 hidden sm:block">
            <motion.div
              className="h-0.5 origin-left rounded-full bg-gradient-to-r from-brand/30 via-brand to-brand/30"
              initial={reduce ? false : { scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 1.3, ease: [0.16, 1, 0.3, 1] }}
            />
            <motion.span
              className="absolute -top-[7px] size-4 -translate-x-1/2 rounded-full bg-brand shadow-[0_0_14px_2px_color-mix(in_srgb,var(--brand)_70%,transparent)]"
              initial={{ left: "0%" }}
              animate={reduce ? { left: "100%" } : { left: ["0%", "100%"] }}
              transition={
                reduce
                  ? { duration: 0 }
                  : { duration: 7, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut", repeatDelay: 1 }
              }
            />
          </div>

          <Stagger className="grid grid-cols-1 gap-10 sm:grid-cols-3">
            {market.phases.map((phase) => (
              <StaggerItem key={phase.no}>
                <div className="flex flex-col items-center text-center sm:items-center">
                  <span className="relative flex size-14 items-center justify-center">
                    <span className="absolute inset-0 hex-clip bg-card" />
                    <Hexagon variant="outline" strokeWidth={3} className="absolute inset-0 size-full text-brand" />
                    <span className="relative font-mono text-base font-medium text-brand-strong">
                      {phase.no}
                    </span>
                  </span>
                  <h3 className="mt-5 font-heading text-lg font-semibold text-foreground">
                    {phase.title}
                  </h3>
                  <p className="mt-2 max-w-xs text-sm leading-relaxed text-muted-foreground">
                    {phase.body}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </div>
    </Section>
  );
}
