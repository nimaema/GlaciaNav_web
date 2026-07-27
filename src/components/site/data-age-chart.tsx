import { useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";

/**
 * Data age over three days.
 *
 * The official ice chart is issued once a day, so the age of what a bridge is
 * navigating on climbs from zero to twenty-four hours and drops again. A
 * satellite pass every six hours keeps the same curve under six. The area
 * between the two is the staleness a crew carries for no reason, and it is the
 * whole argument of this section — stated as a figure, with axes and units,
 * rather than as a picture of ice.
 */

const HOURS = 72;
const CHART_CYCLE = 24; // official chart issue interval
const PASS_CYCLE = 6; // combined SAR revisit over the Baltic

// figure geometry, in the SVG's own units
const W = 1000;
const H = 300;
const M = { top: 16, right: 20, bottom: 42, left: 54 };
const PW = W - M.left - M.right;
const PH = H - M.top - M.bottom;

const x = (h: number) => M.left + (h / HOURS) * PW;
const y = (age: number) => M.top + PH - (age / 26) * PH;

/** Sawtooth: age resets to zero at every issue, then climbs. */
function sawtooth(cycle: number) {
  const pts: Array<[number, number]> = [];
  for (let h = 0; h <= HOURS; h += 0.25) {
    const age = h % cycle;
    // draw the vertical reset cleanly rather than letting the line slope back
    if (age < 0.25 && h > 0) {
      pts.push([h, cycle]);
      pts.push([h, 0]);
    } else {
      pts.push([h, age]);
    }
  }
  return pts;
}

function line(pts: Array<[number, number]>) {
  return pts.map(([h, a], i) => `${i ? "L" : "M"}${x(h).toFixed(1)} ${y(a).toFixed(1)}`).join("");
}

/** The gap between the two curves, as a closed band. */
function band(a: Array<[number, number]>, b: Array<[number, number]>) {
  const top = a.map(([h, v]) => `${x(h).toFixed(1)} ${y(v).toFixed(1)}`);
  const bottom = [...b].reverse().map(([h, v]) => `${x(h).toFixed(1)} ${y(v).toFixed(1)}`);
  return `M${top.join("L")}L${bottom.join("L")}Z`;
}

export function DataAgeChart() {
  const reduce = useReducedMotion();
  const official = useMemo(() => sawtooth(CHART_CYCLE), []);
  const glacianav = useMemo(() => sawtooth(PASS_CYCLE), []);

  return (
    <figure className="m-0">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full"
        role="img"
        aria-label="Data age over 72 hours: the official ice chart climbs to 24 hours between issues, while a satellite pass every six hours holds GlaciaNav under six."
      >
        {/* horizontal rules at each labelled age */}
        {[0, 6, 12, 18, 24].map((a) => (
          <g key={a}>
            <line
              x1={M.left}
              y1={y(a)}
              x2={W - M.right}
              y2={y(a)}
              stroke="var(--ink)"
              strokeOpacity={a === 0 ? 0.5 : 0.1}
              strokeWidth={a === 0 ? 1.5 : 1}
            />
            <text
              x={M.left - 12}
              y={y(a) + 4}
              textAnchor="end"
              fontFamily="var(--font-mono)"
              fontSize="12"
              fill="var(--ink-faint)"
            >
              {a}
            </text>
          </g>
        ))}
        <text
          x={M.left - 12}
          y={M.top - 4}
          textAnchor="end"
          fontFamily="var(--font-mono)"
          fontSize="10.5"
          letterSpacing="1"
          fill="var(--ink-faint)"
        >
          HOURS
        </text>

        {/* day boundaries */}
        {[0, 12, 24, 36, 48, 60, 72].map((h) => (
          <g key={h}>
            <line
              x1={x(h)}
              y1={M.top}
              x2={x(h)}
              y2={M.top + PH}
              stroke="var(--ink)"
              strokeOpacity={h % 24 === 0 ? 0.16 : 0.07}
              strokeWidth="1"
            />
            <text
              x={x(h)}
              y={M.top + PH + 22}
              textAnchor="middle"
              fontFamily="var(--font-mono)"
              fontSize="12"
              fill="var(--ink-faint)"
            >
              {h}
            </text>
          </g>
        ))}
        <text
          x={W - M.right}
          y={M.top + PH + 38}
          textAnchor="end"
          fontFamily="var(--font-mono)"
          fontSize="10.5"
          letterSpacing="1"
          fill="var(--ink-faint)"
        >
          HOURS ELAPSED
        </text>

        {/* the staleness a crew carries */}
        <motion.path
          d={band(official, glacianav)}
          fill="var(--ink)"
          fillOpacity={0.07}
          initial={reduce ? false : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, delay: 0.75 }}
        />

        {/* official chart */}
        <motion.path
          d={line(official)}
          fill="none"
          stroke="var(--ink)"
          strokeWidth="2.25"
          strokeLinejoin="round"
          initial={reduce ? false : { pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
        />

        {/* GlaciaNav */}
        <motion.path
          d={line(glacianav)}
          fill="none"
          stroke="var(--mask-ink)"
          strokeWidth="2.25"
          strokeLinejoin="round"
          initial={reduce ? false : { pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 1.5, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
        />

        {/* mean lines: what each actually costs on average */}
        {[
          { v: CHART_CYCLE / 2, c: "var(--ink)", label: "Mean 12.0 h" },
          { v: PASS_CYCLE / 2, c: "var(--mask-ink)", label: "Mean 3.0 h" },
        ].map((m) => (
          <g key={m.label}>
            <line
              x1={M.left}
              y1={y(m.v)}
              x2={W - M.right}
              y2={y(m.v)}
              stroke={m.c}
              strokeOpacity={0.5}
              strokeWidth="1"
              strokeDasharray="5 5"
            />
            <text
              x={W - M.right - 6}
              y={y(m.v) - 7}
              textAnchor="end"
              fontFamily="var(--font-mono)"
              fontSize="11.5"
              fill={m.c}
            >
              {m.label}
            </text>
          </g>
        ))}
      </svg>

      <figcaption className="mt-4 flex flex-wrap items-center gap-x-7 gap-y-2 border-t border-ink/15 pt-3">
        <span className="flex items-center gap-2">
          <span className="h-[2px] w-6 bg-ink" />
          <span className="font-mono text-[0.64rem] uppercase tracking-[0.12em] text-ink">
            Official ice chart · issued daily
          </span>
        </span>
        <span className="flex items-center gap-2">
          <span className="h-[2px] w-6 bg-mask-ink" />
          <span className="font-mono text-[0.64rem] uppercase tracking-[0.12em] text-mask-ink">
            GlaciaNav · every satellite pass
          </span>
        </span>
        <span className="ml-auto font-mono text-[0.64rem] uppercase tracking-[0.12em] text-ink-faint">
          Age of the data in use
        </span>
      </figcaption>
    </figure>
  );
}
