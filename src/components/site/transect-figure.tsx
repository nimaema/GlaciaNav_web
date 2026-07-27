import { useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { TRANSECT, TRANSECT_KM, THICKNESS_CLASSES, classOf } from "./ice-field";

/**
 * One cut across the basin, read three ways.
 *
 * A survey line runs from the Swedish shore to the Finnish one. Along it the
 * model reports what is ice, how thick it is and how fast it is moving — three
 * panels stacked on a single shared axis, the way a sounding is presented, so
 * the readings line up with each other instead of sitting in separate boxes.
 * Move the pointer and all three report the same point.
 */

const W = 1000;
const M = { left: 142, right: 24, bottom: 40 };
const PW = W - M.left - M.right;

const READOUT = { y: 6, h: 42 }; // the cursor's own band, clear of the data
const P1 = { y: 60, h: 32 }; // classification
const P2 = { y: 110, h: 156 }; // thickness, hanging from the waterline
const P3 = { y: 286, h: 74 }; // drift speed
const H = P3.y + P3.h + M.bottom;

const MAX_T = 2.2;
const MAX_V = 22;

const x = (km: number) => M.left + (km / TRANSECT_KM) * PW;
const step = PW / (TRANSECT.length - 1);

export function TransectFigure() {
  const reduce = useReducedMotion();
  const ref = useRef<SVGSVGElement>(null);
  const [at, setAt] = useState<number | null>(null);

  const cursor = at ?? -1;
  const p = cursor >= 0 ? TRANSECT[cursor] : null;

  function onMove(e: React.PointerEvent<SVGSVGElement>) {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const u = (e.clientX - r.left) / r.width;
    const i = Math.round(((u * W - M.left) / PW) * (TRANSECT.length - 1));
    setAt(i >= 0 && i < TRANSECT.length ? i : null);
  }

  const driftLine = TRANSECT.map(
    (d, i) =>
      `${i ? "L" : "M"}${x(d.km).toFixed(1)} ${(P3.y + P3.h - (d.v / MAX_V) * P3.h).toFixed(1)}`
  ).join("");

  return (
    <figure className="m-0">
      <svg
        ref={ref}
        viewBox={`0 0 ${W} ${H}`}
        className="w-full touch-none"
        onPointerMove={onMove}
        onPointerLeave={() => setAt(null)}
        role="img"
        aria-label="A survey line across the Bothnian Bay, showing ice classification, ice thickness and drift speed against distance."
      >
        {/* ---- panel labels, left-aligned in the gutter so nothing clips ---- */}
        {[
          { y: P1.y, name: "Classification", unit: "ice / water" },
          { y: P2.y, name: "Thickness", unit: "metres below waterline" },
          { y: P3.y, name: "Drift", unit: "cm s⁻¹" },
        ].map((l) => (
          <g key={l.name}>
            <text
              x={0}
              y={l.y + 13}
              fontFamily="var(--font-heading)"
              fontWeight="800"
              fontSize="14"
              fill="var(--ink)"
            >
              {l.name.toUpperCase()}
            </text>
            <text
              x={0}
              y={l.y + 28}
              fontFamily="var(--font-mono)"
              fontSize="10"
              fill="var(--ink-faint)"
            >
              {l.unit}
            </text>
          </g>
        ))}

        {/* ---- 1 · classification ---- */}
        <rect x={M.left} y={P1.y} width={PW} height={P1.h} fill="#ffffff" />
        {TRANSECT.map((d, i) =>
          d.ice ? (
            <motion.rect
              key={i}
              x={x(d.km) - step / 2}
              y={P1.y}
              width={step + 0.6}
              height={P1.h}
              fill="var(--mask)"
              fillOpacity={0.62}
              initial={reduce ? false : { opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.3, delay: (i / TRANSECT.length) * 0.7 }}
            />
          ) : null
        )}
        <rect
          x={M.left}
          y={P1.y}
          width={PW}
          height={P1.h}
          fill="none"
          stroke="var(--ink)"
          strokeOpacity={0.45}
          strokeWidth="1"
        />

        {/* ---- 2 · thickness, drawn downward from the waterline ---- */}
        <line
          x1={M.left}
          y1={P2.y}
          x2={W - M.right}
          y2={P2.y}
          stroke="var(--ink)"
          strokeOpacity={0.5}
          strokeWidth="1.5"
        />
        {[0.5, 1, 1.5, 2].map((t) => (
          <g key={t}>
            <line
              x1={M.left}
              y1={P2.y + (t / MAX_T) * P2.h}
              x2={W - M.right}
              y2={P2.y + (t / MAX_T) * P2.h}
              stroke="var(--ink)"
              strokeOpacity={0.09}
              strokeWidth="1"
            />
            <text
              x={M.left - 8}
              y={P2.y + (t / MAX_T) * P2.h + 4}
              textAnchor="end"
              fontFamily="var(--font-mono)"
              fontSize="11"
              fill="var(--ink-faint)"
            >
              {t.toFixed(1)}
            </text>
          </g>
        ))}
        {TRANSECT.map((d, i) =>
          d.t > 0 ? (
            <motion.rect
              key={i}
              x={x(d.km) - step / 2}
              y={P2.y}
              width={step + 0.6}
              height={(d.t / MAX_T) * P2.h}
              fill={THICKNESS_CLASSES[classOf(d.t)].tone}
              style={{ transformOrigin: `0px ${P2.y}px` }}
              initial={reduce ? false : { scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.45, delay: (i / TRANSECT.length) * 0.7, ease: [0.16, 1, 0.3, 1] }}
            />
          ) : null
        )}

        {/* ---- 3 · drift speed ---- */}
        <line
          x1={M.left}
          y1={P3.y + P3.h}
          x2={W - M.right}
          y2={P3.y + P3.h}
          stroke="var(--ink)"
          strokeOpacity={0.5}
          strokeWidth="1.5"
        />
        {[10, 20].map((v) => (
          <g key={v}>
            <line
              x1={M.left}
              y1={P3.y + P3.h - (v / MAX_V) * P3.h}
              x2={W - M.right}
              y2={P3.y + P3.h - (v / MAX_V) * P3.h}
              stroke="var(--ink)"
              strokeOpacity={0.09}
              strokeWidth="1"
            />
            <text
              x={M.left - 8}
              y={P3.y + P3.h - (v / MAX_V) * P3.h + 4}
              textAnchor="end"
              fontFamily="var(--font-mono)"
              fontSize="11"
              fill="var(--ink-faint)"
            >
              {v}
            </text>
          </g>
        ))}
        <motion.path
          d={driftLine}
          fill="none"
          stroke="var(--strata-5)"
          strokeWidth="2"
          strokeLinejoin="round"
          initial={reduce ? false : { pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 1.2, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
        />

        {/* ---- shared axis ---- */}
        {[0, 20, 40, 60, 80, 100, 120, 140].map((km) => (
          <g key={km}>
            <line
              x1={x(km)}
              y1={P3.y + P3.h}
              x2={x(km)}
              y2={P3.y + P3.h + 6}
              stroke="var(--ink)"
              strokeOpacity={0.4}
              strokeWidth="1"
            />
            <text
              x={x(km)}
              y={P3.y + P3.h + 21}
              textAnchor="middle"
              fontFamily="var(--font-mono)"
              fontSize="11.5"
              fill="var(--ink-faint)"
            >
              {km}
            </text>
          </g>
        ))}
        <text
          x={M.left}
          y={P3.y + P3.h + 36}
          fontFamily="var(--font-mono)"
          fontSize="10.5"
          letterSpacing="1"
          fill="var(--ink-faint)"
        >
          SWEDISH SHORE
        </text>
        <text
          x={W - M.right}
          y={P3.y + P3.h + 36}
          textAnchor="end"
          fontFamily="var(--font-mono)"
          fontSize="10.5"
          letterSpacing="1"
          fill="var(--ink-faint)"
        >
          KM ALONG THE LINE · FINNISH SHORE
        </text>

        {/* ---- the scrubber: one point, read three ways ---- */}
        {p ? (
          <g pointerEvents="none">
            <line
              x1={x(p.km)}
              y1={P1.y}
              x2={x(p.km)}
              y2={P3.y + P3.h}
              stroke="var(--ink)"
              strokeWidth="1.25"
            />
            <circle
              cx={x(p.km)}
              cy={P3.y + P3.h - (p.v / MAX_V) * P3.h}
              r="4"
              fill="var(--strata-5)"
            />
            {p.t > 0 ? (
              <circle cx={x(p.km)} cy={P2.y + (p.t / MAX_T) * P2.h} r="4" fill="var(--ink)" />
            ) : null}
            {(() => {
              const readout = p.ice
                ? `${p.t.toFixed(2)} m  ·  ${p.v.toFixed(1)} cm s⁻¹`
                : `open water  ·  ${p.v.toFixed(1)} cm s⁻¹`;
              const w = readout.length * 9.2 + 140;
              const bx = Math.max(M.left, Math.min(W - M.right - w, x(p.km) - w / 2));
              return (
                <g>
                  <rect x={bx} y={READOUT.y} width={w} height={READOUT.h} fill="var(--ink)" />
                  <rect x={bx} y={READOUT.y} width={4} height={READOUT.h} fill="var(--mask)" />
                  <text
                    x={bx + 18}
                    y={READOUT.y + 27}
                    fontFamily="var(--font-mono)"
                    fontSize="15"
                    fill="var(--mask)"
                  >
                    {`${Math.round(p.km)} km`}
                  </text>
                  <text
                    x={bx + w - 18}
                    y={READOUT.y + 27}
                    textAnchor="end"
                    fontFamily="var(--font-mono)"
                    fontSize="15"
                    fill="var(--paper)"
                  >
                    {readout}
                  </text>
                </g>
              );
            })()}
          </g>
        ) : null}
      </svg>

      <figcaption className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-ink/15 pt-3">
        {THICKNESS_CLASSES.map((c) => (
          <span key={c.label} className="flex items-center gap-2">
            <span
              className="size-2.5 shrink-0 outline outline-1 outline-ink/25"
              style={{ background: c.tone }}
            />
            <span className="font-mono text-[0.62rem] uppercase tracking-[0.1em] text-ink-soft">
              {c.label}
            </span>
          </span>
        ))}
        <span className="ml-auto font-mono text-[0.62rem] uppercase tracking-[0.1em] text-ink-faint">
          Move across to read a point
        </span>
      </figcaption>
    </figure>
  );
}
