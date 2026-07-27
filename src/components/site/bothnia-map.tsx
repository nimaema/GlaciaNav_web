import { type ReactNode, useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  ICE_FIELD,
  RAMP_CONCENTRATION,
  RAMP_DRIFT,
  RAMP_THICKNESS,
  type RasterCell,
  fieldPath,
  rasterPaths,
  sample,
  thicknessPaths,
} from "./ice-field";

/**
 * The Bothnian Bay, drawn as a working nautical chart: Swedish coast to the
 * west, Finnish coast to the east, the bay narrowing south toward the Quark.
 * White chart water, tinted land, graticule, ports, neatline. Data layers
 * (ice mask, thickness heat, drift probability) render between the water and
 * the land, so the coastline clips them naturally, like a GIS overlay.
 * `overlay` renders above everything for callouts and markers.
 *
 * ViewBox 0 0 100 120, fitted with `meet` so the geography is never cropped.
 * Simplified but true to shape; the graticule marks the real 65°N / 23°E.
 */

const LAND =
  "M 100,120 L 100,0 L 0,0 L 0,120 L 12,120 " +
  // Swedish coast, south to north: river estuaries cutting a long shore
  "C 16,112 12,104 15,97 C 19,91 14,84 17,77 C 20,71 15,64 18,57 " +
  "C 22,51 16,44 20,38 C 23,32 19,27 22,22 C 23,19 25,17 27,16 " +
  // the head of the bay at Tornio and Kemi, shallow and braided
  "C 32,13 36,18 41,15 C 45,13 48,17 53,14 C 57,12 61,16 66,13 C 69,12 71,14 73,16 " +
  // Finnish coast, north to south: Hailuoto's shoulder, then a steadier run
  "C 77,21 74,26 77,31 C 81,36 75,42 79,48 C 83,54 77,60 81,66 " +
  "C 85,72 79,79 83,85 C 87,91 81,98 85,104 C 88,110 85,115 88,120 Z";

const ISLANDS: Array<[number, number, number]> = [
  [24, 33, 1.1], [28, 29, 0.8], [26, 38, 0.7],   // Luleå archipelago
  [59, 20, 0.8], [53, 22, 0.6],                   // off Kemi
  [74, 57, 1.7], [70, 62, 0.8],                   // Hailuoto, off Oulu
  [21, 66, 0.7], [24, 73, 0.6],                   // Swedish skerries
];

const PORTS: Array<{ x: number; y: number; name: string; side: "left" | "right" | "top" }> = [
  { x: 19, y: 37, name: "Luleå", side: "right" },
  { x: 55, y: 15, name: "Kemi", side: "top" },
  { x: 80, y: 53, name: "Oulu", side: "left" },
];

export function BothniaBase({
  children,
  overlay,
  labels = true,
  className,
}: {
  children?: ReactNode;
  overlay?: ReactNode;
  labels?: boolean;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 100 120"
      preserveAspectRatio="xMidYMid meet"
      className={className ?? "absolute inset-0 size-full"}
      aria-hidden="true"
    >
      {/* chart water: white, so land reads as land and ice as ice */}
      <rect width="100" height="120" fill="#ffffff" />

      {/* graticule */}
      {[20, 40, 60, 80].map((x) => (
        <line key={`v${x}`} x1={x} y1={0} x2={x} y2={120} stroke="rgba(11,36,48,0.07)" strokeWidth="0.25" />
      ))}
      {[20, 40, 60, 80, 100].map((y) => (
        <line key={`h${y}`} x1={0} y1={y} x2={100} y2={y} stroke="rgba(11,36,48,0.07)" strokeWidth="0.25" />
      ))}

      {/* data layers, clipped by the land drawn on top */}
      {children}

      {/* land */}
      <path d={LAND} fill="#aec4d0" stroke="rgba(11,36,48,0.8)" strokeWidth="0.55" strokeLinejoin="round" />
      {ISLANDS.map(([x, y, r], i) => (
        <ellipse key={i} cx={x} cy={y} rx={r} ry={r * 0.7} fill="#aec4d0" stroke="rgba(11,36,48,0.55)" strokeWidth="0.28" />
      ))}

      {/* ports */}
      {PORTS.map((p) => (
        <g key={p.name}>
          <rect x={p.x - 0.9} y={p.y - 0.9} width={1.8} height={1.8} fill="var(--ink)" />
          <text
            x={p.side === "right" ? p.x + 2.2 : p.side === "left" ? p.x - 2.2 : p.x}
            y={p.side === "top" ? p.y - 2.2 : p.y + 0.9}
            textAnchor={p.side === "right" ? "start" : p.side === "left" ? "end" : "middle"}
            fontFamily="var(--font-mono)"
            fontSize="2.6"
            fill="#44616d"
          >
            {p.name}
          </text>
        </g>
      ))}

      {labels ? (
        <>
          <text x={3} y={58} fontFamily="var(--font-mono)" fontSize="2.6" letterSpacing="0.5" fill="#5b7683">
            SWEDEN
          </text>
          <text x={97} y={30} textAnchor="end" fontFamily="var(--font-mono)" fontSize="2.6" letterSpacing="0.5" fill="#5b7683">
            FINLAND
          </text>
          <text x={50} y={92} textAnchor="middle" fontFamily="var(--font-mono)" fontSize="2.9" letterSpacing="0.7" fill="#7d99a5">
            BOTHNIAN BAY
          </text>
          <text x={1.5} y={42.8} fontFamily="var(--font-mono)" fontSize="2.1" fill="#8aa5b0">
            65°N
          </text>
          <text x={56} y={118} fontFamily="var(--font-mono)" fontSize="2.1" fill="#8aa5b0">
            23°E
          </text>
        </>
      ) : null}

      {/* callouts, markers */}
      {overlay}

      {/* neatline */}
      <rect x="0.3" y="0.3" width="99.4" height="119.4" fill="none" stroke="rgba(11,36,48,0.45)" strokeWidth="0.5" />
    </svg>
  );
}

/** Measurement callouts pinned to map coordinates. Steady, no flicker. */
export function Callouts({
  items,
}: {
  items: Array<{ x: number; y: number; label: string }>;
}) {
  const reduce = useReducedMotion();
  return (
    <g>
      {items.map((c, i) => {
        const w = c.label.length * 1.5 + 2.4;
        return (
          <motion.g
            key={c.label}
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: reduce ? 0 : 1.2 + i * 0.25, duration: 0.4 }}
          >
            <rect
              x={c.x}
              y={c.y - 2.6}
              width={w}
              height={3.6}
              fill="var(--plate)"
              stroke="rgba(11,36,48,0.6)"
              strokeWidth="0.25"
            />
            <text
              x={c.x + 1.2}
              y={c.y}
              fontFamily="var(--font-mono)"
              fontSize="2.3"
              fill="var(--ink)"
            >
              {c.label}
            </text>
          </motion.g>
        );
      })}
    </g>
  );
}

/* ------------------------------ Ice extents ----------------------------- */

/**
 * The classified ice. `mode="stale"` is the charted extent from the last
 * issue: every floe drawn where it was, pale and outlined. `mode="live"` is
 * the detected extent now, masked in glacial cyan. `drift` advances the whole
 * field along each floe's own vector, which is how the two come apart.
 */
export function IceMaskLayer({
  mode,
  drift = 0,
  animate = false,
}: {
  mode: "stale" | "live";
  drift?: number;
  animate?: boolean;
}) {
  const reduce = useReducedMotion();
  const live = mode === "live";
  const d = useMemo(() => fieldPath(ICE_FIELD, drift), [drift]);
  return (
    <motion.path
      d={d}
      fillRule="nonzero"
      fill={live ? "var(--mask)" : "var(--strata-1)"}
      fillOpacity={live ? 0.5 : 0.85}
      stroke={live ? "var(--mask-ink)" : "rgba(11,36,48,0.4)"}
      strokeWidth={live ? 0.16 : 0.13}
      strokeLinejoin="round"
      initial={animate && !reduce ? { opacity: 0 } : false}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.35, duration: 0.6 }}
    />
  );
}

/* ------------------------------ Raster layer ----------------------------- */

export type RasterMode = "concentration" | "thickness" | "drift";

const RASTER_SPEC: Record<
  RasterMode,
  { value: (c: RasterCell) => number; max: number; ramp: string[]; floor: number }
> = {
  concentration: { value: (c) => c.c, max: 1, ramp: RAMP_CONCENTRATION, floor: 0.04 },
  thickness: { value: (c) => c.t, max: 2.2, ramp: RAMP_THICKNESS, floor: 0.05 },
  drift: { value: (c) => c.v, max: 20, ramp: RAMP_DRIFT, floor: 0 },
};

/**
 * The gridded product laid over the chart: one cell per patch of sea, coloured
 * by its value, the way a satellite-derived field actually arrives. Grouped
 * into one path per colour step so the whole raster costs nine nodes.
 */
export function RasterLayer({ mode }: { mode: RasterMode }) {
  const reduce = useReducedMotion();
  const spec = RASTER_SPEC[mode];
  const bands = useMemo(
    () => rasterPaths(spec.value, spec.max, spec.ramp, spec.floor),
    [spec]
  );
  return (
    <g>
      {bands.map((b, i) => (
        <motion.path
          key={b.fill}
          d={b.d}
          fill={b.fill}
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: i * 0.045, duration: 0.4 }}
        />
      ))}
    </g>
  );
}

/** Drift arrows sampled off the raster, for the drift layer. */
export function DriftArrows() {
  const reduce = useReducedMotion();
  const vectors = useMemo(() => sample(6, 0.4), []);
  return (
    <g>
      <defs>
        <marker id="ra-head" viewBox="0 0 6 6" refX="5" refY="3" markerWidth="4" markerHeight="4" orient="auto">
          <path d="M 0,0 L 6,3 L 0,6 Z" fill="var(--ink)" fillOpacity="0.75" />
        </marker>
      </defs>
      {vectors.map((f, i) => (
        <motion.line
          key={i}
          x1={f.x}
          y1={f.y}
          x2={f.x + f.dx}
          y2={f.y + f.dy}
          stroke="var(--ink)"
          strokeOpacity={0.7}
          strokeWidth={0.26}
          markerEnd="url(#ra-head)"
          initial={reduce ? false : { pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ delay: 0.4 + (i % 10) * 0.03, duration: 0.5 }}
        />
      ))}
    </g>
  );
}

/* ---------------------------- Thickness heat ---------------------------- */

/**
 * Ice thickness, classified per floe the way an ice chart bins it: every floe
 * carries its own measurement and is drawn in its class colour. Five paths
 * render the whole choropleth.
 */
export function ThicknessLayer() {
  const reduce = useReducedMotion();
  const bins = useMemo(() => thicknessPaths(), []);
  return (
    <g>
      {bins.map((b, i) =>
        b.d ? (
          <motion.path
            key={b.label}
            d={b.d}
            fillRule="nonzero"
            fill={b.tone}
            stroke="rgba(11,36,48,0.28)"
            strokeWidth={0.13}
            strokeLinejoin="round"
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 0.94 }}
            transition={{ delay: 0.1 + i * 0.09, duration: 0.5 }}
          />
        ) : null
      )}
    </g>
  );
}

/* -------------------------- Drift probability --------------------------- */

/**
 * Where the pack goes next. The field today sits under its forecast position
 * six hours on, and a vector on every sampled floe shows how it gets there —
 * a real drift field, not a plume.
 */
export function DriftLayer() {
  const reduce = useReducedMotion();
  const now = useMemo(() => fieldPath(), []);
  const then = useMemo(() => fieldPath(ICE_FIELD, 1), []);
  const vectors = useMemo(() => sample(5, 0.42), []);

  return (
    <g>
      <defs>
        <marker id="dr-head" viewBox="0 0 6 6" refX="5" refY="3" markerWidth="4" markerHeight="4" orient="auto">
          <path d="M 0,0 L 6,3 L 0,6 Z" fill="var(--ink)" fillOpacity="0.7" />
        </marker>
      </defs>

      {/* forecast position: where the pack will be */}
      <motion.path
        d={then}
        fillRule="nonzero"
        fill="var(--mask)"
        fillOpacity={0.34}
        stroke="var(--mask-ink)"
        strokeWidth={0.14}
        strokeDasharray="0.9 0.7"
        strokeLinejoin="round"
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.6 }}
      />

      {/* the pack as observed now */}
      <motion.path
        d={now}
        fillRule="nonzero"
        fill="var(--strata-2)"
        fillOpacity={0.85}
        stroke="rgba(11,36,48,0.34)"
        strokeWidth={0.13}
        strokeLinejoin="round"
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      />

      {/* the field that carries it */}
      {vectors.map((f, i) => (
        <motion.line
          key={i}
          x1={f.x}
          y1={f.y}
          x2={f.x + f.dx}
          y2={f.y + f.dy}
          stroke="var(--ink)"
          strokeOpacity={0.62}
          strokeWidth={0.24}
          markerEnd="url(#dr-head)"
          initial={reduce ? false : { pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ delay: 0.7 + (i % 12) * 0.03, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        />
      ))}
    </g>
  );
}

/* ------------------------------ Swath sweep ----------------------------- */

/** A satellite pass crossing the chart: one clean band, no strobing. */
export function SweepLayer() {
  const reduce = useReducedMotion();
  if (reduce) return null;
  return (
    <g>
      <defs>
        <linearGradient id="sw-band" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%" stopColor="var(--mask)" stopOpacity="0" />
          <stop offset="50%" stopColor="var(--mask)" stopOpacity="0.22" />
          <stop offset="100%" stopColor="var(--mask)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <motion.rect
        y="0"
        width="22"
        height="120"
        fill="url(#sw-band)"
        initial={{ x: -24 }}
        animate={{ x: [-24, 104] }}
        transition={{ duration: 2.4, delay: 1, repeat: Number.POSITIVE_INFINITY, repeatDelay: 7, ease: "linear" }}
      />
    </g>
  );
}

/** Gradient legend strip for the heat layers. */
export function HeatLegend({
  from,
  to,
  gradient,
  className,
}: {
  from: string;
  to: string;
  gradient: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <div className="h-2 w-36 border border-ink/40" style={{ background: gradient }} />
      <div className="mt-1 flex w-36 justify-between font-mono text-[0.56rem] uppercase tracking-[0.08em] text-ink-faint">
        <span>{from}</span>
        <span>{to}</span>
      </div>
    </div>
  );
}
