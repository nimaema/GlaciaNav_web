import { type CSSProperties, type ReactNode, useRef } from "react";
import { cn } from "@/lib/utils";

/**
 * Brand motif system, derived from the GlaciaNav marks:
 * - Hexagon = the favicon waypoint / ice-cell
 * - ChartGrid = nautical chart-plotter graticule
 * - Logo marks used as ambient watermarks
 */

const HEX_POINTS = "50,1 99,29 99,86 50,114 1,86 1,29";

export function Hexagon({
  className,
  variant = "outline",
  strokeWidth = 2,
  style,
}: {
  className?: string;
  variant?: "outline" | "filled";
  strokeWidth?: number;
  style?: CSSProperties;
}) {
  return (
    <svg
      viewBox="0 0 100 115"
      fill="none"
      className={className}
      style={style}
      aria-hidden="true"
    >
      <polygon
        points={HEX_POINTS}
        fill={variant === "filled" ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth={variant === "filled" ? 0 : strokeWidth}
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Small hexagon node used as a section/eyebrow marker. */
export function HexMarker({ className }: { className?: string }) {
  return (
    <span className={cn("relative inline-flex size-3.5 items-center justify-center", className)}>
      <Hexagon variant="outline" strokeWidth={6} className="size-full text-brand" />
      <span className="absolute size-1 rounded-full bg-brand" />
    </span>
  );
}

/** Nautical chart graticule: fine + coarse coordinate grid, optionally masked. */
export function ChartGrid({
  className,
  tone = "ink",
  fade = "radial",
}: {
  className?: string;
  tone?: "ink" | "light";
  fade?: "radial" | "top" | "none";
}) {
  const stroke = tone === "light" ? "rgba(255,255,255,0.16)" : "rgba(2,108,122,0.10)";
  const strokeBold = tone === "light" ? "rgba(255,255,255,0.22)" : "rgba(2,108,122,0.16)";
  const mask =
    fade === "radial"
      ? "radial-gradient(120% 100% at 50% 30%, #000 30%, transparent 78%)"
      : fade === "top"
      ? "linear-gradient(to bottom, #000 0%, transparent 85%)"
      : undefined;

  return (
    <div
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
      style={mask ? { maskImage: mask, WebkitMaskImage: mask } : undefined}
    >
      <svg className="absolute inset-0 size-full" width="100%" height="100%">
        <defs>
          <pattern id={`fine-${tone}`} width="28" height="28" patternUnits="userSpaceOnUse">
            <path d="M28 0H0V28" fill="none" stroke={stroke} strokeWidth="1" />
          </pattern>
          <pattern id={`bold-${tone}`} width="140" height="140" patternUnits="userSpaceOnUse">
            <path d="M140 0H0V140" fill="none" stroke={strokeBold} strokeWidth="1.25" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#fine-${tone})`} />
        <rect width="100%" height="100%" fill={`url(#bold-${tone})`} />
      </svg>
    </div>
  );
}

/** Icon inside a hexagon plate, using the brand mark silhouette. */
export function HexIcon({
  children,
  className,
  tone = "surface",
}: {
  children: ReactNode;
  className?: string;
  tone?: "surface" | "brand" | "glass";
}) {
  const plate =
    tone === "brand"
      ? "bg-brand text-white"
      : tone === "glass"
      ? "bg-white/10 text-brand"
      : "bg-secondary text-brand-strong";
  return (
    <span className={cn("relative inline-flex size-12 items-center justify-center", className)}>
      <span className={cn("absolute inset-0 hex-clip", plate)} aria-hidden="true" />
      <span className="relative inline-flex">{children}</span>
    </span>
  );
}

/** Card with a cursor-following teal spotlight. Updates CSS vars on a ref (no re-render). */
export function SpotlightCard({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const glowRef = useRef<HTMLSpanElement>(null);

  function onMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = glowRef.current;
    if (!el) return;
    const r = e.currentTarget.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
  }

  return (
    <div onMouseMove={onMove} className={cn("group/spot relative overflow-hidden", className)}>
      <span
        ref={glowRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover/spot:opacity-100"
        style={{
          background:
            "radial-gradient(280px circle at var(--mx,50%) var(--my,0%), color-mix(in srgb, var(--brand) 22%, transparent), transparent 72%)",
        }}
      />
      {children}
    </div>
  );
}

/** Large faded brand mark used as an ambient watermark. */
export function MarkWatermark({
  src = "/logo-icon.svg",
  className,
  style,
}: {
  src?: string;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <img
      src={src}
      alt=""
      aria-hidden="true"
      className={cn("pointer-events-none select-none", className)}
      style={style}
    />
  );
}
