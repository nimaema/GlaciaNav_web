import { type ReactNode, useEffect, useRef } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * SkewCard: a teal gradient panel sits skewed behind glass content and
 * straightens + brightens on hover. Brand adaptation of the skew-card pattern.
 */
export function SkewCard({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("group relative h-full", className)}>
      {/* Skewed gradient accent + its glow */}
      <span className="absolute inset-y-3 left-6 w-3/5 -skew-x-6 rounded-2xl bg-gradient-to-br from-brand to-brand-strong opacity-90 transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:left-2 group-hover:w-[calc(100%-16px)] group-hover:skew-x-0" />
      <span className="absolute inset-y-3 left-6 w-3/5 -skew-x-6 rounded-2xl bg-gradient-to-br from-brand to-brand-strong opacity-50 blur-2xl transition-all duration-500 group-hover:left-2 group-hover:w-[calc(100%-16px)] group-hover:skew-x-0" />
      {/* Content card */}
      <div className="relative z-10 flex h-full flex-col rounded-2xl border border-border bg-card p-6 shadow-sm transition-all duration-500 group-hover:-translate-y-1 group-hover:shadow-[0_24px_48px_-24px_color-mix(in_srgb,var(--brand-strong)_45%,transparent)]">
        {children}
      </div>
    </div>
  );
}

/**
 * TiltCard: dark premium card with a subtle 3D tilt that tracks the cursor
 * (motion values, no re-render) and a teal glow. For the business model.
 */
export function TiltCard({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const rotateY = useSpring(useTransform(px, [-0.5, 0.5], [7, -7]), {
    stiffness: 200,
    damping: 18,
  });
  const rotateX = useSpring(useTransform(py, [-0.5, 0.5], [-7, 7]), {
    stiffness: 200,
    damping: 18,
  });

  function onMove(e: React.MouseEvent<HTMLDivElement>) {
    if (reduce || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width - 0.5);
    py.set((e.clientY - r.top) / r.height - 0.5);
  }
  function onLeave() {
    px.set(0);
    py.set(0);
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={reduce ? undefined : { rotateX, rotateY, transformPerspective: 1200 }}
      className={cn(
        "group relative overflow-hidden rounded-3xl border border-white/10 bg-[#08171b] p-7 text-white shadow-[0_-8px_60px_-10px_color-mix(in_srgb,var(--brand)_30%,transparent)] md:p-8",
        className
      )}
    >
      {/* Noise + teal glow */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-20 mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='5' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />
      <span className="pointer-events-none absolute -bottom-24 left-1/2 h-64 w-3/4 -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,color-mix(in_srgb,var(--brand)_55%,transparent),transparent_70%)] opacity-70 blur-2xl transition-opacity duration-500 group-hover:opacity-100" />
      <span className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-brand to-transparent" />
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}

/**
 * WaveCanvas: animated teal sine waves on canvas, sized to its parent.
 * Section-background adaptation of the wave visualizer. Reduced-motion safe.
 */
export function WaveCanvas({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let time = 0;
    const waves = Array.from({ length: 7 }).map(() => ({
      value: Math.random() * 0.5 + 0.1,
      target: Math.random() * 0.5 + 0.1,
      speed: Math.random() * 0.02 + 0.01,
    }));

    const parent = canvas.parentElement;
    function resize() {
      if (!canvas || !parent) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = parent.clientWidth * dpr;
      canvas.height = parent.clientHeight * dpr;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function draw() {
      if (!canvas || !parent) return;
      const w = parent.clientWidth;
      const h = parent.clientHeight;
      ctx!.clearRect(0, 0, w, h);
      waves.forEach((wv, i) => {
        if (Math.random() < 0.01) wv.target = Math.random() * 0.7 + 0.1;
        wv.value += (wv.target - wv.value) * wv.speed;
        const freq = wv.value * 7;
        ctx!.beginPath();
        for (let x = 0; x <= w; x += 2) {
          const nx = (x / w) * 2 - 1;
          const pxv = nx + i * 0.04 + freq * 0.03;
          const py = Math.sin(pxv * 10 + time) * Math.cos(pxv * 2) * freq * 0.1 * ((i + 1) / 7);
          const y = ((py + 1) * h) / 2;
          x === 0 ? ctx!.moveTo(x, y) : ctx!.lineTo(x, y);
        }
        const intensity = Math.min(1, freq * 0.3);
        ctx!.lineWidth = 1 + i * 0.25;
        ctx!.strokeStyle = `rgba(6, 171, 186, ${0.10 + intensity * 0.22})`;
        ctx!.stroke();
      });
    }

    resize();
    draw();

    let running = false;
    const animate = () => {
      time += 0.02;
      draw();
      raf = requestAnimationFrame(animate);
    };
    // Only animate while the section is on screen (perf + stable rendering).
    const io = new IntersectionObserver(
      ([entry]) => {
        if (reduce) return;
        if (entry.isIntersecting && !running) {
          running = true;
          animate();
        } else if (!entry.isIntersecting && running) {
          running = false;
          cancelAnimationFrame(raf);
        }
      },
      { threshold: 0 }
    );
    if (parent) io.observe(parent);

    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("resize", resize);
    };
  }, [reduce]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-0 size-full", className)}
    />
  );
}
