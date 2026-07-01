import { useState } from "react";
import { motion, useReducedMotion, AnimatePresence } from "framer-motion";
import { Radar, ScanEye, Atom, Route, Navigation } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * The nervous system, made literal.
 *
 * SAR radar enters on the left, signal flows through three processing stages
 * (each a real GlaciaNav model) and out to the bridge. Pulses travel the
 * connectors continuously; selecting a stage opens its detail. This replaces a
 * plain "how it works" accordion with the pipeline itself.
 */

type Stage = {
  icon: typeof Radar;
  label: string;
  sub: string;
  body?: string; // processing stages carry detail
  kind: "io" | "proc";
};

/** connector with a stream of pulses flowing left→right (or top→bottom). */
function Connector({ vertical, delay }: { vertical?: boolean; delay: number }) {
  const reduce = useReducedMotion();
  const pulses = [0, 1, 2];
  return (
    <div
      className={cn(
        "relative shrink-0",
        vertical ? "mx-auto h-8 w-px" : "h-px flex-1"
      )}
    >
      <div className={cn("absolute inset-0", vertical ? "" : "top-1/2 -translate-y-1/2")}>
        <div className={cn("bg-brand/25", vertical ? "mx-auto h-full w-px" : "h-px w-full")} />
      </div>
      {!reduce &&
        pulses.map((p) => (
          <motion.span
            key={p}
            className="absolute size-1.5 rounded-full bg-brand shadow-[0_0_8px_1px_color-mix(in_srgb,var(--brand)_80%,transparent)]"
            style={
              vertical
                ? { left: "50%", marginLeft: -3, top: 0 }
                : { top: "50%", marginTop: -3, left: 0 }
            }
            animate={vertical ? { top: ["0%", "100%"] } : { left: ["0%", "100%"] }}
            transition={{
              duration: 1.8,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
              delay: delay + p * 0.6,
            }}
          />
        ))}
    </div>
  );
}

export function SolutionPipeline({
  stages,
}: {
  stages: Array<Omit<Stage, "icon" | "kind"> & { icon?: never }>;
}) {
  // stages passed as the 3 processing bodies; wrap with fixed I/O nodes.
  const nodes: Stage[] = [
    { icon: Radar, label: "SAR radar", sub: "All-weather input", kind: "io" },
    { icon: ScanEye, label: stages[0].label, sub: stages[0].sub, body: stages[0].body, kind: "proc" },
    { icon: Atom, label: stages[1].label, sub: stages[1].sub, body: stages[1].body, kind: "proc" },
    { icon: Route, label: stages[2].label, sub: stages[2].sub, body: stages[2].body, kind: "proc" },
    { icon: Navigation, label: "Bridge", sub: "Live route + alerts", kind: "io" },
  ];
  const procIndexes = nodes.map((n, i) => (n.kind === "proc" ? i : -1)).filter((i) => i >= 0);
  const [active, setActive] = useState(procIndexes[0]);
  const reduce = useReducedMotion();

  return (
    <div>
      {/* Signal chain */}
      <div className="flex flex-col items-stretch lg:flex-row lg:items-center">
        {nodes.map((node, i) => {
          const isActive = i === active;
          const clickable = node.kind === "proc";
          const Icon = node.icon;
          return (
            <div key={node.label} className="contents">
              <motion.button
                type="button"
                disabled={!clickable}
                onClick={() => clickable && setActive(i)}
                whileHover={reduce || !clickable ? undefined : { y: -3 }}
                className={cn(
                  "group relative flex items-center gap-3 rounded-xl border p-4 text-left transition-colors lg:w-40 lg:flex-col lg:items-start lg:gap-0",
                  node.kind === "io"
                    ? "border-white/10 bg-white/[0.02]"
                    : isActive
                    ? "border-brand/60 bg-brand/[0.08] shadow-[0_0_40px_-16px_var(--brand)]"
                    : "border-white/10 bg-white/[0.03] hover:border-brand/30",
                  clickable ? "cursor-pointer" : "cursor-default"
                )}
              >
                <span
                  className={cn(
                    "flex size-10 shrink-0 items-center justify-center lg:mb-3",
                    node.kind === "io" ? "text-brand/70" : isActive ? "text-brand" : "text-brand/60"
                  )}
                >
                  <span className="absolute inset-0 hidden lg:block">
                    <span
                      className={cn(
                        "absolute left-4 top-4 size-10 hex-clip transition-colors",
                        node.kind === "io"
                          ? "bg-white/[0.04]"
                          : isActive
                          ? "bg-brand/20"
                          : "bg-white/[0.04]"
                      )}
                    />
                  </span>
                  <Icon className="relative size-[18px]" strokeWidth={1.75} />
                </span>
                <span className="lg:mt-0">
                  <span className="block font-heading text-sm font-semibold text-white">
                    {node.label}
                  </span>
                  <span className="mt-0.5 block font-mono text-[0.6rem] uppercase tracking-[0.12em] text-zinc-400">
                    {node.sub}
                  </span>
                </span>
                {clickable ? (
                  <span
                    className={cn(
                      "absolute right-3 top-3 size-1.5 rounded-full transition-colors lg:right-3 lg:top-3",
                      isActive ? "bg-brand" : "bg-white/20"
                    )}
                  />
                ) : null}
              </motion.button>
              {i < nodes.length - 1 ? (
                <>
                  <div className="hidden lg:block lg:flex-1">
                    <Connector delay={i * 0.4} />
                  </div>
                  <div className="lg:hidden">
                    <Connector vertical delay={i * 0.4} />
                  </div>
                </>
              ) : null}
            </div>
          );
        })}
      </div>

      {/* Selected stage detail */}
      <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.02] p-6 md:p-7">
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={reduce ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
          >
            <p className="font-mono text-[0.65rem] uppercase tracking-[0.18em] text-brand">
              Stage {procIndexes.indexOf(active) + 1} / {procIndexes.length} · {nodes[active].label}
            </p>
            <p className="mt-2 max-w-2xl leading-relaxed text-zinc-300">{nodes[active].body}</p>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
