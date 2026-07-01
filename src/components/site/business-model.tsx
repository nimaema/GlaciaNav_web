import { RefreshCw, Percent, Check } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { businessModel } from "@/content";
import { Reveal, Section, SectionHead } from "./reveal";
import { HexIcon, MarkWatermark } from "./brand";
import { TiltCard } from "./cards";

const streamIcons = [RefreshCw, Percent];

/**
 * The savings gap: baseline voyage fuel vs the optimized route. The delta is
 * the only number a fleet cares about — and where GlaciaNav's two revenue
 * streams live (a base licence, plus a share of the proven delta).
 */
function SavingsGap() {
  const reduce = useReducedMotion();
  const optimized = 91; // % of baseline after routing → 9% proven savings
  return (
    <div className="rounded-3xl border border-border bg-abyss p-6 md:p-8">
      <div className="flex items-center justify-between font-mono text-[0.62rem] uppercase tracking-[0.16em]">
        <span className="text-muted-foreground">Voyage fuel · per vessel</span>
        <span className="text-signal">−{100 - optimized}% proven</span>
      </div>

      <div className="mt-6 space-y-5">
        {/* Baseline */}
        <div>
          <div className="mb-1.5 flex items-center justify-between text-xs text-muted-foreground">
            <span>Baseline route</span>
            <span className="font-mono">100</span>
          </div>
          <div className="h-6 overflow-hidden rounded-md bg-white/[0.04]">
            <motion.div
              className="h-full rounded-md bg-gradient-to-r from-white/15 to-white/25"
              initial={reduce ? false : { width: 0 }}
              whileInView={{ width: "100%" }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            />
          </div>
        </div>

        {/* With GlaciaNav + the savings zone */}
        <div>
          <div className="mb-1.5 flex items-center justify-between text-xs">
            <span className="text-brand-strong">With GlaciaNav</span>
            <span className="font-mono text-brand-strong">{optimized}</span>
          </div>
          <div className="relative flex h-6 overflow-hidden rounded-md bg-white/[0.04]">
            <motion.div
              className="h-full bg-gradient-to-r from-brand-strong/70 to-brand/70"
              initial={reduce ? false : { width: 0 }}
              whileInView={{ width: `${optimized}%` }}
              viewport={{ once: true }}
              transition={{ duration: 1.1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            />
            {/* savings delta — hatched amber */}
            <motion.div
              className="h-full border-l border-signal/60 bg-[repeating-linear-gradient(45deg,color-mix(in_srgb,var(--signal)_22%,transparent)_0,color-mix(in_srgb,var(--signal)_22%,transparent)_4px,transparent_4px,transparent_8px)]"
              style={{ width: `${100 - optimized}%` }}
              initial={reduce ? false : { opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 1.2 }}
            />
          </div>
          <div className="mt-2 flex justify-end">
            <span
              className="font-mono text-[0.62rem] uppercase tracking-[0.14em] text-signal"
              style={{ width: `${100 - optimized}%`, textAlign: "center" }}
            >
              ↑ savings
            </span>
          </div>
        </div>
      </div>

      <p className="mt-5 border-t border-border pt-4 text-sm leading-relaxed text-muted-foreground">
        A per-vessel licence runs the platform. The performance fee is only a{" "}
        <span className="text-signal">share of that amber delta</span> — measured against the
        vessel's own baseline.
      </p>
    </div>
  );
}

function Stream({ index }: { index: number }) {
  const stream = businessModel.streams[index];
  const Icon = streamIcons[index];
  return (
    <TiltCard className="h-full">
      <div className="flex items-center justify-between">
        <HexIcon tone="glass" className="size-12">
          <Icon className="size-5" strokeWidth={1.75} />
        </HexIcon>
        <span className="rounded-full border border-white/15 bg-white/[0.04] px-3 py-1 font-mono text-[0.65rem] uppercase tracking-[0.14em] text-brand">
          {stream.tag}
        </span>
      </div>
      <h3 className="mt-5 font-heading text-xl font-semibold text-white">{stream.title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-zinc-300">{stream.body}</p>
      <ul className="mt-5 flex flex-col gap-2.5 border-t border-white/10 pt-5">
        {stream.points.map((point) => (
          <li key={point} className="flex items-center gap-2.5 text-sm text-zinc-200">
            <Check className="size-4 shrink-0 text-brand" strokeWidth={2.25} />
            {point}
          </li>
        ))}
      </ul>
    </TiltCard>
  );
}

export function BusinessModel() {
  return (
    <Section id="business">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center lg:gap-16">
        <Reveal>
          <SectionHead title={businessModel.headline} intro={businessModel.subtext} />
        </Reveal>
        <Reveal delay={0.1}>
          <SavingsGap />
        </Reveal>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
        <Reveal delay={0.05}>
          <Stream index={0} />
        </Reveal>
        <Reveal delay={0.1}>
          <Stream index={1} />
        </Reveal>
      </div>

      {/* Pull quote */}
      <Reveal delay={0.1}>
        <div className="relative mt-8 overflow-hidden rounded-3xl border border-signal/25 bg-gradient-to-br from-signal/[0.06] to-card px-7 py-12 text-center md:py-16">
          <MarkWatermark src="/favicon.svg" className="absolute -right-10 -top-10 w-48 opacity-[0.05]" />
          <MarkWatermark src="/favicon.svg" className="absolute -bottom-12 -left-10 w-44 opacity-[0.04]" />
          <p className="relative mx-auto max-w-3xl text-balance font-heading text-2xl font-medium leading-snug tracking-tight text-foreground md:text-[2rem]">
            “{businessModel.pullQuote}”
          </p>
        </div>
      </Reveal>
    </Section>
  );
}
