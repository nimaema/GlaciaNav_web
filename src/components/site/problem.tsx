import { problem } from "@/content";
import { CountUp, Reveal, Section, Stagger, StaggerItem } from "./reveal";
import { DataAgeChart } from "./data-age-chart";
import { DataLabel } from "./brand";

/**
 * The problem, argued as a figure rather than a picture: how old the data on
 * the bridge is, hour by hour, against how old it needs to be. The chart runs
 * the full width of the sheet, the claim sits above it and the numbers read
 * out beneath, so the section is one continuous argument instead of a column
 * of text beside a box.
 */
export function Problem() {
  return (
    <Section id="problem" className="relative overflow-hidden">
      {/* The claim */}
      <Reveal>
        <div className="grid grid-cols-1 items-end gap-6 border-b-2 border-ink pb-8 lg:grid-cols-[1fr_auto]">
          <h2 className="display-condensed max-w-[16ch] text-4xl font-extrabold leading-[0.95] text-ink md:text-5xl lg:text-6xl">
            {problem.headline}
          </h2>
          <p className="max-w-md text-base leading-relaxed text-ink-soft lg:text-right">
            {problem.subtext}
          </p>
        </div>
      </Reveal>

      {/* The evidence */}
      <Reveal delay={0.08}>
        <div className="mt-10">
          <DataLabel className="text-mask-ink">Figure 01 · age of the data in use</DataLabel>
          <div className="mt-5">
            <DataAgeChart />
          </div>
        </div>
      </Reveal>

      {/* What it costs, read straight off the figure */}
      <Reveal delay={0.05}>
        <div className="mt-16 grid grid-cols-1 gap-px bg-ink/15 sm:grid-cols-3">
          {problem.stats.map((stat) => (
            <div key={stat.label} className="flex flex-col gap-2 bg-paper py-7 sm:px-7 sm:first:pl-0">
              <CountUp
                value={stat.value}
                className="display-condensed text-5xl font-extrabold leading-none text-ink md:text-6xl"
              />
              <span className="max-w-[24ch] text-sm leading-relaxed text-ink-soft">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </Reveal>

      {/* The compounding cost, as a ledger */}
      <Stagger className="mt-16 flex flex-col">
        {problem.crises.map((crisis, i) => (
          <StaggerItem key={crisis.title}>
            <div className="grid grid-cols-1 items-start gap-x-8 gap-y-2 border-t border-ink/15 py-6 last:border-b sm:grid-cols-[3rem_11rem_1fr_auto] sm:items-center">
              <span className="font-mono text-[0.68rem] tabular-nums text-ink-faint">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="display-condensed text-xl font-extrabold text-ink">{crisis.title}</h3>
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
