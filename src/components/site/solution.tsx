import { TrendingDown, Leaf, ShieldCheck, Radar, Activity, Crosshair, Route } from "lucide-react";
import { solution } from "@/content";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Reveal, Stagger, StaggerItem } from "./reveal";
import { ChartGrid, HexIcon, HexMarker, MarkWatermark, SpotlightCard } from "./brand";

const benefitIcons = [TrendingDown, Leaf, ShieldCheck];

const flow = [
  { icon: Radar, label: "Detect", note: "Every iceberg, all-weather radar" },
  { icon: Activity, label: "Forecast", note: "Drift predicted hours ahead" },
  { icon: Crosshair, label: "Alert", note: "When it enters the corridor" },
  { icon: Route, label: "Reroute", note: "Around it, automatically" },
];

export function Solution() {
  return (
    <section
      id="solution"
      className="relative overflow-hidden bg-[#08171b] py-24 text-white md:py-32"
    >
      {/* Transition seams into the light sections above/below */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-[#f7fafb] to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#f7fafb] to-transparent" />

      {/* Atmosphere */}
      <ChartGrid tone="light" fade="radial" className="opacity-40" />
      <div className="pointer-events-none absolute left-1/2 top-1/3 size-[40rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,color-mix(in_srgb,var(--brand)_20%,transparent),transparent_70%)] blur-2xl" />
      <MarkWatermark
        src="/logo-icon.svg"
        className="absolute -right-20 bottom-10 hidden w-[30rem] opacity-[0.06] invert md:block"
      />

      <div className="relative mx-auto w-full max-w-6xl px-5 md:px-8">
        <Reveal>
          <p className="inline-flex items-center gap-2 font-mono text-[0.7rem] uppercase tracking-[0.25em] text-brand">
            <HexMarker />
            The solution
          </p>
          <h2 className="mt-4 max-w-3xl font-heading text-3xl font-semibold tracking-tight md:text-4xl">
            {solution.headline}
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-zinc-300 md:text-lg">
            {solution.subtext}
          </p>
        </Reveal>

        {/* Benefits as glass spotlight cards */}
        <Stagger className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {solution.benefits.map((b, i) => {
            const Icon = benefitIcons[i];
            return (
              <StaggerItem key={b.title} className="h-full">
                <SpotlightCard className="h-full rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition-colors hover:border-white/20">
                  <HexIcon tone="glass" className="size-11">
                    <Icon className="size-[18px]" strokeWidth={1.75} />
                  </HexIcon>
                  <p className="mt-4 font-heading font-semibold text-white">{b.title}</p>
                  <p className="mt-1 text-sm text-zinc-400">{b.note}</p>
                </SpotlightCard>
              </StaggerItem>
            );
          })}
        </Stagger>

        {/* Flagship: iceberg movement prediction, as a 4-step flow */}
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
                    <span className="absolute inset-0 hex-clip bg-brand/15" />
                    <span className="absolute inset-[3px] hex-clip border border-brand/40 bg-[#0b1f24]" />
                    <step.icon className="relative size-5 text-brand" strokeWidth={1.75} />
                    <span className="absolute -right-1 -top-1 font-mono text-[0.6rem] text-brand/70">
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

        {/* How it works (deep tech), collapsible */}
        <Reveal delay={0.05}>
          <div className="mt-16">
            <p className="inline-flex items-center gap-2 font-mono text-[0.7rem] uppercase tracking-[0.25em] text-brand">
              <HexMarker />
              Under the hood
            </p>
            <div className="mt-5 max-w-3xl">
              <Accordion type="single" collapsible defaultValue="item-0">
                {solution.howItWorks.map((item, i) => (
                  <AccordionItem
                    key={item.title}
                    value={`item-${i}`}
                    className="border-white/10"
                  >
                    <AccordionTrigger className="py-4 text-left font-heading text-base font-medium text-white hover:no-underline">
                      {item.title}
                    </AccordionTrigger>
                    <AccordionContent className="pb-4 text-sm leading-relaxed text-zinc-400">
                      {item.body}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
