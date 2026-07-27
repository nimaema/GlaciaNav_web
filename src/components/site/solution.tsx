import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { solution } from "@/content";
import { Reveal, Section } from "./reveal";
import { DataLabel, MaskChip, PlateFrame } from "./brand";
import { BothniaBase, DriftArrows, RasterLayer, SweepLayer, type RasterMode } from "./bothnia-map";
import { RAMP_CONCENTRATION, RAMP_DRIFT, RAMP_THICKNESS } from "./ice-field";
import { IcebergForecast } from "./iceberg-forecast";

/**
 * The solution on the water it applies to: the Bothnian Bay, with the model's
 * gridded output laid over it. Three layers, one map — concentration, then
 * thickness, then the drift that carries both. Each layer has the colour bar
 * that reads it, because a field without a scale is a picture, not data.
 */

const LAYERS: Array<{
  mode: RasterMode;
  tab: string;
  chip: string;
  ramp: string[];
  from: string;
  to: string;
  arrows?: boolean;
  sweep?: boolean;
}> = [
  {
    mode: "concentration",
    tab: "Ice detection",
    chip: "Ice concentration · 2 km grid",
    ramp: RAMP_CONCENTRATION,
    from: "Open water",
    to: "10/10 ice",
    sweep: true,
  },
  {
    mode: "thickness",
    tab: "Ice thickness",
    chip: "Ice thickness · 2 km grid",
    ramp: RAMP_THICKNESS,
    from: "0 m",
    to: "2.2 m",
  },
  {
    mode: "drift",
    tab: "Drift forecast",
    chip: "Drift +6 h · 2 km grid",
    ramp: RAMP_DRIFT,
    from: "0 cm s⁻¹",
    to: "20 cm s⁻¹",
    arrows: true,
  },
];

function ColourBar({ ramp, from, to }: { ramp: string[]; from: string; to: string }) {
  return (
    <div>
      <div className="flex h-3 w-full max-w-xs border border-ink/40">
        {ramp.map((c) => (
          <span key={c} className="flex-1" style={{ background: c }} />
        ))}
      </div>
      <div className="mt-1.5 flex w-full max-w-xs justify-between font-mono text-[0.6rem] uppercase tracking-[0.1em] text-ink-faint">
        <span>{from}</span>
        <span>{to}</span>
      </div>
    </div>
  );
}

export function Solution() {
  const [mode, setMode] = useState(0);
  const reduce = useReducedMotion();
  const layer = LAYERS[mode];

  return (
    <Section id="solution" className="relative overflow-hidden border-y border-ink/15 bg-paper-deep">
      <Reveal>
        <div className="grid grid-cols-1 items-end gap-6 border-b-2 border-ink pb-8 lg:grid-cols-[1fr_auto]">
          <h2 className="display-condensed max-w-[18ch] text-4xl font-extrabold leading-[0.95] text-ink md:text-5xl lg:text-6xl">
            {solution.headline}
          </h2>
          <p className="max-w-md text-base leading-relaxed text-ink-soft lg:text-right">
            {solution.subtext}
          </p>
        </div>
      </Reveal>

      <div className="mt-10 grid grid-cols-1 items-start gap-10 lg:grid-cols-[minmax(0,24rem)_1fr] lg:gap-14">
        {/* The chart, with the selected field over it */}
        <Reveal>
          <div className="relative aspect-[5/5.6] w-full overflow-hidden rounded-lg border border-ink/70 bg-plate">
            <AnimatePresence mode="wait">
              <motion.div
                key={layer.mode}
                className="absolute inset-0"
                initial={reduce ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={reduce ? undefined : { opacity: 0 }}
                transition={{ duration: 0.25 }}
              >
                <BothniaBase>
                  <RasterLayer mode={layer.mode} />
                  {layer.arrows ? <DriftArrows /> : null}
                  {layer.sweep ? <SweepLayer /> : null}
                </BothniaBase>
              </motion.div>
            </AnimatePresence>
            <span className="absolute left-3 top-3 border border-ink/40 bg-plate/95 px-1.5 py-0.5 font-mono text-[0.6rem] uppercase tracking-[0.1em] text-ink-soft">
              {layer.chip}
            </span>
            <PlateFrame className="m-2.5" />
          </div>
        </Reveal>

        {/* What produced it */}
        <Reveal delay={0.08}>
          <div className="flex w-fit max-w-full overflow-x-auto border border-ink/60" role="tablist" aria-label="Layers">
            {LAYERS.map((l, i) => (
              <button
                key={l.mode}
                role="tab"
                aria-selected={mode === i}
                onClick={() => setMode(i)}
                className={`shrink-0 px-4 py-2.5 font-mono text-[0.68rem] uppercase tracking-[0.12em] transition-colors focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 ${
                  i > 0 ? "border-l border-ink/60" : ""
                } ${mode === i ? "bg-ink text-paper" : "bg-plate text-ink-soft hover:text-ink"}`}
              >
                {l.tab}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={mode}
              initial={reduce ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? undefined : { opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
              className="mt-6"
            >
              <span className="font-mono text-[0.68rem] tabular-nums text-mask-ink">
                {String(mode + 1).padStart(2, "0")}
              </span>
              <h3 className="display-condensed mt-2 text-2xl font-extrabold text-ink md:text-3xl">
                {solution.howItWorks[mode].title}
              </h3>
              <p className="mt-3 max-w-xl text-base leading-relaxed text-ink-soft">
                {solution.howItWorks[mode].body}
              </p>
              <div className="mt-7 border-t border-ink/15 pt-5">
                <ColourBar ramp={layer.ramp} from={layer.from} to={layer.to} />
              </div>
            </motion.div>
          </AnimatePresence>

          {/* What a better ice picture is worth on the bridge */}
          <div className="mt-9 border-t border-ink/15 pt-6">
            <div className="grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-3">
              {solution.benefits.map((b) => (
                <div key={b.title}>
                  <p className="font-semibold text-ink">{b.title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-ink-soft">{b.note}</p>
                </div>
              ))}
            </div>
            <p className="mt-5 flex items-start gap-2 font-mono text-[0.65rem] leading-relaxed tracking-[0.04em] text-ink-faint">
              <MaskChip className="mt-[0.2em]" />
              {solution.benefitsNote}
            </p>
          </div>
        </Reveal>
      </div>

      {/* Flagship: iceberg movement prediction */}
      <Reveal delay={0.05}>
        <div className="mt-16 border-t-2 border-ink pt-8">
          <div className="grid grid-cols-1 items-end gap-6 lg:grid-cols-[1fr_auto]">
            <div>
              <DataLabel className="text-mask-ink">Flagship capability</DataLabel>
              <h3 className="display-condensed mt-3 text-3xl font-extrabold text-ink md:text-4xl">
                {solution.flagship.title}
              </h3>
            </div>
            <p className="max-w-md leading-relaxed text-ink-soft lg:text-right">
              {solution.flagship.body}
            </p>
          </div>
          <div className="mt-8">
            <IcebergForecast />
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
