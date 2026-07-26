import { type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";

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
  "M 100,120 L 100,0 L 0,0 L 0,120 L 20,120 " +
  // Swedish coast, south to north: long gentle curves, occasional headland
  "C 24,111 20,102 25,95 C 29,89 24,81 27,75 C 30,69 26,61 30,55 " +
  "C 34,50 28,42 32,36 C 35,31 30,25 34,20 " +
  // the north coast around Kemi and Tornio
  "C 40,14 45,20 51,14 C 56,9 62,17 69,12 " +
  // Finnish coast, north to south: the bay widening past Oulu
  "C 74,16 71,24 75,30 C 79,36 73,44 77,50 C 81,56 75,64 79,70 " +
  "C 83,76 77,84 81,90 C 85,96 79,104 83,110 C 85,114 82,117 84,120 Z";

const ISLANDS: Array<[number, number, number]> = [
  [33, 33, 1.0], [36, 30, 0.7], [34, 37, 0.6],   // Luleå archipelago
  [60, 19, 0.7], [55, 21, 0.5],                   // off Kemi
  [70, 58, 1.5], [67, 62, 0.7],                   // Hailuoto, off Oulu
  [30, 64, 0.6], [32, 70, 0.5],                   // Swedish skerries
];

const PORTS: Array<{ x: number; y: number; name: string; side: "left" | "right" | "top" }> = [
  { x: 29, y: 36, name: "Luleå", side: "right" },
  { x: 56, y: 16, name: "Kemi", side: "top" },
  { x: 76, y: 53, name: "Oulu", side: "left" },
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
      {/* chart water */}
      <rect width="100" height="120" fill="var(--plate)" />

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
      <path d={LAND} fill="#dde7ec" stroke="rgba(11,36,48,0.6)" strokeWidth="0.4" strokeLinejoin="round" />
      {ISLANDS.map(([x, y, r], i) => (
        <ellipse key={i} cx={x} cy={y} rx={r} ry={r * 0.7} fill="#dde7ec" stroke="rgba(11,36,48,0.55)" strokeWidth="0.28" />
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
          <text x={4} y={56} fontFamily="var(--font-mono)" fontSize="2.6" letterSpacing="0.5" fill="#6c8894">
            SWEDEN
          </text>
          <text x={97} y={34} textAnchor="end" fontFamily="var(--font-mono)" fontSize="2.6" letterSpacing="0.5" fill="#6c8894">
            FINLAND
          </text>
          <text x={51} y={78} textAnchor="middle" fontFamily="var(--font-mono)" fontSize="2.9" letterSpacing="0.7" fill="#8aa5b0">
            BOTHNIAN BAY
          </text>
          <text x={2} y={42.8} fontFamily="var(--font-mono)" fontSize="2.1" fill="#8aa5b0">
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

/** Ice geometry as smooth closed paths: landfast belts plus the central pack. */
export const ICE_SHAPES = [
  // landfast belt along the north coast
  "M 34,21 Q 39,16 45,18 Q 50,13 56,16 Q 62,11 68,14 Q 72,16 71,21 Q 66,25 60,23 Q 54,27 48,25 Q 42,28 37,26 Q 33,25 34,21 Z",
  // belt along the Finnish coast
  "M 73,29 Q 77,34 74,39 Q 78,45 75,50 Q 79,56 76,61 Q 72,58 74,52 Q 70,47 73,42 Q 69,36 73,29 Z",
  // the central drift pack
  "M 40,41 Q 45,36 51,39 Q 57,35 61,40 Q 64,45 60,49 Q 62,54 56,56 Q 50,60 44,56 Q 38,53 41,48 Q 37,45 40,41 Z",
];

/** Shift every "x,y" coordinate pair in a path or points string. */
function shiftPoints(shape: string, dx: number, dy: number) {
  return shape
    .split(" ")
    .map((token) => {
      if (!/^-?[\d.]+,-?[\d.]+$/.test(token)) return token;
      const [x, y] = token.split(",").map(Number);
      return `${(x + dx).toFixed(1)},${(y + dy).toFixed(1)}`;
    })
    .join(" ");
}

/**
 * The classified ice, as the chart shows it. `mode="stale"` draws yesterday's
 * charted extent (pale, dashed); `mode="live"` draws the detected extent,
 * masked in glacial cyan, optionally drifted by (dx, dy).
 */
export function IceMaskLayer({
  mode,
  dx = 0,
  dy = 0,
  animate = false,
}: {
  mode: "stale" | "live";
  dx?: number;
  dy?: number;
  animate?: boolean;
}) {
  const reduce = useReducedMotion();
  const live = mode === "live";
  return (
    <g>
      {ICE_SHAPES.map((d, i) => (
        <motion.path
          key={i}
          d={shiftPoints(d, dx, dy)}
          fill={live ? "var(--mask)" : "var(--strata-1)"}
          fillOpacity={live ? 0.55 : 0.9}
          stroke={live ? "var(--mask-ink)" : "rgba(11,36,48,0.45)"}
          strokeWidth={live ? 0.45 : 0.35}
          strokeDasharray={live ? undefined : "1.4 1.1"}
          strokeLinejoin="round"
          initial={animate && !reduce ? { opacity: 0 } : false}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 + i * 0.3, duration: 0.5 }}
        />
      ))}
    </g>
  );
}

/* ---------------------------- Thickness heat ---------------------------- */

const HEAT_CELLS: Array<{ cx: number; cy: number; rx: number; ry: number; deep: boolean }> = [
  { cx: 52, cy: 25, rx: 24, ry: 14, deep: true },
  { cx: 38, cy: 40, rx: 14, ry: 11, deep: false },
  { cx: 66, cy: 38, rx: 13, ry: 11, deep: false },
  { cx: 48, cy: 54, rx: 15, ry: 11, deep: false },
  { cx: 60, cy: 20, rx: 11, ry: 8, deep: true },
];

/** Ice thickness as a continuous heat field: pale cyan thin → deep navy thick. */
export function ThicknessLayer() {
  const reduce = useReducedMotion();
  return (
    <g>
      <defs>
        <radialGradient id="th-deep">
          <stop offset="0%" stopColor="var(--strata-5)" stopOpacity="0.9" />
          <stop offset="55%" stopColor="var(--strata-4)" stopOpacity="0.6" />
          <stop offset="100%" stopColor="var(--strata-2)" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="th-mid">
          <stop offset="0%" stopColor="var(--strata-4)" stopOpacity="0.7" />
          <stop offset="60%" stopColor="var(--strata-3)" stopOpacity="0.45" />
          <stop offset="100%" stopColor="var(--strata-2)" stopOpacity="0" />
        </radialGradient>
      </defs>
      {/* thin-ice base wash across the whole bay */}
      <motion.rect
        x="0" y="0" width="100" height="120"
        fill="var(--strata-2)" opacity="0.35"
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: 0.35 }}
        transition={{ duration: 0.6 }}
      />
      {HEAT_CELLS.map((c, i) => (
        <motion.ellipse
          key={i}
          cx={c.cx}
          cy={c.cy}
          rx={c.rx}
          ry={c.ry}
          fill={`url(#${c.deep ? "th-deep" : "th-mid"})`}
          initial={reduce ? false : { opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 + i * 0.12, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          style={{ transformOrigin: `${c.cx}px ${c.cy}px` }}
        />
      ))}
    </g>
  );
}

/* -------------------------- Drift probability --------------------------- */

const DRIFT_BLOBS: Array<{ cx: number; cy: number; rx: number; ry: number; o: number }> = [
  { cx: 49, cy: 52, rx: 11, ry: 8, o: 0.75 },
  { cx: 46, cy: 64, rx: 13, ry: 10, o: 0.5 },
  { cx: 43, cy: 78, rx: 15, ry: 12, o: 0.3 },
  { cx: 40, cy: 92, rx: 16, ry: 13, o: 0.15 },
];

const DRIFT_ARROWS = [
  "M 50,46 C 48,56 46,64 43,74",
  "M 57,48 C 55,58 52,68 49,80",
  "M 43,44 C 41,54 39,62 36,72",
];

/**
 * Where the pack goes next: a probability plume running south with the
 * current, brightest where arrival is most likely, fading with uncertainty.
 */
export function DriftLayer() {
  const reduce = useReducedMotion();
  return (
    <g>
      <defs>
        <radialGradient id="dr-blob">
          <stop offset="0%" stopColor="var(--mask)" stopOpacity="0.8" />
          <stop offset="100%" stopColor="var(--mask)" stopOpacity="0" />
        </radialGradient>
        <marker id="dr-head" viewBox="0 0 6 6" refX="4" refY="3" markerWidth="5" markerHeight="5" orient="auto">
          <path d="M 0,0 L 6,3 L 0,6 Z" fill="var(--ink)" />
        </marker>
      </defs>
      {DRIFT_BLOBS.map((b, i) => (
        <motion.ellipse
          key={i}
          cx={b.cx}
          cy={b.cy}
          rx={b.rx}
          ry={b.ry}
          fill="url(#dr-blob)"
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: b.o }}
          transition={{ delay: 0.3 + i * 0.2, duration: 0.8 }}
        />
      ))}
      {/* the pack today */}
      <path
        d={ICE_SHAPES[2]}
        fill="var(--mask)"
        fillOpacity="0.5"
        stroke="var(--mask-ink)"
        strokeWidth="0.45"
        strokeLinejoin="round"
      />
      {DRIFT_ARROWS.map((d, i) => (
        <motion.path
          key={i}
          d={d}
          fill="none"
          stroke="var(--ink)"
          strokeWidth="0.5"
          strokeDasharray="2 1.6"
          markerEnd="url(#dr-head)"
          initial={reduce ? false : { pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: 0.5 + i * 0.25, duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
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
