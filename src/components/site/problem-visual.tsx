import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import { DataLabel } from "./brand";
import { BothniaBase, Callouts, IceMaskLayer } from "./bothnia-map";

/**
 * The comparison chart: yesterday's official ice chart against the live
 * survey, on the same Bothnian Bay. Left of the divider the ice sits where it
 * was charted 24 hours ago, pale and dashed. Right of it, the same ice where
 * it actually is now, detected and measured. Drag the divider or use the
 * arrow keys.
 */

const MEASUREMENTS = [
  { x: 45, y: 27, label: "0.4 m" },
  { x: 55, y: 53, label: "0.9 m" },
  { x: 63, y: 42, label: "1.2 m" },
];

export function ChartComparison({ className }: { className?: string }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const [pct, setPct] = useState(50);
  const [touched, setTouched] = useState(false);

  // Until the user grabs it, the divider patrols gently so both worlds show.
  useEffect(() => {
    if (reduce || touched) return;
    let raf = 0;
    let start: number | null = null;
    const loop = (now: number) => {
      if (start === null) start = now;
      const t = (now - start) / 1000;
      setPct(50 + Math.sin(t * 0.4) * 24);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [reduce, touched]);

  function setFromClient(clientX: number) {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setPct(Math.min(96, Math.max(4, ((clientX - r.left) / r.width) * 100)));
  }

  return (
    <div className={cn("select-none", className)}>
      <div
        ref={ref}
        className="relative aspect-[5/5.6] w-full touch-none overflow-hidden rounded-lg border border-ink/70 bg-plate"
        onPointerDown={(e) => {
          setTouched(true);
          e.currentTarget.setPointerCapture(e.pointerId);
          setFromClient(e.clientX);
        }}
        onPointerMove={(e) => {
          if (e.buttons > 0) setFromClient(e.clientX);
        }}
      >
        {/* Live survey: the ice where it actually is, measured */}
        <BothniaBase overlay={<Callouts items={MEASUREMENTS} />}>
          <IceMaskLayer mode="live" dx={3.5} dy={5.5} />
        </BothniaBase>

        {/* Yesterday's chart, clipped to the left of the divider */}
        <div className="absolute inset-0 bg-plate" style={{ clipPath: `inset(0 ${100 - pct}% 0 0)` }}>
          <BothniaBase>
            <IceMaskLayer mode="stale" />
          </BothniaBase>
        </div>

        {/* Divider + handle */}
        <div aria-hidden="true" className="absolute inset-y-0 w-0.5 -translate-x-1/2 bg-ink" style={{ left: `${pct}%` }} />
        <button
          type="button"
          role="slider"
          aria-label="Compare the 24 hour old chart with the live survey"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(pct)}
          onKeyDown={(e) => {
            if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
              e.preventDefault();
              setTouched(true);
              setPct((p) => Math.min(96, Math.max(4, p + (e.key === "ArrowLeft" ? -4 : 4))));
            }
          }}
          className="absolute top-1/2 flex size-9 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize items-center justify-center rounded-full border border-ink bg-plate font-mono text-[0.6rem] font-bold text-ink shadow-[0_4px_16px_-4px_rgba(11,36,48,0.4)] focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
          style={{ left: `${pct}%` }}
        >
          {"<>"}
        </button>

        {/* Layer captions */}
        <span className="pointer-events-none absolute left-3 top-3 z-10 border border-ink/40 bg-plate/95 px-1.5 py-0.5 font-mono text-[0.6rem] uppercase tracking-[0.1em] text-ink-soft">
          Chart · issued 24 h ago
        </span>
        <span className="pointer-events-none absolute right-3 top-3 border border-mask-ink/50 bg-plate/95 px-1.5 py-0.5 font-mono text-[0.6rem] uppercase tracking-[0.1em] text-mask-ink">
          GlaciaNav · live
        </span>
      </div>
      <div className="mt-2.5 flex items-center justify-between">
        <DataLabel>Same bay, same hour</DataLabel>
        <DataLabel>Drag to compare</DataLabel>
      </div>
    </div>
  );
}
