import { useRef } from "react";
import { motion, useReducedMotion, useInView } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { hero } from "@/content";
import { ChartGrid, Hexagon, HexMarker, MarkWatermark } from "./brand";
import { Parallax } from "./reveal";

const focusRing =
  "focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50";

/**
 * Ice-drift currents: flowing radar/chart lines that the forecast reads.
 * `playing` pauses the loop when the hero leaves the viewport / under reduced motion.
 */
function FloatingPaths({ position, playing }: { position: number; playing: boolean }) {
  const paths = Array.from({ length: 36 }, (_, i) => ({
    id: i,
    d: `M-${380 - i * 5 * position} -${189 + i * 6}C-${
      380 - i * 5 * position
    } -${189 + i * 6} -${312 - i * 5 * position} ${216 - i * 6} ${
      152 - i * 5 * position
    } ${343 - i * 6}C${616 - i * 5 * position} ${470 - i * 6} ${
      684 - i * 5 * position
    } ${875 - i * 6} ${684 - i * 5 * position} ${875 - i * 6}`,
    width: 0.5 + i * 0.04,
  }));

  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden="true">
      <svg
        className="h-full w-full text-brand"
        viewBox="0 0 696 316"
        fill="none"
        preserveAspectRatio="xMidYMid slice"
      >
        {paths.map((path) => (
          <motion.path
            key={path.id}
            d={path.d}
            stroke="currentColor"
            strokeWidth={path.width}
            strokeOpacity={0.06 + path.id * 0.025}
            initial={{ pathLength: 0.3, opacity: 0.5 }}
            animate={
              playing
                ? { pathLength: 1, opacity: [0.2, 0.45, 0.2], pathOffset: [0, 1, 0] }
                : { pathLength: 1, opacity: 0.4 }
            }
            transition={
              playing
                ? {
                    duration: 22 + (path.id % 8) * 3,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "linear",
                  }
                : { duration: 0 }
            }
          />
        ))}
      </svg>
    </div>
  );
}

/** Concentric rotating hexagons: a navigation scope behind the headline. */
function NavScope({ playing }: { playing: boolean }) {
  const rings = [
    { size: 620, dur: 90, dir: 1, op: "text-brand/[0.06]", sw: 1 },
    { size: 440, dur: 64, dir: -1, op: "text-brand/[0.09]", sw: 1.5 },
    { size: 280, dur: 48, dir: 1, op: "text-brand/[0.12]", sw: 2 },
  ];
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
    >
      {rings.map((r) => (
        <motion.div
          key={r.size}
          className="absolute left-1/2 top-1/2"
          style={{ width: r.size, height: r.size * 1.15, x: "-50%", y: "-50%" }}
          animate={playing ? { rotate: r.dir * 360 } : { rotate: 0 }}
          transition={
            playing
              ? { duration: r.dur, repeat: Number.POSITIVE_INFINITY, ease: "linear" }
              : { duration: 0 }
          }
        >
          <Hexagon variant="outline" strokeWidth={r.sw} className={`size-full ${r.op}`} />
        </motion.div>
      ))}
    </div>
  );
}

function AnimatedHeadline({ text }: { text: string }) {
  const reduce = useReducedMotion();
  const words = text.split(" ");

  return (
    <h1 className="font-heading text-[2.7rem] font-semibold leading-[1.04] tracking-tight text-foreground sm:text-6xl md:text-7xl">
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
                  delay: reduce ? 0 : wordIndex * 0.08 + letterIndex * 0.025,
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

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const inView = useInView(ref, { amount: 0.1 });
  const playing = inView && !reduce;

  return (
    <section
      ref={ref}
      className="relative flex min-h-[100dvh] w-full items-center justify-center overflow-hidden"
    >
      {/* Layered background: wash, chart grid, scope, currents, vessel watermark */}
      <div className="absolute inset-0 bg-[radial-gradient(125%_95%_at_50%_-5%,_color-mix(in_srgb,_var(--brand)_14%,_transparent)_0%,_transparent_58%)]" />
      <ChartGrid tone="ink" fade="radial" className="opacity-70" />
      <NavScope playing={playing} />
      <div className="absolute inset-0">
        <FloatingPaths position={1} playing={playing} />
        <FloatingPaths position={-1} playing={playing} />
      </div>
      <Parallax
        distance={50}
        className="pointer-events-none absolute -right-16 top-1/2 hidden -translate-y-1/2 md:block lg:-right-4"
      >
        <MarkWatermark src="/logo-icon.svg" className="w-[26rem] opacity-[0.05] lg:w-[32rem]" />
      </Parallax>
      <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-b from-transparent to-background" />

      <div className="relative z-10 mx-auto max-w-4xl px-5 pt-24 pb-16 text-center md:px-8">
        <motion.p
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: reduce ? 0 : 1.2 }}
          className="inline-flex items-center gap-2 font-mono text-[0.7rem] uppercase tracking-[0.25em] text-brand-strong"
        >
          <HexMarker />
          {hero.eyebrow}
        </motion.p>

        <div className="mt-6">
          <AnimatedHeadline text={hero.headline} />
        </div>

        <motion.p
          initial={reduce ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduce ? 0 : 0.8, delay: reduce ? 0 : 0.5 }}
          className="mx-auto mt-6 max-w-xl text-balance text-base leading-relaxed text-muted-foreground md:text-lg"
        >
          {hero.subtext}
        </motion.p>

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduce ? 0 : 0.8, delay: reduce ? 0 : 0.7 }}
          className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row"
        >
          <a
            href="#contact"
            className={`group inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-primary px-6 text-sm font-medium text-primary-foreground shadow-[0_8px_24px_-8px_color-mix(in_srgb,_var(--brand)_60%,_transparent)] transition-transform duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] hover:bg-primary/90 active:scale-[0.98] ${focusRing}`}
          >
            {hero.primaryCta}
            <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
          </a>
          <a
            href="#solution"
            className={`inline-flex h-11 items-center justify-center rounded-lg border border-border bg-card/70 px-6 text-sm font-medium text-foreground backdrop-blur transition-colors hover:bg-accent active:scale-[0.98] ${focusRing}`}
          >
            {hero.secondaryCta}
          </a>
        </motion.div>
      </div>
    </section>
  );
}
