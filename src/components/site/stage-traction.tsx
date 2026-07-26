import { motion, useReducedMotion } from "framer-motion";
import { Check } from "lucide-react";
import { stage, traction } from "@/content";
import { Reveal, Section, SectionHead, Stagger, StaggerItem } from "./reveal";
import { DataLabel } from "./brand";

/**
 * Where we are: an expedition rail. Three legs on one line, the cyan fill
 * drawn exactly as far as the work has actually gone. Each leg is a plate
 * with its status; the active leg carries the mask. Below, the credentials
 * strip: what the program has already proven.
 */

type Tone = "done" | "active" | "next";

function Node({ tone }: { tone: Tone }) {
  return (
    <span
      className={
        tone === "done"
          ? "flex size-8 shrink-0 items-center justify-center border border-ink bg-ink text-paper"
          : tone === "active"
          ? "flex size-8 shrink-0 items-center justify-center border border-ink bg-mask"
          : "flex size-8 shrink-0 items-center justify-center border border-ink/40 bg-plate"
      }
    >
      {tone === "done" ? <Check className="size-4" strokeWidth={2.5} /> : null}
      {tone === "active" ? <span className="size-2 bg-ink" /> : null}
    </span>
  );
}

function StatusChip({ tone, label }: { tone: Tone; label: string }) {
  return (
    <span
      className={`inline-flex w-fit items-center border px-2 py-0.5 font-mono text-[0.6rem] uppercase tracking-[0.12em] ${
        tone === "active"
          ? "border-ink/60 bg-mask text-ink"
          : tone === "done"
          ? "border-ink/40 text-ink"
          : "border-ink/25 text-ink-faint"
      }`}
    >
      {label}
    </span>
  );
}

export function StageTraction() {
  const reduce = useReducedMotion();

  return (
    <Section id="traction" className="relative overflow-hidden">
      <Reveal>
        <SectionHead title={stage.headline} intro={stage.subtext} />
      </Reveal>

      {/* The rail, desktop: one line, filled as far as the work has gone */}
      <div className="mt-14 hidden md:block">
        <div className="grid grid-cols-3 gap-x-8">
          {stage.milestones.map((m, i) => {
            const tone = m.tone as Tone;
            const last = i === stage.milestones.length - 1;
            return (
              <div key={m.title} className="relative">
                {/* rail segment from this node to the next */}
                {!last ? (
                  <span className="absolute left-10 right-[-2rem] top-4 h-px bg-ink/15" aria-hidden="true" />
                ) : null}
                {tone === "done" ? (
                  <motion.span
                    aria-hidden="true"
                    className="absolute left-10 right-[-2rem] top-4 h-[2px] origin-left bg-mask"
                    initial={reduce ? false : { scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true, amount: 0.6 }}
                    transition={{ duration: 0.9, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  />
                ) : null}
                <Node tone={tone} />
                <div className={`mt-5 border-l-2 pl-4 ${tone === "active" ? "border-mask" : "border-ink/10"}`}>
                  <StatusChip tone={tone} label={m.status} />
                  <h3 className="display-condensed mt-2.5 text-2xl font-extrabold text-ink">
                    {m.title}
                  </h3>
                  <p className="mt-2 max-w-xs text-sm leading-relaxed text-ink-soft">{m.body}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* The rail, mobile: vertical */}
      <Stagger className="mt-12 flex flex-col gap-9 md:hidden">
        {stage.milestones.map((m) => {
          const tone = m.tone as Tone;
          return (
            <StaggerItem key={m.title}>
              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <Node tone={tone} />
                  <span className={`mt-1 w-px flex-1 ${tone === "done" ? "bg-mask" : "bg-ink/15"}`} />
                </div>
                <div className="pb-1">
                  <StatusChip tone={tone} label={m.status} />
                  <h3 className="display-condensed mt-2 text-2xl font-extrabold text-ink">{m.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-soft">{m.body}</p>
                </div>
              </div>
            </StaggerItem>
          );
        })}
      </Stagger>

      {/* What we have proven: the credentials strip */}
      <Reveal delay={0.05}>
        <div className="mt-20 border-t-2 border-ink pt-8">
          <p className="display-condensed text-xl font-extrabold text-ink">{traction.headline}</p>
          <div className="mt-6 grid grid-cols-1 gap-y-6 sm:grid-cols-3 sm:divide-x sm:divide-ink/15">
            {traction.items.map((item, i) => (
              <div key={item.kicker} className={i > 0 ? "sm:pl-8" : ""}>
                <DataLabel className="text-mask-ink">{item.kicker}</DataLabel>
                <p className="mt-2 max-w-xs text-sm leading-relaxed text-ink-soft">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
