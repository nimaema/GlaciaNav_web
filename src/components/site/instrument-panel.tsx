import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import { DataLabel, PlateFrame } from "./brand";
import {
  BothniaBase,
  DriftLayer,
  IceMaskLayer,
  SweepLayer,
  ThicknessLayer,
} from "./bothnia-map";
import { ICE_FIELD, THICKNESS_CLASSES } from "./ice-field";

/**
 * The instrument: one chart of the Bothnian Bay, three data layers, switched
 * like layers in a GIS. Detection masks the ice, thickness renders as a heat
 * field, drift as a probability plume running with the current.
 */

export type InstrumentStage = { title: string; body: string };

/** Reads the classes straight off the field, so chart and key cannot drift. */
function ThicknessKey() {
  return (
    <div className="flex flex-col gap-1.5">
      {THICKNESS_CLASSES.map((c) => (
        <div key={c.label} className="flex items-center gap-2.5">
          <span
            className="size-3 shrink-0 outline outline-1 outline-ink/25"
            style={{ background: c.tone }}
          />
          <span className="font-mono text-[0.6rem] uppercase tracking-[0.1em] text-ink-soft">
            {c.label}
          </span>
          <span className="ml-auto font-mono text-[0.6rem] tabular-nums text-ink-faint">
            {c.short} m
          </span>
        </div>
      ))}
    </div>
  );
}

function SwatchKey({ items }: { items: Array<{ label: string; swatch: string }> }) {
  return (
    <div className="flex flex-col gap-1.5">
      {items.map((i) => (
        <div key={i.label} className="flex items-center gap-2.5">
          <span
            className="size-3 shrink-0 outline outline-1 outline-ink/25"
            style={{ background: i.swatch }}
          />
          <span className="font-mono text-[0.6rem] uppercase tracking-[0.1em] text-ink-soft">
            {i.label}
          </span>
        </div>
      ))}
    </div>
  );
}

const LAYER_META = [
  {
    chip: "Layer · ice concentration",
    stat: `${ICE_FIELD.length} floes`,
    legend: (
      <SwatchKey
        items={[
          { label: "Detected sea ice", swatch: "color-mix(in srgb, var(--mask) 50%, var(--plate))" },
          { label: "Open water", swatch: "var(--plate)" },
        ]}
      />
    ),
  },
  {
    chip: "Layer · ice thickness",
    stat: "5 classes",
    legend: <ThicknessKey />,
  },
  {
    chip: "Layer · drift +6 h",
    stat: "vector field",
    legend: (
      <SwatchKey
        items={[
          { label: "Observed now", swatch: "var(--strata-2)" },
          { label: "Forecast +6 h", swatch: "color-mix(in srgb, var(--mask) 34%, var(--plate))" },
        ]}
      />
    ),
  },
];

export function InstrumentPanel({ stages }: { stages: InstrumentStage[] }) {
  const [mode, setMode] = useState(0);
  const reduce = useReducedMotion();

  return (
    <div>
      {/* Layer selector */}
      <div className="flex w-fit max-w-full overflow-x-auto border border-ink/60" role="tablist" aria-label="Capabilities">
        {stages.map((s, i) => (
          <button
            key={s.title}
            role="tab"
            aria-selected={mode === i}
            onClick={() => setMode(i)}
            className={cn(
              "shrink-0 px-4 py-2.5 font-mono text-[0.68rem] uppercase tracking-[0.12em] transition-colors focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50",
              i > 0 && "border-l border-ink/60",
              mode === i ? "bg-ink text-paper" : "bg-plate text-ink-soft hover:text-ink"
            )}
          >
            {s.title}
          </button>
        ))}
      </div>

      <div className="mt-5 grid grid-cols-1 items-start gap-8 lg:grid-cols-[minmax(0,26rem)_1fr] lg:gap-12">
        {/* The chart with the selected layer */}
        <div className="relative aspect-[5/5.8] w-full overflow-hidden rounded-lg border border-ink/70 bg-plate">
          <AnimatePresence mode="wait">
            <motion.div
              key={mode}
              className="absolute inset-0"
              initial={reduce ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={reduce ? undefined : { opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              <BothniaBase>
                {mode === 0 ? (
                  <>
                    <IceMaskLayer mode="live" animate />
                    <SweepLayer />
                  </>
                ) : mode === 1 ? (
                  <ThicknessLayer />
                ) : (
                  <DriftLayer />
                )}
              </BothniaBase>
              <span className="absolute left-3 top-3 flex items-center gap-2 border border-ink/40 bg-plate/95 px-1.5 py-0.5 font-mono text-[0.6rem] uppercase tracking-[0.1em] text-ink-soft">
                {LAYER_META[mode].chip}
                <span className="text-mask-ink">{LAYER_META[mode].stat}</span>
              </span>
            </motion.div>
          </AnimatePresence>
          <PlateFrame className="m-2.5" />
        </div>

        {/* The reading */}
        <div className="lg:pt-2">
          <AnimatePresence mode="wait">
            <motion.div
              key={mode}
              initial={reduce ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? undefined : { opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
            >
              <DataLabel className="text-mask-ink">{stages[mode].title}</DataLabel>
              <p className="mt-3 max-w-xl text-base leading-relaxed text-ink-soft md:text-lg">
                {stages[mode].body}
              </p>
              <div className="mt-8 border-t border-ink/15 pt-5">
                {LAYER_META[mode].legend}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
