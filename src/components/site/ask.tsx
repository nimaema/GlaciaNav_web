import { Radio } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { ask } from "@/content";
import { Reveal, Section, Stagger, StaggerItem } from "./reveal";
import { ChartGrid } from "./brand";

/**
 * Requesting assistance. The asks are framed as transmissions on an open
 * channel — each a numbered request with a live signal indicator.
 */
export function Ask() {
  const reduce = useReducedMotion();
  return (
    <Section id="ask" className="relative overflow-hidden bg-brand-surface">
      <ChartGrid tone="light" fade="radial" className="opacity-25" />
      <div className="relative grid grid-cols-1 gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
        <Reveal>
          <p className="inline-flex items-center gap-2 font-mono text-[0.7rem] uppercase tracking-[0.24em] text-brand-strong">
            <motion.span
              className="size-1.5 rounded-full bg-brand"
              animate={reduce ? undefined : { opacity: [1, 0.2, 1] }}
              transition={{ duration: 1.6, repeat: Number.POSITIVE_INFINITY }}
            />
            Requesting assistance
          </p>
          <h2 className="mt-5 font-heading text-3xl font-semibold tracking-tight text-foreground md:text-4xl lg:text-5xl">
            {ask.headline}
          </h2>
          <p className="mt-5 max-w-sm text-base leading-relaxed text-muted-foreground md:text-lg">
            {ask.subtext}
          </p>
        </Reveal>

        <Stagger className="flex flex-col">
          {ask.items.map((item, i) => (
            <StaggerItem key={item.title}>
              <motion.div
                whileHover={reduce ? undefined : { x: 6 }}
                transition={{ type: "spring", stiffness: 300, damping: 26 }}
                className="group grid grid-cols-[auto_1fr] items-start gap-x-5 border-t border-border py-6 last:border-b"
              >
                <div className="flex flex-col items-center gap-2 pt-1">
                  <span className="font-mono text-[0.6rem] uppercase tracking-[0.12em] text-brand-strong">
                    REQ·0{i + 1}
                  </span>
                  <span className="relative flex size-9 items-center justify-center">
                    <span className="absolute inset-0 hex-clip border border-brand/40 bg-card/50" />
                    {i === 0 && !reduce ? (
                      <motion.span
                        className="absolute inset-0 hex-clip bg-brand/20"
                        animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
                        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                      />
                    ) : null}
                    <Radio className="relative size-4 text-brand" strokeWidth={1.75} />
                  </span>
                </div>
                <div>
                  <h3 className="font-heading text-lg font-semibold text-foreground">{item.title}</h3>
                  <p className="mt-1.5 max-w-lg text-sm leading-relaxed text-muted-foreground">
                    {item.body}
                  </p>
                </div>
              </motion.div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </Section>
  );
}
