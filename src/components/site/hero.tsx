import { useRef } from "react";
import { motion, useReducedMotion, useInView } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { hero } from "@/content";

const focusRing =
  "focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50";

/**
 * Ice-drift currents: flowing radar/chart lines that the forecast reads.
 * Adapted from the BackgroundPaths pattern, recolored to brand teal.
 * `playing` pauses the loop when the hero scrolls out of view (or under
 * reduced motion), keeping the always-on cost off the main thread.
 */
function FloatingPaths({
  position,
  playing,
}: {
  position: number;
  playing: boolean;
}) {
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
                ? {
                    pathLength: 1,
                    opacity: [0.2, 0.45, 0.2],
                    pathOffset: [0, 1, 0],
                  }
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

function AnimatedHeadline({ text }: { text: string }) {
  const reduce = useReducedMotion();
  const words = text.split(" ");

  return (
    <h1 className="font-heading text-[2.6rem] font-semibold leading-[1.05] tracking-tight text-foreground sm:text-6xl md:text-7xl">
      {words.map((word, wordIndex) => (
        <span key={wordIndex} className="mr-[0.25em] inline-block last:mr-0">
          {word.split("").map((letter, letterIndex) => (
            <motion.span
              key={`${wordIndex}-${letterIndex}`}
              className="inline-block"
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
      ))}
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
      {/* Ambient teal wash + drift currents */}
      <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_-10%,_color-mix(in_srgb,_var(--brand)_12%,_transparent)_0%,_transparent_55%)]" />
      <div className="absolute inset-0">
        <FloatingPaths position={1} playing={playing} />
        <FloatingPaths position={-1} playing={playing} />
      </div>
      {/* Fade the currents into the page below */}
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-background" />

      <div className="relative z-10 mx-auto max-w-4xl px-5 pt-24 pb-16 text-center md:px-8">
        <motion.p
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: reduce ? 0 : 1.2 }}
          className="font-mono text-[0.7rem] uppercase tracking-[0.25em] text-brand-strong"
        >
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
            className={`group inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-primary px-6 text-sm font-medium text-primary-foreground shadow-sm transition-transform duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] hover:bg-primary/90 active:scale-[0.98] ${focusRing}`}
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
