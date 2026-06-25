import { lazy, Suspense } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { stage, traction } from "@/content";
import { Reveal, Section, SectionHead, Stagger, StaggerItem } from "./reveal";
import { Hexagon, HexMarker } from "./brand";

// three.js is heavy: load it lazily so it never blocks first paint.
const DottedSurface = lazy(() =>
  import("./dotted-surface").then((m) => ({ default: m.DottedSurface }))
);

type Tone = "done" | "active" | "next";

const toneStyles: Record<Tone, { fill: string; dot: string; badge: string }> = {
  done: {
    fill: "from-brand-surface to-card",
    dot: "bg-brand-strong",
    badge: "border-brand/40 text-brand-strong",
  },
  active: {
    fill: "from-brand-surface/70 to-card",
    dot: "bg-brand",
    badge: "border-brand/40 text-brand-strong",
  },
  next: {
    fill: "from-secondary/50 to-card",
    dot: "bg-muted-foreground/50",
    badge: "border-border text-muted-foreground",
  },
};

function StatusDot({ tone }: { tone: Tone }) {
  const reduce = useReducedMotion();
  const s = toneStyles[tone];
  return (
    <span className="relative flex size-2.5">
      {tone === "active" && !reduce ? (
        <motion.span
          className="absolute inline-flex size-full rounded-full bg-brand"
          animate={{ scale: [1, 2.4], opacity: [0.6, 0] }}
          transition={{ duration: 1.8, repeat: Number.POSITIVE_INFINITY, ease: "easeOut" }}
        />
      ) : null}
      <span className={`relative inline-flex size-2.5 rounded-full ${s.dot}`} />
    </span>
  );
}

export function StageTraction() {
  return (
    <Section id="traction" className="relative overflow-hidden">
      <Suspense fallback={null}>
        <DottedSurface className="[mask-image:radial-gradient(120%_95%_at_50%_25%,#000_25%,transparent_82%)]" />
      </Suspense>

      <div className="relative">
        {/* Where we are: milestone journey on a dotted sea */}
        <Reveal>
          <SectionHead title={stage.headline} intro={stage.subtext} />
        </Reveal>

        <Stagger className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-3">
          {stage.milestones.map((m) => {
            const s = toneStyles[m.tone];
            return (
              <StaggerItem key={m.title} className="h-full">
                <motion.div
                  whileHover={{ scale: 1.025, y: -4 }}
                  transition={{ type: "spring", stiffness: 300, damping: 22 }}
                  className="h-full"
                >
                  <div
                    className={`group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-gradient-to-br ${s.fill} p-6 shadow-sm transition-shadow duration-300 hover:shadow-[0_24px_48px_-24px_color-mix(in_srgb,var(--brand-strong)_45%,transparent)]`}
                  >
                    <Hexagon
                      variant="outline"
                      strokeWidth={2}
                      className="absolute -right-7 -top-7 size-28 text-brand/10 transition-colors duration-300 group-hover:text-brand/25"
                    />
                    <div className="relative flex items-center gap-2">
                      <StatusDot tone={m.tone} />
                      <span
                        className={`rounded-full border px-2.5 py-0.5 font-mono text-[0.65rem] uppercase tracking-[0.12em] ${s.badge}`}
                      >
                        {m.status}
                      </span>
                    </div>
                    <h3 className="relative mt-5 font-heading text-xl font-semibold text-foreground">
                      {m.title}
                    </h3>
                    <p className="relative mt-2 text-sm leading-relaxed text-muted-foreground">
                      {m.body}
                    </p>
                  </div>
                </motion.div>
              </StaggerItem>
            );
          })}
        </Stagger>

        {/* What we have proven */}
        <Reveal delay={0.05}>
          <h2 className="mt-20 font-heading text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
            {traction.headline}
          </h2>
        </Reveal>
        <Stagger className="mt-6 grid grid-cols-1 gap-3 lg:grid-cols-3">
          {traction.items.map((item) => (
            <StaggerItem key={item.kicker} className="h-full">
              <div className="group flex h-full flex-col gap-3 rounded-xl border border-border bg-card p-5 transition-colors hover:border-brand/40">
                <div className="flex items-center gap-2">
                  <HexMarker />
                  <span className="font-mono text-xs uppercase tracking-[0.14em] text-brand-strong">
                    {item.kicker}
                  </span>
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground">{item.body}</p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </Section>
  );
}
