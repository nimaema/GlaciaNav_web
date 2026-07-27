import { motion, useReducedMotion } from "framer-motion";

/**
 * North-polar coverage chart.
 *
 * A real azimuthal plot looking down on the pole: latitude as radius, longitude
 * as bearing. The three go-to-market horizons are drawn as the sectors they
 * actually occupy, so expansion reads as ground covered rather than as
 * decoration. No coastlines are drawn — this is a coordinate chart, not a map,
 * and it does not pretend otherwise.
 */

const C = 180; // centre of the 360 x 360 field
const K = 4.22; // px per degree of latitude below the pole (54°N lands at r=152)
const EDGE = 54; // southern limit of the chart: the foot of the Baltic

const r = (lat: number) => (90 - lat) * K;
const pt = (lat: number, lon: number) => {
  const a = (lon * Math.PI) / 180;
  return [C + r(lat) * Math.sin(a), C - r(lat) * Math.cos(a)] as const;
};

/** Annulus wedge between two latitudes and two longitudes. */
function wedge(lat0: number, lat1: number, lon0: number, lon1: number) {
  const [ox0, oy0] = pt(lat0, lon0);
  const [ox1, oy1] = pt(lat0, lon1);
  const [ix1, iy1] = pt(lat1, lon1);
  const [ix0, iy0] = pt(lat1, lon0);
  const large = Math.abs(lon1 - lon0) > 180 ? 1 : 0;
  return [
    `M${ox0} ${oy0}`,
    `A${r(lat0)} ${r(lat0)} 0 ${large} 1 ${ox1} ${oy1}`,
    `L${ix1} ${iy1}`,
    `A${r(lat1)} ${r(lat1)} 0 ${large} 0 ${ix0} ${iy0}`,
    "Z",
  ].join(" ");
}

/** The real extents of each horizon. */
export const ZONES = [
  { lat: [54, 66], lon: [10, 30], label: "Baltic" },
  { lat: [66, 79], lon: [-22, 20], label: "Norwegian · Greenland" },
  { lat: [68, 79], lon: [30, 172], label: "Northeast Passage" },
] as const;

/** `side` is set per place so long names always fall into open chart space. */
const PLACES = [
  { lat: 64.5, lon: 22, name: "Bothnian Bay", side: "right" },
  { lat: 69, lon: 4, name: "Norwegian Sea", side: "left" },
  { lat: 76, lon: -8, name: "Greenland Sea", side: "left" },
  { lat: 72, lon: 122, name: "Northeast Passage", side: "left" },
] as const;

const LATS = [80, 70, 60];
const MERIDIANS = [0, 30, 60, 90, 120, 150, 180, -150, -120, -90, -60, -30];

export function ArcticChart({ active }: { active: number }) {
  const reduce = useReducedMotion();

  return (
    <svg viewBox="0 0 360 360" className="h-full w-full" aria-hidden="true">
      <rect width="360" height="360" fill="var(--plate)" />
      {/* the water the chart covers */}
      <circle cx={C} cy={C} r={r(EDGE)} fill="var(--strata-1)" fillOpacity="0.5" />

      {/* meridians */}
      {MERIDIANS.map((lon) => {
        const [x, y] = pt(EDGE, lon);
        return (
          <line
            key={lon}
            x1={C}
            y1={C}
            x2={x}
            y2={y}
            stroke="rgba(11,36,48,0.09)"
            strokeWidth="1"
          />
        );
      })}

      {/* parallels, and the chart's southern limit */}
      {LATS.map((lat) => (
        <circle
          key={lat}
          cx={C}
          cy={C}
          r={r(lat)}
          fill="none"
          stroke="rgba(11,36,48,0.13)"
          strokeWidth="1"
        />
      ))}
      <circle
        cx={C}
        cy={C}
        r={r(EDGE)}
        fill="none"
        stroke="rgba(11,36,48,0.22)"
        strokeWidth="1"
        strokeDasharray="4 4"
      />
      {LATS.map((lat) => (
        <text
          key={`l-${lat}`}
          x={C + 4}
          y={C - r(lat) + 11}
          fontFamily="var(--font-mono)"
          fontSize="8.5"
          fill="#8aa5b0"
        >
          {lat}°N
        </text>
      ))}

      {/* horizons, drawn where they actually are */}
      {ZONES.map((z, i) => {
        const on = i <= active;
        const focused = i === active;
        return (
          <motion.path
            key={z.label}
            d={wedge(z.lat[0], z.lat[1], z.lon[0], z.lon[1])}
            fill={focused ? "var(--mask)" : "var(--strata-3)"}
            stroke={focused ? "var(--mask-ink)" : "var(--strata-4)"}
            strokeWidth={focused ? 1.6 : 1}
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: on ? (focused ? 0.55 : 0.22) : 0.07 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          />
        );
      })}

      {/* the pole */}
      <circle cx={C} cy={C} r="2.5" fill="var(--ink)" />
      <text
        x={C + 6}
        y={C + 3}
        fontFamily="var(--font-mono)"
        fontSize="8.5"
        fill="var(--ink-faint)"
      >
        90°N
      </text>

      {/* named waters */}
      {PLACES.map((p, i) => {
        const [x, y] = pt(p.lat, p.lon);
        const east = p.side === "right";
        return (
          <motion.g
            key={p.name}
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 + i * 0.08, duration: 0.4 }}
          >
            <rect x={x - 2} y={y - 2} width="4" height="4" fill="var(--ink)" />
            <text
              x={east ? x + 11 : x - 6}
              y={y + 3}
              textAnchor={east ? "start" : "end"}
              fontFamily="var(--font-mono)"
              fontSize="9"
              fill="var(--ink-soft)"
            >
              {p.name}
            </text>
          </motion.g>
        );
      })}

      {/* the beachhead */}
      {(() => {
        const [x, y] = pt(64.5, 22);
        return (
          <g>
            <circle cx={x} cy={y} r="7" fill="none" stroke="var(--mask-ink)" strokeWidth="1.6" />
            {!reduce ? (
              <motion.circle
                cx={x}
                cy={y}
                r="7"
                fill="none"
                stroke="var(--mask-ink)"
                strokeWidth="1.2"
                animate={{ scale: [1, 2.3], opacity: [0.6, 0] }}
                transition={{ duration: 2.6, repeat: Number.POSITIVE_INFINITY }}
                style={{ transformOrigin: `${x}px ${y}px` }}
              />
            ) : null}
          </g>
        );
      })()}

      {/* bearings */}
      {[0, 90, 180, -90].map((lon) => {
        const [x, y] = pt(EDGE - 2.4, lon);
        return (
          <text
            key={`m-${lon}`}
            x={x}
            y={y + 3}
            textAnchor="middle"
            fontFamily="var(--font-mono)"
            fontSize="9"
            fill="#8aa5b0"
          >
            {lon === 0 ? "0°" : lon === 180 ? "180°" : `${Math.abs(lon)}°${lon > 0 ? "E" : "W"}`}
          </text>
        );
      })}
    </svg>
  );
}
