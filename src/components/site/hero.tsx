import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { hero } from "@/content";
import { HexMarker } from "./brand";

/**
 * Hero: a real icebreaker (the Mikhail Somov, aerial) treated as a live SAR
 * feed. The photo is graded into the polar-night palette and an animated
 * navigation overlay is projected on top — the computed route off the bow,
 * waypoints, a tracking reticle on the vessel, a scan sweep and telemetry.
 *
 * Photo: Pexels (free licence, no attribution required) — /public/hero-vessel.jpg
 */

const focusRing =
  "focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

/** Route in 0–100 container coordinates: foreground ice → the vessel's bow. */
const ROUTE = [
  [15, 95],
  [30, 82],
  [42, 70],
  [52, 60],
  [60, 52],
];
const WAYPOINTS = [
  { x: 30, y: 82, label: "WP·01" },
  { x: 42, y: 70, label: "WP·02" },
  { x: 52, y: 60, label: "WP·03" },
];
const routeD = ROUTE.map(([x, y], i) => `${i ? "L" : "M"}${x} ${y}`).join(" ");

function AnimatedHeadline({ text }: { text: string }) {
  const reduce = useReducedMotion();
  const words = text.split(" ");
  return (
    <h1 className="font-heading text-[2.7rem] font-semibold leading-[1.0] tracking-tight text-white drop-shadow-[0_2px_24px_rgba(3,20,26,0.6)] sm:text-6xl lg:text-[4.5rem]">
      {words.map((word, wordIndex) => {
        const accent = word.replace(/[.,]/g, "").toLowerCase() === "ice";
        return (
          <span key={wordIndex} className="mr-[0.25em] inline-block last:mr-0">
            {word.split("").map((letter, letterIndex) => (
              <motion.span
                key={`${wordIndex}-${letterIndex}`}
                className={`inline-block ${accent ? "text-brand-strong" : ""}`}
                initial={reduce ? false : { y: 60, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{
                  delay: reduce ? 0 : 0.3 + wordIndex * 0.08 + letterIndex * 0.025,
                  type: "spring",
                  stiffness: 160,
                  damping: 24,
                }}
              >
                {letter}
              </motion.span>
            ))}
          </span>
        );
      })}
    </h1>
  );
}

/** A gently drifting mono readout — sells "live" without being noisy. */
function LiveHeading() {
  const reduce = useReducedMotion();
  const [h, setH] = useState(41.2);
  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => {
      setH((v) => Math.min(44, Math.max(38, v + (Math.random() - 0.5) * 0.6)));
    }, 1600);
    return () => clearInterval(id);
  }, [reduce]);
  return <>{h.toFixed(1)}°</>;
}

const READOUTS = [
  { label: "Heading", value: <LiveHeading /> },
  { label: "Ice", value: "0.7 m" },
  { label: "Route", value: "−9% fuel" },
];

/** Projected navigation overlay: route, waypoints, tracking reticle, scan sweep. */
function NavOverlay() {
  const reduce = useReducedMotion();
  return (
    <div className="pointer-events-none absolute inset-0 z-20" aria-hidden="true">
      {/* Projected route + waypoints — shown where the vessel sits beside the
          copy (lg+); below that the copy would collide with it. */}
      <div className="absolute inset-0 hidden lg:block">
      {/* Route + glow, drawn in container space */}
      <svg
        className="absolute inset-0 size-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <motion.path
          d={routeD}
          fill="none"
          stroke="var(--signal)"
          strokeWidth={6}
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={0.18}
          vectorEffect="non-scaling-stroke"
          style={{ filter: "blur(3px)" }}
          initial={reduce ? false : { pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: reduce ? 0 : 1.6, delay: 0.6, ease: EASE }}
        />
        <motion.path
          d={routeD}
          fill="none"
          stroke="var(--signal)"
          strokeWidth={1.75}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="0.1 3"
          vectorEffect="non-scaling-stroke"
          initial={reduce ? false : { pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: reduce ? 0 : 1.6, delay: 0.6, ease: EASE }}
        />
      </svg>

      {/* Waypoint diamonds + labels */}
      {WAYPOINTS.map((wp, i) => (
        <motion.div
          key={wp.label}
          className="absolute -translate-x-1/2 -translate-y-1/2"
          style={{ left: `${wp.x}%`, top: `${wp.y}%` }}
          initial={reduce ? false : { opacity: 0, scale: 0.4 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: reduce ? 0 : 1 + i * 0.25, duration: 0.4, ease: EASE }}
        >
          <span className="block size-2.5 rotate-45 border border-signal bg-abyss/70 shadow-[0_0_10px_2px_color-mix(in_srgb,var(--signal)_55%,transparent)]" />
          <span className="absolute left-4 top-1/2 hidden -translate-y-1/2 whitespace-nowrap font-mono text-[0.55rem] tracking-[0.15em] text-signal/90 sm:block">
            {wp.label}
          </span>
        </motion.div>
      ))}

      {/* Amber pulse travelling the route */}
      {!reduce ? (
        <svg
          className="absolute inset-0 size-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <motion.circle
            r={0.8}
            fill="var(--signal)"
            vectorEffect="non-scaling-stroke"
            style={{ filter: "drop-shadow(0 0 4px var(--signal))" }}
            animate={{
              cx: ROUTE.map((p) => p[0]),
              cy: ROUTE.map((p) => p[1]),
            }}
            transition={{
              duration: 3.4,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
              repeatDelay: 1.2,
              delay: 2.2,
            }}
          />
        </svg>
      ) : null}
      </div>

      {/* Tracking reticle over the vessel */}
      <motion.div
        className="absolute hidden -translate-x-1/2 -translate-y-1/2 lg:block"
        style={{ left: "61%", top: "46%" }}
        initial={reduce ? false : { opacity: 0, scale: 1.4 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: reduce ? 0 : 1.6, duration: 0.6, ease: EASE }}
      >
        <div className="relative size-28">
          {[
            "left-0 top-0 border-l-2 border-t-2",
            "right-0 top-0 border-r-2 border-t-2",
            "left-0 bottom-0 border-l-2 border-b-2",
            "right-0 bottom-0 border-r-2 border-b-2",
          ].map((p) => (
            <span key={p} className={`absolute size-4 border-brand-strong ${p}`} />
          ))}
          <motion.span
            className="absolute left-1/2 top-full ml-2 mt-1 -translate-x-1/2 whitespace-nowrap font-mono text-[0.55rem] uppercase tracking-[0.2em] text-brand-strong"
            animate={reduce ? undefined : { opacity: [1, 0.4, 1] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
          >
            Vessel · tracked
          </motion.span>
        </div>
      </motion.div>

      {/* SAR scan sweep */}
      {!reduce ? (
        <motion.div
          className="absolute inset-x-0 h-24 bg-[linear-gradient(to_bottom,transparent,color-mix(in_srgb,var(--brand)_10%,transparent),transparent)]"
          initial={{ top: "-10%" }}
          animate={{ top: ["-10%", "100%"] }}
          transition={{ duration: 6, repeat: Number.POSITIVE_INFINITY, ease: "linear", delay: 1 }}
        />
      ) : null}

      {/* Corner crop marks framing the feed */}
      {[
        "left-5 top-24 border-l border-t",
        "right-5 top-24 border-r border-t",
        "left-5 bottom-6 border-l border-b",
        "right-5 bottom-6 border-r border-b",
      ].map((pos) => (
        <span key={pos} className={`absolute size-4 border-brand/40 ${pos}`} />
      ))}
    </div>
  );
}

export function Hero() {
  const reduce = useReducedMotion();

  return (
    <section
      id="hero"
      className="relative flex min-h-[100dvh] w-full items-end overflow-hidden bg-abyss"
    >
      {/* The live feed */}
      <motion.img
        src="/hero-vessel.jpg"
        alt="An icebreaker cutting a channel through a broken sea-ice field, seen from above."
        className="absolute inset-0 size-full object-cover object-[56%_36%] [filter:brightness(0.68)_contrast(1.06)_saturate(0.92)]"
        initial={reduce ? false : { scale: 1.08, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: reduce ? 0 : 1.6, ease: EASE }}
      />
      {/* Grade the feed into the polar-night palette */}
      <div className="pointer-events-none absolute inset-0 bg-[#04171d] mix-blend-color opacity-35" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_100%_at_65%_35%,transparent_0%,color-mix(in_srgb,var(--abyss)_55%,transparent)_70%,var(--abyss)_100%)]" />
      {/* Legibility scrims: bottom + left */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background via-background/55 to-transparent" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-background/85 via-background/20 to-transparent" />
      {/* Blend into the fixed nav */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-abyss/90 to-transparent" />

      <NavOverlay />

      {/* Top status bar */}
      <div className="absolute inset-x-0 top-0 z-30 mx-auto flex w-full max-w-6xl items-center justify-between px-6 pt-24 font-mono text-[0.62rem] uppercase tracking-[0.2em] md:px-8">
        <span className="inline-flex items-center gap-1.5 text-brand-strong">
          <motion.span
            className="size-1.5 rounded-full bg-signal"
            animate={reduce ? undefined : { opacity: [1, 0.25, 1] }}
            transition={{ duration: 1.6, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
          />
          SAR feed · live
        </span>
        <span className="hidden text-muted-foreground sm:inline">Bay of Bothnia · 65°N</span>
      </div>

      {/* Copy */}
      <div className="relative z-30 mx-auto w-full max-w-6xl px-6 pb-16 md:px-8 md:pb-24">
        <div className="max-w-2xl">
          <motion.p
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: reduce ? 0 : 1 }}
            className="inline-flex items-center gap-2 font-mono text-[0.7rem] uppercase tracking-[0.25em] text-brand-strong"
          >
            <HexMarker />
            {hero.eyebrow}
          </motion.p>

          <div className="mt-5">
            <AnimatedHeadline text={hero.headline} />
          </div>

          <motion.p
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduce ? 0 : 0.8, delay: reduce ? 0 : 0.7 }}
            className="mt-6 max-w-lg text-balance text-base leading-relaxed text-zinc-200 md:text-lg"
          >
            {hero.subtext}
          </motion.p>

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduce ? 0 : 0.8, delay: reduce ? 0 : 0.85 }}
            className="mt-8 flex flex-col items-start gap-3 sm:flex-row sm:items-center"
          >
            <a
              href="#contact"
              className={`group inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-[0_10px_30px_-8px_color-mix(in_srgb,var(--brand)_70%,transparent)] transition-transform duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] hover:brightness-110 active:scale-[0.98] ${focusRing}`}
            >
              {hero.primaryCta}
              <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
            </a>
            <a
              href="#solution"
              className={`inline-flex h-11 items-center justify-center rounded-lg border border-white/15 bg-white/[0.06] px-6 text-sm font-medium text-white backdrop-blur transition-colors hover:bg-white/[0.12] active:scale-[0.98] ${focusRing}`}
            >
              {hero.secondaryCta}
            </a>
          </motion.div>

          {/* Live readout chips */}
          <motion.dl
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduce ? 0 : 0.8, delay: reduce ? 0 : 1 }}
            className="mt-10 flex max-w-md items-stretch divide-x divide-white/10 rounded-xl border border-white/10 bg-abyss/40 backdrop-blur"
          >
            {READOUTS.map((r) => (
              <div key={r.label} className="flex-1 px-4 py-3">
                <dt className="font-mono text-[0.6rem] uppercase tracking-[0.18em] text-muted-foreground">
                  {r.label}
                </dt>
                <dd className="mt-1 font-mono text-sm font-medium text-brand-strong tabular-nums">
                  {r.value}
                </dd>
              </div>
            ))}
          </motion.dl>
        </div>
      </div>
    </section>
  );
}
