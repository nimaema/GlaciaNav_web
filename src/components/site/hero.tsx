import { useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { hero } from "@/content";
import { HERO_IMAGE, ICE_SEGMENTS, type IceSegment } from "./ice-segments";

/**
 * Floe hero: the model's own output, drawn over the real photograph.
 *
 * The frame is an aerial of an icebreaker working a broken field. Over it we
 * render the actual segmentation produced for this image, traced from the
 * model's run-length masks into the photo's native pixel space. A satellite
 * swath crosses left to right; as its leading edge reaches each floe the floe
 * classifies, its detection box locks on, and its class, confidence, thickness
 * and forecast drift are published.
 *
 * Image and overlay share one coordinate space: the image is object-fit cover
 * and the SVG uses the matching `slice` fit and alignment, so no mask can
 * drift off its floe at any viewport.
 *
 * Photo: Pexels (free licence, no attribution required), public/hero-vessel.jpg
 */

const focusRing =
  "focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];
const SWEEP_S = 3.2;
const SWEEP_DELAY = 0.6;
const SWEEP_REPEAT = 11;

/**
 * Floes the model publishes a full record for. All three sit in the right
 * column, the one part of the frame the type never reaches, so they stack
 * into a readout without ever landing on a word.
 */
const RECORDS: Record<string, { code: string; thickness: string; conf: string }> = {
  "3": { code: "FY·07", thickness: "0.4 m", conf: "0.91" },
  "6": { code: "FY·02", thickness: "0.9 m", conf: "0.95" },
  "8": { code: "MY·01", thickness: "1.6 m", conf: "0.97" },
};

/** Floes carrying a forecast drift vector: more of them, quieter than a record. */
const DRIFTING = ["1", "5", "A", "D", "4", "6"];

/** Floes the detector brackets. Compact enough to sit anywhere. */
const BRACKETED = ["1", "5", "A", "D", "3", "6", "8", "9"];

/** Thickness distribution across the classified field, in per cent. */
const HISTOGRAM = [
  { bin: "0.2", v: 16 },
  { bin: "0.6", v: 34 },
  { bin: "1.0", v: 26 },
  { bin: "1.4", v: 15 },
  { bin: "1.8", v: 9 },
];

/** Mean drift for this pass: south-southwest, with the current. */
const DRIFT_DEG = 198;

function bboxOf(d: string) {
  const nums = d.match(/-?\d+(?:\.\d+)?/g)?.map(Number) ?? [];
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  for (let i = 0; i + 1 < nums.length; i += 2) {
    const x = nums[i];
    const y = nums[i + 1];
    if (x < x0) x0 = x;
    if (x > x1) x1 = x;
    if (y < y0) y0 = y;
    if (y > y1) y1 = y;
  }
  return { x: x0, y: y0, w: x1 - x0, h: y1 - y0 };
}

/** When the swath's leading edge reaches a given column, in seconds. */
function reachedAt(cx: number, reduce: boolean | null) {
  return reduce ? 0 : SWEEP_DELAY + (cx / HERO_IMAGE.width) * SWEEP_S;
}

/**
 * The segmentation and everything the model says about it.
 *
 * `align` must mirror the image's object-position: narrow viewports crop to
 * the ice-rich left edge (xMin / object-left), wide ones centre (xMid).
 */
function SegmentationOverlay({
  align,
  className,
  detail,
}: {
  align: "xMin" | "xMid";
  className: string;
  detail: boolean;
}) {
  const reduce = useReducedMotion();
  const { width, height } = HERO_IMAGE;
  const boxes = useMemo(
    () => new Map(ICE_SEGMENTS.map((s) => [s.id, bboxOf(s.d)] as const)),
    []
  );
  const records = ICE_SEGMENTS.filter((s) => RECORDS[s.id]);
  const drifting = ICE_SEGMENTS.filter((s) => DRIFTING.includes(s.id));
  const bracketed = ICE_SEGMENTS.filter((s) => BRACKETED.includes(s.id));

  const drift = (s: IceSegment) => {
    const len = Math.min(190, 60 + Math.sqrt(s.area) * 0.34);
    const rad = (DRIFT_DEG * Math.PI) / 180;
    return { x2: s.cx + Math.sin(rad) * len, y2: s.cy - Math.cos(rad) * len };
  };

  return (
    <svg
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 size-full ${className}`}
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio={`${align}YMid slice`}
    >
      <defs>
        <linearGradient id="hero-swath" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%" stopColor="var(--mask)" stopOpacity="0" />
          <stop offset="82%" stopColor="var(--mask)" stopOpacity="0.30" />
          <stop offset="100%" stopColor="var(--mask)" stopOpacity="0.60" />
        </linearGradient>
        <marker
          id="hero-drift-head"
          viewBox="0 0 10 10"
          refX="8"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto"
        >
          <path d="M0 0 L10 5 L0 10 z" fill="var(--ink)" fillOpacity="0.75" />
        </marker>
      </defs>

      {/* classified ice */}
      {ICE_SEGMENTS.map((s) => (
        <motion.path
          key={s.id}
          d={s.d}
          fillRule="evenodd"
          fill="var(--mask)"
          stroke="var(--mask-ink)"
          strokeWidth={3}
          strokeLinejoin="round"
          initial={reduce ? { opacity: 0.34 } : { opacity: 0 }}
          animate={{ opacity: 0.34 }}
          transition={{ delay: reachedAt(s.cx, reduce), duration: 0.45 }}
        />
      ))}

      {/* forecast drift, flowing with the current */}
      {detail
        ? drifting.map((s) => {
            const { x2, y2 } = drift(s);
            const at = reachedAt(s.cx, reduce);
            return (
              <g key={`d-${s.id}`}>
                <motion.line
                  x1={s.cx}
                  y1={s.cy}
                  x2={x2}
                  y2={y2}
                  stroke="var(--ink)"
                  strokeOpacity={0.6}
                  strokeWidth={3.5}
                  strokeDasharray="14 10"
                  markerEnd="url(#hero-drift-head)"
                  initial={reduce ? false : { pathLength: 0, opacity: 0 }}
                  animate={
                    reduce
                      ? { opacity: 1 }
                      : { pathLength: 1, opacity: 1, strokeDashoffset: [0, -48] }
                  }
                  transition={
                    reduce
                      ? undefined
                      : {
                          pathLength: { delay: at + 0.35, duration: 0.6, ease: EASE },
                          opacity: { delay: at + 0.35, duration: 0.3 },
                          strokeDashoffset: {
                            delay: at + 0.95,
                            duration: 1.6,
                            repeat: Number.POSITIVE_INFINITY,
                            ease: "linear",
                          },
                        }
                  }
                />
              </g>
            );
          })
        : null}

      {/* detection boxes: corner brackets locking on */}
      {detail
        ? bracketed.map((s) => {
            const b = boxes.get(s.id);
            if (!b) return null;
            const pad = 22;
            const x = b.x - pad;
            const y = b.y - pad;
            const w = b.w + pad * 2;
            const h = b.h + pad * 2;
            const arm = Math.min(46, Math.min(w, h) * 0.3);
            const at = reachedAt(s.cx, reduce);
            const corners = [
              `M${x} ${y + arm}L${x} ${y}L${x + arm} ${y}`,
              `M${x + w - arm} ${y}L${x + w} ${y}L${x + w} ${y + arm}`,
              `M${x + w} ${y + h - arm}L${x + w} ${y + h}L${x + w - arm} ${y + h}`,
              `M${x + arm} ${y + h}L${x} ${y + h}L${x} ${y + h - arm}`,
            ];
            return (
              <motion.g
                key={`b-${s.id}`}
                initial={reduce ? false : { opacity: 0, scale: 1.09 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: at + 0.12, duration: 0.5, ease: EASE }}
                style={{ transformOrigin: `${s.cx}px ${s.cy}px` }}
              >
                {corners.map((d) => (
                  <path
                    key={d}
                    d={d}
                    fill="none"
                    stroke="var(--ink)"
                    strokeOpacity={0.8}
                    strokeWidth={4}
                  />
                ))}
              </motion.g>
            );
          })
        : null}

      {/* the swath, with a bright leading edge */}
      {!reduce ? (
        <motion.g
          initial={{ x: -width * 0.34 }}
          animate={{ x: [-width * 0.34, width] }}
          transition={{
            duration: SWEEP_S,
            delay: SWEEP_DELAY,
            repeat: Number.POSITIVE_INFINITY,
            repeatDelay: SWEEP_REPEAT,
            ease: "linear",
          }}
        >
          <rect y="0" width={width * 0.32} height={height} fill="url(#hero-swath)" />
          <rect
            x={width * 0.32 - 3}
            y="0"
            width={5}
            height={height}
            fill="var(--mask-ink)"
            fillOpacity={0.8}
          />
        </motion.g>
      ) : null}

      {/* the record for each published floe */}
      {detail
        ? records.map((s) => {
            const r = RECORDS[s.id];
            const b = boxes.get(s.id);
            if (!b) return null;
            const w = 250;
            const h = 84;
            const x = Math.max(8, Math.min(width - w - 8, s.cx - w / 2));
            // Only the very top of the frame publishes downward; everything
            // else reads upward, which keeps the right column evenly stacked.
            const below = b.y < 300;
            const y = below ? b.y + b.h + 36 : b.y - 36 - h;
            const at = reachedAt(s.cx, reduce);
            return (
              <motion.g
                key={`r-${s.id}`}
                initial={reduce ? false : { opacity: 0, y: below ? -8 : 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: at + 0.28, duration: 0.4, ease: EASE }}
              >
                <line
                  x1={s.cx}
                  y1={below ? y : y + h}
                  x2={s.cx}
                  y2={below ? b.y + b.h + 4 : b.y - 4}
                  stroke="var(--ink)"
                  strokeWidth={3}
                  strokeOpacity={0.5}
                />
                <rect
                  x={x}
                  y={y}
                  width={w}
                  height={h}
                  fill="var(--paper)"
                  fillOpacity={0.93}
                  stroke="var(--ink)"
                  strokeWidth={3}
                  strokeOpacity={0.7}
                />
                <rect x={x} y={y} width={6} height={h} fill="var(--mask)" />
                <text
                  x={x + 20}
                  y={y + 32}
                  fontFamily="var(--font-mono)"
                  fontSize={25}
                  fill="var(--ink-soft)"
                >
                  {r.code}
                </text>
                <text
                  x={x + w - 20}
                  y={y + 32}
                  textAnchor="end"
                  fontFamily="var(--font-mono)"
                  fontSize={25}
                  fill="var(--mask-ink)"
                >
                  {r.conf}
                </text>
                <text
                  x={x + 20}
                  y={y + 66}
                  fontFamily="var(--font-heading)"
                  fontWeight="800"
                  fontSize={32}
                  fill="var(--ink)"
                >
                  {r.thickness}
                </text>
                <text
                  x={x + w - 20}
                  y={y + 66}
                  textAnchor="end"
                  fontFamily="var(--font-mono)"
                  fontSize={19}
                  letterSpacing="1.5"
                  fill="var(--ink-faint)"
                >
                  THICKNESS
                </text>
              </motion.g>
            );
          })
        : null}
    </svg>
  );
}

/** Tracking reticle on the vessel plus the frame's registration ticks. */
function InstrumentOverlay() {
  const reduce = useReducedMotion();
  return (
    <div className="pointer-events-none absolute inset-0 hidden lg:block" aria-hidden="true">
      {/* Sits on the superstructure, above the headline. Chips read upward so
          nothing lands in the type. White brackets: the hull is dark. */}
      <motion.div
        className="absolute -translate-x-1/2"
        style={{ left: "64%", top: "22%" }}
        initial={reduce ? false : { opacity: 0, scale: 1.25 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: reduce ? 0 : 3.4, duration: 0.6, ease: EASE }}
      >
        <div className="mb-2 flex flex-col items-start gap-1">
          <span className="border border-ink/60 bg-paper/90 px-1.5 py-0.5 font-mono text-[0.6rem] uppercase tracking-[0.14em] text-ink backdrop-blur-sm">
            Vessel · tracked
          </span>
          <span className="border border-ink/40 bg-paper/90 px-1.5 py-0.5 font-mono text-[0.58rem] tracking-[0.1em] text-ink-soft backdrop-blur-sm">
            65.17°N 23.54°E
          </span>
        </div>
        <div className="relative h-20 w-44 [filter:drop-shadow(0_1px_2px_rgba(11,36,48,0.55))]">
          {[
            "left-0 top-0 border-l-2 border-t-2",
            "right-0 top-0 border-r-2 border-t-2",
            "left-0 bottom-0 border-l-2 border-b-2",
            "right-0 bottom-0 border-r-2 border-b-2",
          ].map((p) => (
            <span key={p} className={`absolute size-4 border-paper ${p}`} />
          ))}
          <span className="absolute left-1/2 top-1/2 size-1 -translate-x-1/2 -translate-y-1/2 bg-paper" />
        </div>
      </motion.div>

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

/** Thickness distribution across the classified field. */
function Histogram() {
  const reduce = useReducedMotion();
  const peak = Math.max(...HISTOGRAM.map((b) => b.v));
  return (
    <div className="flex h-full flex-col justify-between px-4 py-3.5">
      <span className="font-mono text-[0.58rem] uppercase tracking-[0.14em] text-ink-soft">
        Thickness distribution
      </span>
      <div className="mt-2 flex h-8 items-end gap-1.5">
        {HISTOGRAM.map((b, i) => (
          <motion.span
            key={b.bin}
            className="flex-1 bg-mask outline outline-1 outline-ink/25"
            style={{ transformOrigin: "bottom" }}
            initial={reduce ? false : { scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ delay: reduce ? 0 : 1.3 + i * 0.09, duration: 0.5, ease: EASE }}
          >
            <span className="block" style={{ height: `${(b.v / peak) * 32}px` }} />
          </motion.span>
        ))}
      </div>
      <div className="mt-1 flex justify-between font-mono text-[0.54rem] text-ink-faint">
        <span>0.2 m</span>
        <span>2.0 m</span>
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

const READOUTS = [
  { label: "Floes classified", value: "13" },
  { label: "Ice cover", value: "13.3 %" },
  { label: "Mean thickness", value: "0.72 m" },
  { label: "Drift forecast", value: "+6 h" },
];

export function Hero() {
  const reduce = useReducedMotion();

  return (
    <section id="hero" className="relative flex min-h-[100dvh] w-full flex-col overflow-hidden bg-paper">
      {/* The frame. Narrow viewports crop left, wide ones centre; the overlay
          alignment below mirrors this exactly. */}
      <motion.img
        src="/hero-vessel.jpg"
        alt="An icebreaker cutting a channel through a broken sea-ice field, seen from above."
        className="absolute inset-0 size-full object-cover object-left [filter:saturate(0.62)_brightness(1.12)_contrast(0.97)] lg:object-center"
        initial={reduce ? false : { scale: 1.05 }}
        animate={{ scale: 1 }}
        transition={{ duration: reduce ? 0 : 2, ease: EASE }}
      />

      <SegmentationOverlay align="xMin" className="lg:hidden" detail={false} />
      <SegmentationOverlay align="xMid" className="hidden lg:block" detail />

      {/* cold-light grade + legibility */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,color-mix(in_srgb,var(--paper)_80%,transparent),color-mix(in_srgb,var(--paper)_8%,transparent)_36%,color-mix(in_srgb,var(--paper)_16%,transparent)_58%,color-mix(in_srgb,var(--paper)_90%,transparent))]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,color-mix(in_srgb,var(--paper)_58%,transparent),transparent_45%)]" />

      <InstrumentOverlay />

      {/* Composition */}
      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-1 flex-col px-5 pb-8 pt-24 md:px-8">
        <motion.div
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="flex items-start justify-between font-mono text-[0.66rem] uppercase tracking-[0.22em] text-ink-soft"
        >
          <span>Ice intelligence · Turku, Finland</span>
          <span className="hidden items-center gap-1.5 text-mask-ink sm:inline-flex">
            <span className="size-1.5 rounded-full bg-mask outline outline-1 outline-ink/30" />
            Live pass · Bay of Bothnia
          </span>
        </motion.div>

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

          {/* what the pass produced */}
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: reduce ? 0 : 1 }}
            className="mt-10 grid grid-cols-2 divide-ink/15 border border-ink/25 bg-paper/70 backdrop-blur-md sm:grid-cols-4 sm:divide-x lg:grid-cols-[repeat(4,minmax(0,1fr))_15rem]"
          >
            {READOUTS.map((r) => (
              <div key={r.label} className="px-4 py-3.5">
                <dt className="font-mono text-[0.58rem] uppercase tracking-[0.14em] text-ink-soft">
                  {r.label}
                </dt>
                <dd className="mt-0.5 font-mono text-sm font-bold text-ink tabular-nums">{r.value}</dd>
              </div>
            ))}
            <div className="col-span-2 border-t border-ink/15 sm:col-span-4 sm:border-t lg:col-span-1 lg:border-l lg:border-t-0">
              <Histogram />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
