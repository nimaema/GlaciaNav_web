import { RefreshCw, Antenna, Check } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { businessModel } from "@/content";
import { Reveal, Section, SectionHead } from "./reveal";
import { MaskChip } from "./brand";

const streamIcons = [RefreshCw, Antenna];

/**
 * The savings hypothesis: baseline voyage fuel vs the same voyage sailed with
 * a live ice picture. The delta is explicitly unproven, and revenue does not
 * depend on it: the subscription does.
 */
function SavingsHypothesis() {
  const reduce = useReducedMotion();
  const informed = 91; // % of baseline, the hypothesised delta
  return (
    <div className="rounded-lg border border-ink/70 bg-plate p-6 md:p-8">
      <div className="flex items-center justify-between font-mono text-[0.62rem] uppercase tracking-[0.14em]">
        <span className="text-ink-faint">Voyage fuel · per vessel</span>
        <span className="inline-flex items-center gap-1.5 border border-ink/50 bg-mask px-2 py-0.5 text-ink">
          Hypothesis
        </span>
      </div>

      <div className="mt-6 space-y-5">
        <div>
          <div className="mb-1.5 flex items-center justify-between text-xs text-ink-soft">
            <span>Baseline voyage</span>
            <span className="font-mono">100</span>
          </div>
          <div className="h-6 overflow-hidden border border-ink/25 bg-paper-deep">
            <motion.div
              className="h-full bg-strata-2"
              initial={reduce ? false : { width: 0 }}
              whileInView={{ width: "100%" }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            />
          </div>
        </div>

        <div>
          <div className="mb-1.5 flex items-center justify-between text-xs">
            <span className="font-medium text-ink">With GlaciaNav</span>
            <span className="font-mono text-ink">{informed}</span>
          </div>
          <div className="relative flex h-6 overflow-hidden border border-ink/25 bg-paper-deep">
            <motion.div
              className="h-full bg-strata-4"
              initial={reduce ? false : { width: 0 }}
              whileInView={{ width: `${informed}%` }}
              viewport={{ once: true }}
              transition={{ duration: 1.1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            />
            {/* the unproven delta, masked chartreuse */}
            <motion.div
              className="h-full border-l border-ink/40 bg-[repeating-linear-gradient(45deg,var(--mask)_0,var(--mask)_4px,transparent_4px,transparent_8px)]"
              style={{ width: `${100 - informed}%` }}
              initial={reduce ? false : { opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 1.2 }}
            />
          </div>
          <div className="mt-2 flex justify-end">
            <span
              className="font-mono text-[0.62rem] uppercase tracking-[0.12em] text-mask-ink"
              style={{ width: `${100 - informed}%`, textAlign: "center" }}
            >
              ↑ unproven
            </span>
          </div>
        </div>
      </div>

      <p className="mt-5 border-t border-ink/15 pt-4 text-sm leading-relaxed text-ink-soft">
        We charge a subscription, not a cut of the fuel bill. The chartreuse delta is a
        hypothesis the Baltic Beta is designed to measure against each vessel's own baseline.
      </p>
    </div>
  );
}

function Stream({ index }: { index: number }) {
  const stream = businessModel.streams[index];
  const Icon = streamIcons[index];
  return (
    <div className="flex h-full flex-col rounded-lg border border-ink/70 bg-plate p-6 md:p-7">
      <div className="flex items-center justify-between">
        <span className="flex size-11 items-center justify-center border border-ink bg-paper text-ink">
          <Icon className="size-5" strokeWidth={1.75} />
        </span>
        <span className="inline-flex items-center gap-1.5 border border-ink/40 px-2.5 py-1 font-mono text-[0.62rem] uppercase tracking-[0.12em] text-ink-soft">
          <MaskChip className="size-2" />
          {stream.tag}
        </span>
      </div>
      <h3 className="display-condensed mt-5 text-2xl font-extrabold text-ink">{stream.title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-ink-soft">{stream.body}</p>
      <ul className="mt-5 flex flex-col gap-2.5 border-t border-ink/15 pt-5">
        {stream.points.map((point) => (
          <li key={point} className="flex items-center gap-2.5 text-sm text-ink">
            <Check className="size-4 shrink-0 text-mask-ink" strokeWidth={2.25} />
            {point}
          </li>
        ))}
      </ul>
    </div>
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
          <SavingsHypothesis />
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
    </Section>
  );
}
