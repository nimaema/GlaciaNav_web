import { useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";

/**
 * What the iceberg forecast actually produces.
 *
 * A berg is detected, its drift is projected forward hour by hour, and the
 * projection carries an uncertainty that widens the further out it runs. The
 * vessel's planned corridor is a fixed band. The moment the cone touches the
 * band, the bridge gets a time — and that time, not the picture, is the
 * product.
 */

const W = 1000;
const H = 300;

/** The forecast track, as a cubic through the next six hours. */
const P0 = [126, 46] as const;
const P1 = [352, 84] as const;
const P2 = [470, 168] as const;
const P3 = [742, 268] as const;

const CORRIDOR = { top: 186, bottom: 236 };
const HOURS = 6;

function at(t: number): [number, number] {
  const u = 1 - t;
  const x =
    u * u * u * P0[0] + 3 * u * u * t * P1[0] + 3 * u * t * t * P2[0] + t * t * t * P3[0];
  const y =
    u * u * u * P0[1] + 3 * u * u * t * P1[1] + 3 * u * t * t * P2[1] + t * t * t * P3[1];
  return [x, y];
}

function tangent(t: number): [number, number] {
  const u = 1 - t;
  const x =
    3 * u * u * (P1[0] - P0[0]) + 6 * u * t * (P2[0] - P1[0]) + 3 * t * t * (P3[0] - P2[0]);
  const y =
    3 * u * u * (P1[1] - P0[1]) + 6 * u * t * (P2[1] - P1[1]) + 3 * t * t * (P3[1] - P2[1]);
  const m = Math.hypot(x, y) || 1;
  return [x / m, y / m];
}

/** Uncertainty grows with lead time: a few hundred metres now, a mile by +6. */
const spread = (t: number) => 5 + t * t * 52;

const TRACK = `M${P0[0]} ${P0[1]} C${P1[0]} ${P1[1]} ${P2[0]} ${P2[1]} ${P3[0]} ${P3[1]}`;

function cone() {
  const N = 40;
  const upper: string[] = [];
  const lower: string[] = [];
  for (let i = 0; i <= N; i++) {
    const t = i / N;
    const [x, y] = at(t);
    const [tx, ty] = tangent(t);
    const s = spread(t);
    upper.push(`${(x + ty * s).toFixed(1)} ${(y - tx * s).toFixed(1)}`);
    lower.push(`${(x - ty * s).toFixed(1)} ${(y + tx * s).toFixed(1)}`);
  }
  return `M${upper.join("L")}L${lower.reverse().join("L")}Z`;
}

/** Where the cone's leading edge first reaches the corridor. */
function contact() {
  for (let i = 0; i <= 200; i++) {
    const t = i / 200;
    const [x, y] = at(t);
    const [tx, ty] = tangent(t);
    const s = spread(t);
    if (y + tx * s >= CORRIDOR.top || y - tx * s >= CORRIDOR.top) {
      return { t, x, y, hours: t * HOURS };
    }
    void ty;
  }
  return { t: 1, x: P3[0], y: P3[1], hours: HOURS };
}

const STATS = [
  { label: "Target", value: "Berg 0412" },
  { label: "Waterline length", value: "118 m" },
  { label: "Drift", value: "0.9 kn · 148°" },
  { label: "Confidence", value: "0.93" },
];

export function IcebergForecast() {
  const reduce = useReducedMotion();
  const coneD = useMemo(cone, []);
  const hit = useMemo(contact, []);
  const eta = `${Math.floor(hit.hours)} h ${Math.round((hit.hours % 1) * 60)} m`;

  return (
    <figure className="m-0">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full"
        role="img"
        aria-label={`Forecast drift track for iceberg 0412, with the uncertainty widening over six hours and reaching the planned corridor in ${eta}.`}
      >
        {/* the water */}
        <rect width={W} height={H} fill="#ffffff" />
        {Array.from({ length: 11 }, (_, i) => (
          <line
            key={i}
            x1={i * 100}
            y1={0}
            x2={i * 100}
            y2={H}
            stroke="var(--ink)"
            strokeOpacity={0.05}
            strokeWidth="1"
          />
        ))}

        {/* the vessel's planned corridor */}
        <rect
          x={0}
          y={CORRIDOR.top}
          width={W}
          height={CORRIDOR.bottom - CORRIDOR.top}
          fill="var(--ink)"
          fillOpacity={0.06}
        />
        {[CORRIDOR.top, CORRIDOR.bottom].map((y) => (
          <line
            key={y}
            x1={0}
            y1={y}
            x2={W}
            y2={y}
            stroke="var(--ink)"
            strokeOpacity={0.45}
            strokeWidth="1.5"
            strokeDasharray="7 6"
          />
        ))}
        <text
          x={14}
          y={CORRIDOR.top - 10}
          fontFamily="var(--font-mono)"
          fontSize="11"
          letterSpacing="1"
          fill="var(--ink-soft)"
        >
          PLANNED CORRIDOR
        </text>

        {/* the vessel running it */}
        <g transform={`translate(96 ${(CORRIDOR.top + CORRIDOR.bottom) / 2})`}>
          <polygon points="-13,-6 9,-6 20,0 9,6 -13,6" fill="var(--ink)" />
          <line x1={24} y1={0} x2={62} y2={0} stroke="var(--ink)" strokeOpacity={0.45} strokeWidth="1.5" />
          <polygon points="62,-4 70,0 62,4" fill="var(--ink)" fillOpacity={0.45} />
        </g>

        {/* how far the forecast could be wrong */}
        <motion.path
          d={coneD}
          fill="var(--mask)"
          fillOpacity={0.2}
          stroke="var(--mask-ink)"
          strokeOpacity={0.35}
          strokeWidth="1"
          initial={reduce ? false : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        />

        {/* the projected track */}
        <motion.path
          d={TRACK}
          fill="none"
          stroke="var(--mask-ink)"
          strokeWidth="2.5"
          strokeDasharray="8 7"
          initial={reduce ? false : { pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 1.3, ease: [0.16, 1, 0.3, 1] }}
        />

        {/* hourly positions */}
        {Array.from({ length: HOURS }, (_, i) => {
          const t = (i + 1) / HOURS;
          const [x, y] = at(t);
          return (
            <motion.g
              key={i}
              initial={reduce ? false : { opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.3, delay: 0.35 + t * 1.1 }}
            >
              <circle cx={x} cy={y} r="4.5" fill="var(--paper)" stroke="var(--mask-ink)" strokeWidth="2" />
              <text
                x={x + 9}
                y={y - 8}
                fontFamily="var(--font-mono)"
                fontSize="11"
                fill="var(--ink-faint)"
              >
                {`+${i + 1} h`}
              </text>
            </motion.g>
          );
        })}

        {/* the berg, now */}
        <motion.g
          initial={reduce ? false : { scale: 0.6, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          style={{ transformOrigin: `${P0[0]}px ${P0[1]}px` }}
        >
          <polygon
            points={`${P0[0] - 14},${P0[1] + 6} ${P0[0] - 6},${P0[1] - 9} ${P0[0] + 7},${P0[1] - 11} ${P0[0] + 15},${P0[1] + 2} ${P0[0] + 6},${P0[1] + 11} ${P0[0] - 8},${P0[1] + 10}`}
            fill="var(--mask)"
            stroke="var(--mask-ink)"
            strokeWidth="2"
          />
          <text
            x={P0[0] + 24}
            y={P0[1] - 16}
            fontFamily="var(--font-mono)"
            fontSize="12"
            letterSpacing="0.5"
            fill="var(--ink)"
          >
            BERG 0412 · DETECTED NOW
          </text>
        </motion.g>

        {/* the moment it matters */}
        <motion.g
          initial={reduce ? false : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.4, delay: 1.5 }}
        >
          <line
            x1={hit.x}
            y1={hit.y}
            x2={hit.x}
            y2={CORRIDOR.top}
            stroke="var(--ink)"
            strokeWidth="1.5"
          />
          <circle cx={hit.x} cy={CORRIDOR.top} r="6" fill="var(--ink)" />
          <rect x={hit.x + 12} y={CORRIDOR.top - 44} width={224} height={38} fill="var(--ink)" />
          <rect x={hit.x + 12} y={CORRIDOR.top - 44} width={4} height={38} fill="var(--mask)" />
          <text
            x={hit.x + 26}
            y={CORRIDOR.top - 27}
            fontFamily="var(--font-mono)"
            fontSize="11"
            letterSpacing="1"
            fill="var(--mask)"
          >
            ENTERS CORRIDOR
          </text>
          <text
            x={hit.x + 26}
            y={CORRIDOR.top - 12}
            fontFamily="var(--font-mono)"
            fontSize="14"
            fill="var(--paper)"
          >
            {eta}
          </text>
        </motion.g>
      </svg>

      <div className="mt-5 grid grid-cols-2 gap-px border-y border-ink/20 bg-ink/15 sm:grid-cols-4">
        {STATS.map((s) => (
          <div key={s.label} className="bg-paper-deep px-4 py-3">
            <dt className="font-mono text-[0.58rem] uppercase tracking-[0.14em] text-ink-soft">
              {s.label}
            </dt>
            <dd className="mt-0.5 font-mono text-sm font-bold text-ink tabular-nums">{s.value}</dd>
          </div>
        ))}
      </div>

      <figcaption className="mt-3 flex flex-wrap items-center gap-x-7 gap-y-2">
        <span className="flex items-center gap-2">
          <span className="h-[2px] w-6 bg-mask-ink" />
          <span className="font-mono text-[0.62rem] uppercase tracking-[0.1em] text-mask-ink">
            Forecast track
          </span>
        </span>
        <span className="flex items-center gap-2">
          <span className="h-3 w-6 bg-mask/25 outline outline-1 outline-mask-ink/40" />
          <span className="font-mono text-[0.62rem] uppercase tracking-[0.1em] text-ink-soft">
            Uncertainty, widening with lead time
          </span>
        </span>
        <span className="ml-auto font-mono text-[0.62rem] uppercase tracking-[0.1em] text-ink-faint">
          Six hours ahead
        </span>
      </figcaption>
    </figure>
  );
}
