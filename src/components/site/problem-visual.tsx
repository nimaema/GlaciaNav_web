import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * The aging chart.
 *
 * What a bridge without GlaciaNav actually sees: a sea-ice chart that was true
 * once and is drifting out of date by the minute. We draw the *charted* ice
 * (dashed, dim, frozen in place) and the *actual* ice (solid, teal) drifting
 * away from it, the gap between them widening as an age clock ticks up. The
 * vessel is committed to a lane the chart says is clear.
 */

const AMBER = "242,166,75";
const TEAL = "120,226,240";

type Cell = {
  x: number; // charted position, normalized
  y: number;
  r: number;
  verts: Array<[number, number]>;
  driftX: number; // per-second drift direction
  driftY: number;
};

function rng(seed: number) {
  return () => {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff;
    return seed / 0x7fffffff;
  };
}

export function AgingChart({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduce = useReducedMotion();
  const [clock, setClock] = useState("00:00:00");
  const [divergence, setDivergence] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const parent = canvas?.parentElement;
    if (!canvas || !parent) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rand = rng(4711);
    const cells: Cell[] = [];
    for (let i = 0; i < 26; i++) {
      const n = 5 + Math.floor(rand() * 3);
      const verts: Array<[number, number]> = [];
      for (let v = 0; v < n; v++) {
        const a = (v / n) * Math.PI * 2 + rand() * 0.5;
        const rr = 0.6 + rand() * 0.5;
        verts.push([Math.cos(a) * rr, Math.sin(a) * rr]);
      }
      const dir = rand() * Math.PI * 2;
      cells.push({
        x: 0.1 + rand() * 0.8,
        y: 0.12 + rand() * 0.76,
        r: 0.02 + rand() * 0.055,
        verts,
        driftX: Math.cos(dir) * 0.012,
        driftY: Math.sin(dir) * 0.012,
      });
    }

    let w = 0;
    let h = 0;
    function resize() {
      if (!canvas || !parent || !ctx) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = parent.clientWidth;
      h = parent.clientHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    const S = () => Math.min(w, h);

    function poly(cx: number, cy: number, c: Cell, s: number) {
      if (!ctx) return;
      ctx.beginPath();
      c.verts.forEach(([ox, oy], i) => {
        const x = cx + ox * s;
        const y = cy + oy * s;
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      });
      ctx.closePath();
    }

    function frame(age: number) {
      if (!ctx) return;
      ctx.clearRect(0, 0, w, h);
      // gap grows with age, capped so it stays legible
      const drift = Math.min(age * 0.9, 0.16);
      let totalGap = 0;

      for (const c of cells) {
        const s = c.r * S();
        const cxC = c.x * w;
        const cyC = c.y * h;
        // charted (stale) — dashed, dim, in place
        ctx.setLineDash([3, 3]);
        ctx.lineWidth = 1;
        ctx.strokeStyle = `rgba(${TEAL},0.16)`;
        poly(cxC, cyC, c, s);
        ctx.stroke();
        ctx.setLineDash([]);

        // actual — solid, drifted
        const ax = (c.x + c.driftX * drift * 8) * w;
        const ay = (c.y + c.driftY * drift * 8) * h;
        ctx.lineWidth = 1.25;
        ctx.strokeStyle = `rgba(${TEAL},0.6)`;
        ctx.fillStyle = `rgba(${TEAL},0.06)`;
        poly(ax, ay, c, s);
        ctx.fill();
        ctx.stroke();

        // drift vector between them
        const dx = ax - cxC;
        const dy = ay - cyC;
        const dist = Math.hypot(dx, dy);
        totalGap += dist;
        if (dist > 6) {
          ctx.strokeStyle = `rgba(${AMBER},0.35)`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(cxC, cyC);
          ctx.lineTo(ax, ay);
          ctx.stroke();
        }
      }

      // committed lane the chart says is clear
      ctx.strokeStyle = `rgba(${AMBER},0.7)`;
      ctx.lineWidth = 1.5;
      ctx.setLineDash([6, 5]);
      ctx.beginPath();
      ctx.moveTo(w * 0.08, h * 0.9);
      ctx.lineTo(w * 0.92, h * 0.16);
      ctx.stroke();
      ctx.setLineDash([]);

      return totalGap / cells.length;
    }

    resize();

    let raf = 0;
    let running = false;
    let start = -1;
    let lastTick = 0;

    function loop(now: number) {
      if (start < 0) start = now;
      // 1 real second ≈ 40 charted-minutes, looping every ~24h charted
      const elapsed = (now - start) / 1000;
      const chartMinutes = (elapsed * 40) % (24 * 60);
      const age = chartMinutes / (24 * 60); // 0..1 across a 24h chart
      const gap = frame(age) ?? 0;

      if (now - lastTick > 120) {
        lastTick = now;
        const hh = String(Math.floor(chartMinutes / 60)).padStart(2, "0");
        const mm = String(Math.floor(chartMinutes % 60)).padStart(2, "0");
        const ss = String(Math.floor((chartMinutes * 60) % 60)).padStart(2, "0");
        setClock(`${hh}:${mm}:${ss}`);
        setDivergence(Math.round((gap / S()) * 240));
      }
      raf = requestAnimationFrame(loop);
    }

    if (reduce) {
      frame(0.5);
      setClock("12:00:00");
      setDivergence(30);
    } else {
      const io = new IntersectionObserver(
        ([e]) => {
          if (e.isIntersecting && !running) {
            running = true;
            raf = requestAnimationFrame(loop);
          } else if (!e.isIntersecting && running) {
            running = false;
            cancelAnimationFrame(raf);
          }
        },
        { threshold: 0 }
      );
      io.observe(parent);
      const onR = () => {
        resize();
        if (!running) frame(0.5);
      };
      window.addEventListener("resize", onR);
      return () => {
        cancelAnimationFrame(raf);
        io.disconnect();
        window.removeEventListener("resize", onR);
      };
    }

    const onR = () => {
      resize();
      frame(0.5);
    };
    window.addEventListener("resize", onR);
    return () => window.removeEventListener("resize", onR);
  }, [reduce]);

  return (
    <div className={cn("relative overflow-hidden rounded-2xl border border-border bg-abyss", className)}>
      <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0 size-full" />
      {/* legend + live age readout */}
      <div className="pointer-events-none absolute inset-0 p-4 font-mono text-[0.6rem] uppercase tracking-[0.16em]">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Sea-ice chart</span>
          <span className="inline-flex items-center gap-1.5 text-signal">
            <span className="size-1.5 rounded-full bg-signal" />
            Age +{clock}
          </span>
        </div>
        <div className="absolute inset-x-4 bottom-4 flex items-end justify-between">
          <div className="flex flex-col gap-1.5 normal-case tracking-normal">
            <span className="inline-flex items-center gap-1.5 text-[0.58rem] text-muted-foreground">
              <span className="inline-block h-px w-4 border-t border-dashed border-brand-strong/50" />
              Charted
            </span>
            <span className="inline-flex items-center gap-1.5 text-[0.58rem] text-brand-strong">
              <span className="inline-block h-px w-4 border-t border-brand-strong" />
              Actual ice
            </span>
          </div>
          <span className="text-signal">Divergence {divergence}%</span>
        </div>
      </div>
    </div>
  );
}
