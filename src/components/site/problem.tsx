import { problem } from "@/content";
import { CountUp, Reveal, Section, Stagger, StaggerItem } from "./reveal";
import { ChartComparison } from "./problem-visual";

/**
 * The problem, argued with evidence: a draggable comparison between the chart
 * a bridge sails on and the water as it actually is, then the numbers, then
 * the three compounding costs as a survey ledger.
 */
export function Problem() {
  return (
    <Section id="problem" className="relative overflow-hidden">
      <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16">
        <Reveal>
          <h2 className="display-condensed text-4xl font-extrabold leading-[0.95] text-ink md:text-5xl">
            {problem.headline}
          </h2>
          <p className="mt-5 max-w-md text-base leading-relaxed text-ink-soft md:text-lg">
            {problem.subtext}
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <ChartComparison />
        </Reveal>
      </div>

      {/* The numbers, set like survey readouts */}
      <Reveal delay={0.05}>
        <div className="mt-16 grid grid-cols-1 border-y border-ink/20 sm:grid-cols-3">
          {problem.stats.map((stat, i) => (
            <div
              key={stat.label}
              className={`flex flex-col gap-2 py-7 sm:px-7 ${
                i > 0 ? "border-t border-ink/15 sm:border-l sm:border-t-0" : "sm:pl-0"
              }`}
            >
              <CountUp
                value={stat.value}
                className="display-condensed text-5xl font-extrabold leading-none text-ink md:text-6xl"
              />
              <span className="max-w-[22ch] text-sm leading-relaxed text-ink-soft">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </Reveal>

      {/* What it costs: a stacked ledger, no cards */}
      <Stagger className="mt-16 flex flex-col">
        {problem.crises.map((crisis) => (
          <StaggerItem key={crisis.title}>
            <div className="group grid grid-cols-1 items-start gap-x-8 gap-y-2 border-t border-ink/15 py-6 last:border-b sm:grid-cols-[11rem_1fr_auto] sm:items-center">
              <h3 className="display-condensed text-xl font-extrabold text-ink">
                {crisis.title}
              </h3>
              <p className="max-w-xl text-sm leading-relaxed text-ink-soft">{crisis.body}</p>
              <span className="inline-flex w-fit items-center border border-ink/40 px-2.5 py-1 font-mono text-[0.62rem] uppercase tracking-[0.12em] text-ink">
                {crisis.metric}
              </span>
            </div>
          </StaggerItem>
        ))}
      </Stagger>
    </Section>
  );
}
