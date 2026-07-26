import { type CSSProperties, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Floe motif system: the visual grammar of a live ice survey.
 * - SurveyGrid   = pale graticule ruled onto the paper
 * - PlateFrame   = registration corner ticks that frame a "plate" (a figure)
 * - MaskChip     = chartreuse detection swatch; color only where the AI found something
 * - CoreColumn   = ice-core stratigraphy: thickness as vertical strata
 * - DataLabel    = mono survey annotation
 */

/** Pale graticule ruled onto the paper. */
export function SurveyGrid({
  className,
  fade = "radial",
}: {
  className?: string;
  fade?: "radial" | "top" | "none";
}) {
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
          <pattern id="floe-fine" width="32" height="32" patternUnits="userSpaceOnUse">
            <path d="M32 0H0V32" fill="none" stroke="rgba(11,36,48,0.055)" strokeWidth="1" />
          </pattern>
          <pattern id="floe-bold" width="160" height="160" patternUnits="userSpaceOnUse">
            <path d="M160 0H0V160" fill="none" stroke="rgba(11,36,48,0.09)" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#floe-fine)" />
        <rect width="100%" height="100%" fill="url(#floe-bold)" />
      </svg>
    </div>
  );
}

/** Registration corner ticks framing a figure, like crop marks on a survey plate. */
export function PlateFrame({
  className,
  tone = "ink",
}: {
  className?: string;
  tone?: "ink" | "mask";
}) {
  const color = tone === "mask" ? "border-mask" : "border-ink/35";
  return (
    <span aria-hidden="true" className={cn("pointer-events-none absolute inset-0", className)}>
      {[
        "left-0 top-0 border-l-2 border-t-2",
        "right-0 top-0 border-r-2 border-t-2",
        "left-0 bottom-0 border-l-2 border-b-2",
        "right-0 bottom-0 border-r-2 border-b-2",
      ].map((pos) => (
        <span key={pos} className={cn("absolute size-3.5", color, pos)} />
      ))}
    </span>
  );
}

/** Chartreuse detection swatch: a small filled square, the mask made tiny. */
export function MaskChip({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn("inline-block size-2.5 shrink-0 bg-mask outline outline-1 outline-ink/25", className)}
    />
  );
}

/** Mono survey annotation. */
export function DataLabel({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "font-mono text-[0.66rem] uppercase tracking-[0.14em] text-ink-faint",
        className
      )}
    >
      {children}
    </span>
  );
}

/** LinkedIn brand mark (lucide dropped brand icons). Fills with currentColor. */
export function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" />
    </svg>
  );
}

export type Stratum = { t: number; tone: 1 | 2 | 3 | 4 | 5 };

const STRATA_BG: Record<Stratum["tone"], string> = {
  1: "bg-strata-1",
  2: "bg-strata-2",
  3: "bg-strata-3",
  4: "bg-strata-4",
  5: "bg-strata-5",
};

/**
 * Ice-core stratigraphy: a vertical column of layers, thickness proportional
 * to each stratum's `t`. The Floe signature for anything measured in depth.
 */
export function CoreColumn({
  strata,
  className,
  style,
}: {
  strata: Stratum[];
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <div
      aria-hidden="true"
      className={cn("flex flex-col overflow-hidden border border-ink/70", className)}
      style={style}
    >
      {strata.map((s, i) => (
        <div key={i} className={cn("w-full", STRATA_BG[s.tone])} style={{ flexGrow: s.t }} />
      ))}
    </div>
  );
}
