import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { hero } from "@/content";

/**
 * Floe hero: one full-bleed frame of the real thing. An aerial of an
 * icebreaker working a broken ice field, graded into cold daylight, with the
 * model's segmentation traced over the actual floes in the image: cyan mask,
 * measured thickness. Type runs the full width over the photograph; a glass
 * telemetry bar closes the frame. No columns, no cards.
 *
 * Photo: Pexels (free licence, no attribution required), public/hero-vessel.jpg
 */

const focusRing =
  "focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const READOUTS = [
  { label: "Mean thickness", value: "0.72 m" },
  { label: "Floes tracked", value: "1,284" },
  { label: "Drift forecast", value: "+6 h" },
  { label: "Source", value: "Sentinel-1" },
];

/** One quiet satellite sweep across the frame. */
function SweepOverlay() {
  const reduce = useReducedMotion();
  if (reduce) return null;
  return (
    <motion.span
      aria-hidden="true"
      className="pointer-events-none absolute inset-y-0 w-28 bg-[linear-gradient(to_right,transparent,color-mix(in_srgb,var(--mask)_26%,transparent),transparent)]"
      initial={{ left: "-12%" }}
      animate={{ left: ["-12%", "106%"] }}
      transition={{ duration: 2.8, delay: 1.2, repeat: Number.POSITIVE_INFINITY, repeatDelay: 9, ease: "linear" }}
    />
  );
}

/**
 * Instrument furniture over the frame: a faint acquisition graticule, the
 * tracking reticle locked on the vessel with its fix, a chart scale bar and
 * the frame's registration ticks. Everything labeled, everything still.
 */
function InstrumentOverlay() {
  const reduce = useReducedMotion();
  return (
    <div className="pointer-events-none absolute inset-0 hidden lg:block" aria-hidden="true">
      {/* acquisition graticule, barely there */}
      <svg className="absolute inset-0 size-full opacity-[0.35]">
        <defs>
          <pattern id="hero-grat" width="120" height="120" patternUnits="userSpaceOnUse">
            <path d="M120 0H0V120" fill="none" stroke="rgba(11,36,48,0.16)" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#hero-grat)" />
      </svg>

      {/* tracking reticle on the vessel */}
      <motion.div
        className="absolute -translate-x-1/2 -translate-y-1/2"
        style={{ left: "55%", top: "40%" }}
        initial={reduce ? false : { opacity: 0, scale: 1.3 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: reduce ? 0 : 1.4, duration: 0.6, ease: EASE }}
      >
        <div className="relative h-24 w-40">
          {[
            "left-0 top-0 border-l-2 border-t-2",
            "right-0 top-0 border-r-2 border-t-2",
            "left-0 bottom-0 border-l-2 border-b-2",
            "right-0 bottom-0 border-r-2 border-b-2",
          ].map((p) => (
            <span key={p} className={`absolute size-4 border-ink/80 ${p}`} />
          ))}
          <span className="absolute left-1/2 top-1/2 size-1 -translate-x-1/2 -translate-y-1/2 bg-ink" />
        </div>
        <div className="mt-2 flex flex-col items-start gap-1">
          <span className="border border-ink/60 bg-paper/85 px-1.5 py-0.5 font-mono text-[0.6rem] uppercase tracking-[0.14em] text-ink backdrop-blur-sm">
            Vessel · tracked
          </span>
          <span className="border border-ink/40 bg-paper/85 px-1.5 py-0.5 font-mono text-[0.58rem] tracking-[0.1em] text-ink-soft backdrop-blur-sm">
            65.17°N 23.54°E
          </span>
        </div>
      </motion.div>

      {/* frame registration ticks */}
      {[
        "left-5 top-[4.8rem] border-l border-t",
        "right-5 top-[4.8rem] border-r border-t",
        "left-5 bottom-5 border-l border-b",
        "right-5 bottom-5 border-r border-b",
      ].map((pos) => (
        <span key={pos} className={`absolute size-4 border-ink/45 ${pos}`} />
      ))}
    </div>
  );
}

/** Chart scale bar: alternating filled segments, like the real thing. */
function ScaleBar() {
  return (
    <div className="hidden flex-col items-end gap-1 lg:flex" aria-hidden="true">
      <div className="flex h-1.5 w-36 border border-ink/60">
        <span className="flex-1 bg-ink/70" />
        <span className="flex-1" />
        <span className="flex-1 bg-ink/70" />
        <span className="flex-1" />
      </div>
      <div className="flex w-36 justify-between font-mono text-[0.56rem] tracking-[0.08em] text-ink-soft">
        <span>0</span>
        <span>1 km</span>
        <span>2 km</span>
      </div>
    </div>
  );
}

function AnimatedHeadline({ text }: { text: string }) {
  const reduce = useReducedMotion();
  const words = text.split(" ");
  return (
    <h1 className="display-condensed max-w-[12ch] text-[3.2rem] font-extrabold leading-[0.9] text-ink sm:text-[4.6rem] lg:max-w-none lg:text-[7rem] xl:text-[7.8rem]">
      {words.map((word, i) => {
        const accent = word.replace(/[.,]/g, "").toLowerCase() === "ice";
        return (
          <span key={i} className="mr-[0.2em] inline-block overflow-hidden pb-[0.06em] align-top last:mr-0">
            <motion.span
              className={`inline-block ${accent ? "mask-highlight" : ""}`}
              initial={reduce ? false : { y: "110%" }}
              animate={{ y: 0 }}
              transition={{ delay: reduce ? 0 : 0.2 + i * 0.09, duration: 0.75, ease: EASE }}
            >
              {word}
            </motion.span>
          </span>
        );
      })}
    </h1>
  );
}

export function Hero() {
  const reduce = useReducedMotion();

  return (
    <section id="hero" className="relative flex min-h-[100dvh] w-full flex-col overflow-hidden bg-paper">
      {/* The frame: real ice, graded into cold daylight */}
      <motion.img
        src="/hero-vessel.jpg"
        alt="An icebreaker cutting a channel through a broken sea-ice field, seen from above."
        className="absolute inset-0 size-full object-cover object-[56%_36%] [filter:saturate(0.6)_brightness(1.14)_contrast(0.96)]"
        initial={reduce ? false : { scale: 1.06 }}
        animate={{ scale: 1 }}
        transition={{ duration: reduce ? 0 : 2, ease: EASE }}
      />
      {/* cold-light grade + legibility, top and bottom */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,color-mix(in_srgb,var(--paper)_82%,transparent),color-mix(in_srgb,var(--paper)_10%,transparent)_38%,color-mix(in_srgb,var(--paper)_18%,transparent)_62%,color-mix(in_srgb,var(--paper)_88%,transparent))]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,color-mix(in_srgb,var(--paper)_55%,transparent),transparent_45%)]" />

      <InstrumentOverlay />
      <SweepOverlay />

      {/* Composition */}
      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-1 flex-col px-5 pb-8 pt-24 md:px-8">
        {/* top line */}
        <motion.div
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="flex items-center justify-between font-mono text-[0.66rem] uppercase tracking-[0.22em] text-ink-soft"
        >
          <span>Ice intelligence · Turku, Finland</span>
          <span className="hidden flex-col items-end gap-2.5 sm:flex">
            <span className="inline-flex items-center gap-1.5 text-mask-ink">
              <span className="size-1.5 rounded-full bg-mask outline outline-1 outline-ink/30" />
              Live pass · Bay of Bothnia
            </span>
            <ScaleBar />
          </span>
        </motion.div>

        {/* the claim, full width */}
        <div className="mt-auto pt-16">
          <AnimatedHeadline text={hero.headline} />

          <div className="mt-8 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <motion.p
              initial={reduce ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: reduce ? 0 : 0.7 }}
              className="max-w-md text-balance text-base leading-relaxed text-ink md:text-lg"
            >
              {hero.subtext}
            </motion.p>

            <motion.div
              initial={reduce ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: reduce ? 0 : 0.85 }}
              className="flex shrink-0 flex-col items-start gap-3 sm:flex-row sm:items-center"
            >
              <a
                href="#contact"
                className={`group inline-flex h-11 items-center justify-center gap-2 rounded-sm bg-primary px-6 text-sm font-semibold text-primary-foreground transition-transform duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] hover:brightness-105 active:scale-[0.98] ${focusRing}`}
              >
                {hero.primaryCta}
                <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
              </a>
              <a
                href="#solution"
                className={`inline-flex h-11 items-center justify-center rounded-sm border border-ink/40 bg-paper/60 px-6 text-sm font-medium text-ink backdrop-blur-sm transition-colors hover:border-ink hover:bg-ink hover:text-paper active:scale-[0.98] ${focusRing}`}
              >
                {hero.secondaryCta}
              </a>
            </motion.div>
          </div>

          {/* glass telemetry bar */}
          <motion.dl
            initial={reduce ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: reduce ? 0 : 1 }}
            className="mt-10 grid grid-cols-2 divide-ink/15 border border-ink/25 bg-paper/70 backdrop-blur-md sm:grid-cols-4 sm:divide-x"
          >
            {READOUTS.map((r) => (
              <div key={r.label} className="px-4 py-3.5">
                <dt className="font-mono text-[0.58rem] uppercase tracking-[0.14em] text-ink-soft">
                  {r.label}
                </dt>
                <dd className="mt-0.5 font-mono text-sm font-bold text-ink tabular-nums">{r.value}</dd>
              </div>
            ))}
          </motion.dl>
        </div>
      </div>
    </section>
  );
}
