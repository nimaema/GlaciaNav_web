import { motion, useReducedMotion } from "framer-motion";
import { problem } from "@/content";
import { Reveal, Section, Stagger, StaggerItem } from "./reveal";
import { AgingChart } from "./problem-visual";

export function Problem() {
  const reduce = useReducedMotion();

  return (
    <Section id="problem" className="relative overflow-hidden">
      {/* Editorial split: the argument on the left, the evidence (a live, aging
          chart) on the right. */}
      <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[1fr_1.05fr] lg:gap-16">
        <Reveal>
          <p className="inline-flex items-center gap-2 font-mono text-[0.7rem] uppercase tracking-[0.24em] text-signal">
            <span className="size-1.5 rounded-full bg-signal" />
            System status · reactive
          </p>
          <h2 className="mt-5 font-heading text-3xl font-semibold tracking-tight text-foreground md:text-4xl lg:text-5xl">
            {problem.headline}
          </h2>
          <p className="mt-5 max-w-md text-base leading-relaxed text-muted-foreground md:text-lg">
            {problem.subtext}
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <AgingChart className="aspect-[4/3] w-full" />
        </Reveal>
      </div>

      {/* Instrument stat strip — a readout panel, not three boxes */}
      <Reveal delay={0.05}>
        <div className="mt-16 grid grid-cols-1 border-y border-border sm:grid-cols-3">
          {problem.stats.map((stat, i) => (
            <div
              key={stat.label}
              className={`flex flex-col gap-2 py-7 sm:px-7 ${
                i > 0 ? "border-t border-border sm:border-l sm:border-t-0" : "sm:pl-0"
              }`}
            >
              <span className="font-mono text-4xl font-medium leading-none tracking-tight text-brand-strong md:text-5xl">
                {stat.value}
              </span>
              <span className="max-w-[22ch] text-sm leading-relaxed text-muted-foreground">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </Reveal>

      {/* Hazard ledger — full-width stacked entries with a compounding index */}
      <div className="mt-16">
        <p className="font-mono text-[0.7rem] uppercase tracking-[0.22em] text-muted-foreground">
          Compounding hazard log
        </p>
        <Stagger className="mt-4 flex flex-col">
          {problem.crises.map((crisis, i) => (
            <StaggerItem key={crisis.title}>
              <motion.div
                whileHover={reduce ? undefined : { x: 6 }}
                transition={{ type: "spring", stiffness: 300, damping: 26 }}
                className="group grid grid-cols-[auto_1fr] items-start gap-x-5 gap-y-2 border-t border-border py-6 last:border-b sm:grid-cols-[3rem_10rem_1fr_auto] sm:items-center sm:gap-x-8"
              >
                <span className="font-mono text-sm text-signal/70 tabular-nums">
                  0{i + 1}
                </span>
                <div className="col-start-2 sm:col-start-2">
                  <p className="font-mono text-[0.65rem] uppercase tracking-[0.18em] text-signal">
                    {crisis.kicker}
                  </p>
                  <h3 className="mt-1 font-heading text-lg font-semibold text-foreground">
                    {crisis.title}
                  </h3>
                </div>
                <p className="col-span-2 max-w-xl text-sm leading-relaxed text-muted-foreground sm:col-span-1 sm:col-start-3">
                  {crisis.body}
                </p>
                <span className="col-start-2 inline-flex w-fit items-center gap-1.5 rounded-full border border-signal/40 bg-signal/10 px-2.5 py-1 font-mono text-[0.62rem] uppercase tracking-[0.12em] text-signal sm:col-start-4">
                  {crisis.metric}
                </span>
                {/* amber edge lights up on hover */}
                <span
                  aria-hidden="true"
                  className="col-span-full h-px origin-left scale-x-0 bg-gradient-to-r from-signal/60 to-transparent transition-transform duration-500 group-hover:scale-x-100"
                />
              </motion.div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </Section>
  );
}
