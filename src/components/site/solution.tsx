import { TrendingDown, Leaf, ShieldCheck, Crosshair, Radar, Activity, Route } from "lucide-react";
import { solution } from "@/content";
import { Reveal, Stagger, StaggerItem } from "./reveal";
import { ChartGrid, HexMarker, MarkWatermark } from "./brand";
import { SolutionPipeline } from "./solution-pipeline";

const benefitIcons = [TrendingDown, Leaf, ShieldCheck];

const flow = [
  { icon: Radar, label: "Detect", note: "Every iceberg, all-weather radar", signal: false },
  { icon: Activity, label: "Forecast", note: "Drift predicted hours ahead", signal: false },
  { icon: Crosshair, label: "Alert", note: "When it enters the corridor", signal: true },
  { icon: Route, label: "Reroute", note: "Around it, automatically", signal: false },
];

// Pipeline order (see → predict → route), mapped from the content's tech list.
const stages = [
  { label: "Vision Transformer", sub: "Reads the ice field", body: solution.howItWorks[1].body },
  { label: "Physics-Informed NN", sub: "Forecasts the drift", body: solution.howItWorks[0].body },
  { label: "Route optimizer", sub: "Least resistance", body: solution.howItWorks[2].body },
];

export function Solution() {
  return (
    <section
      id="solution"
      className="relative overflow-hidden bg-abyss py-24 text-white md:py-32"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand/40 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-brand/25 to-transparent" />
      <ChartGrid tone="light" fade="radial" className="opacity-40" />
      <div className="pointer-events-none absolute left-1/2 top-1/4 size-[42rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,color-mix(in_srgb,var(--brand)_16%,transparent),transparent_70%)] blur-2xl" />
      <MarkWatermark
        src="/logo-icon-white-arrow.svg"
        className="absolute -right-20 bottom-10 hidden w-[30rem] opacity-[0.05] invert md:block"
      />

      <div className="relative mx-auto w-full max-w-6xl px-5 md:px-8">
        <Reveal>
          <p className="inline-flex items-center gap-2 font-mono text-[0.7rem] uppercase tracking-[0.25em] text-brand">
            <HexMarker />
            The solution
          </p>
          <h2 className="mt-4 max-w-3xl font-heading text-3xl font-semibold tracking-tight md:text-4xl lg:text-5xl">
            {solution.headline}
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-zinc-300 md:text-lg">
            {solution.subtext}
          </p>
        </Reveal>

        {/* The pipeline — signal flowing through the models */}
        <Reveal delay={0.05}>
          <div className="mt-12">
            <p className="mb-4 font-mono text-[0.65rem] uppercase tracking-[0.2em] text-zinc-400">
              Signal chain · select a stage
            </p>
            <SolutionPipeline stages={stages} />
          </div>
        </Reveal>

        {/* Outputs: the three things the route protects */}
        <Stagger className="mt-10 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/5 sm:grid-cols-3">
          {solution.benefits.map((b, i) => {
            const Icon = benefitIcons[i];
            return (
              <StaggerItem key={b.title} className="bg-abyss">
                <div className="flex h-full items-start gap-3.5 p-6">
                  <Icon className="mt-0.5 size-5 shrink-0 text-brand" strokeWidth={1.75} />
                  <div>
                    <p className="font-heading font-semibold text-white">{b.title}</p>
                    <p className="mt-1 text-sm text-zinc-400">{b.note}</p>
                  </div>
                </div>
              </StaggerItem>
            );
          })}
        </Stagger>

        {/* Flagship: iceberg movement prediction */}
        <Reveal delay={0.05}>
          <div className="mt-6 overflow-hidden rounded-3xl border border-brand/30 bg-gradient-to-br from-white/[0.06] to-white/[0.01] p-7 md:p-10">
            <div className="flex items-center gap-2.5">
              <Crosshair className="size-5 text-brand" strokeWidth={1.75} />
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-brand">
                Flagship feature
              </span>
            </div>
            <h3 className="mt-3 font-heading text-2xl font-semibold md:text-3xl">
              {solution.flagship.title}
            </h3>
            <p className="mt-3 max-w-2xl leading-relaxed text-zinc-300">
              {solution.flagship.body}
            </p>

            <div className="relative mt-9 grid grid-cols-2 gap-x-4 gap-y-9 sm:grid-cols-4">
              <div
                aria-hidden="true"
                className="absolute inset-x-[12%] top-7 hidden h-px bg-gradient-to-r from-brand/10 via-brand/50 to-brand/10 sm:block"
              />
              {flow.map((step, i) => (
                <div key={step.label} className="relative flex flex-col items-center text-center">
                  <span className="relative flex size-14 items-center justify-center">
                    <span className={`absolute inset-0 hex-clip ${step.signal ? "bg-signal/15" : "bg-brand/15"}`} />
                    <span className={`absolute inset-[3px] hex-clip border bg-[#0b1f24] ${step.signal ? "border-signal/50" : "border-brand/40"}`} />
                    <step.icon className={`relative size-5 ${step.signal ? "text-signal" : "text-brand"}`} strokeWidth={1.75} />
                    <span className={`absolute -right-1 -top-1 font-mono text-[0.6rem] ${step.signal ? "text-signal/80" : "text-brand/70"}`}>
                      0{i + 1}
                    </span>
                  </span>
                  <p className="mt-3 font-heading text-sm font-semibold text-white">{step.label}</p>
                  <p className="mt-1 text-xs text-zinc-400">{step.note}</p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
