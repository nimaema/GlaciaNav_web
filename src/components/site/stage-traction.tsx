import { lazy, Suspense } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Check, Navigation, Dot } from "lucide-react";
import { stage, traction } from "@/content";
import { Reveal, Section, SectionHead, Stagger, StaggerItem } from "./reveal";
import { HexMarker } from "./brand";

// three.js is heavy: load it lazily so it never blocks first paint.
const DottedSurface = lazy(() =>
  import("./dotted-surface").then((m) => ({ default: m.DottedSurface }))
);

type Tone = "done" | "active" | "next";

const toneMeta: Record<Tone, { icon: typeof Check; ring: string; text: string }> = {
  done: { icon: Check, ring: "border-brand bg-brand/15 text-brand", text: "text-brand-strong" },
  active: { icon: Navigation, ring: "border-brand bg-brand/20 text-brand", text: "text-brand-strong" },
  next: { icon: Dot, ring: "border-border bg-abyss text-muted-foreground", text: "text-muted-foreground" },
};

function Waypoint({ tone, last, index }: { tone: Tone; last: boolean; index: number }) {
  const reduce = useReducedMotion();
  const m = toneMeta[tone];
  const Icon = m.icon;
  // Line below a marker is "sailed" (teal) once we're at or past the active leg.
  const sailed = tone === "done";
  return (
    <div className="relative flex flex-col items-center">
      <span className="relative flex size-12 items-center justify-center">
        {tone === "active" && !reduce ? (
          <motion.span
            className="absolute inset-0 hex-clip bg-brand/30"
            animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeOut" }}
          />
        ) : null}
        <span className={`absolute inset-0 hex-clip border ${m.ring}`} />
        <Icon className="relative size-5" strokeWidth={2} />
        <span className="absolute -right-1.5 -top-1.5 font-mono text-[0.55rem] text-brand/70">
          0{index + 1}
        </span>
      </span>
      {!last ? (
        <span className="relative mt-1 w-px flex-1">
          <span className="absolute inset-0 bg-border" />
          <span className={`absolute inset-0 ${sailed ? "bg-brand" : "bg-transparent"}`} />
        </span>
      ) : null}
    </div>
  );
}

export function StageTraction() {
  return (
    <Section id="traction" className="relative overflow-hidden">
      <Suspense fallback={null}>
        <DottedSurface className="[mask-image:radial-gradient(120%_95%_at_70%_20%,#000_20%,transparent_78%)]" />
      </Suspense>

      <div className="relative grid grid-cols-1 gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <Reveal>
          <p className="inline-flex items-center gap-2 font-mono text-[0.7rem] uppercase tracking-[0.24em] text-brand-strong">
            <HexMarker />
            Passage plan
          </p>
          <h2 className="mt-5 font-heading text-3xl font-semibold tracking-tight text-foreground md:text-4xl lg:text-5xl">
            {stage.headline}
          </h2>
          <p className="mt-5 max-w-md text-base leading-relaxed text-muted-foreground md:text-lg">
            {stage.subtext}
          </p>

          {/* current-leg readout */}
          <div className="mt-8 inline-flex items-center gap-3 rounded-xl border border-brand/30 bg-brand/[0.06] px-4 py-3">
            <Navigation className="size-4 text-brand" strokeWidth={2} />
            <span className="font-mono text-[0.7rem] uppercase tracking-[0.14em] text-brand-strong">
              Current leg · MVP build
            </span>
          </div>
        </Reveal>

        {/* The plotted course */}
        <Stagger className="relative">
          {stage.milestones.map((mstone, i) => (
            <StaggerItem key={mstone.title}>
              <div className="grid grid-cols-[3rem_1fr] gap-x-5">
                <Waypoint tone={mstone.tone} last={i === stage.milestones.length - 1} index={i} />
                <div className={`pb-10 ${i === stage.milestones.length - 1 ? "pb-0" : ""}`}>
                  <div className="flex items-center gap-2.5">
                    <h3 className="font-heading text-xl font-semibold text-foreground">
                      {mstone.title}
                    </h3>
                    <span
                      className={`rounded-full border px-2.5 py-0.5 font-mono text-[0.6rem] uppercase tracking-[0.12em] ${
                        mstone.tone === "next"
                          ? "border-border text-muted-foreground"
                          : "border-brand/40 text-brand-strong"
                      }`}
                    >
                      {mstone.status}
                    </span>
                  </div>
                  <p className="mt-2 max-w-lg text-sm leading-relaxed text-muted-foreground">
                    {mstone.body}
                  </p>
                </div>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>

      {/* What we have proven — ship's log of credentials */}
      <div className="relative mt-20">
        <Reveal>
          <SectionHead title={traction.headline} />
        </Reveal>
        <Stagger className="mt-8 grid grid-cols-1 divide-y divide-border border-y border-border md:grid-cols-3 md:divide-x md:divide-y-0">
          {traction.items.map((item) => (
            <StaggerItem key={item.kicker}>
              <div className="group flex h-full flex-col gap-3 p-6 transition-colors hover:bg-card/50">
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
