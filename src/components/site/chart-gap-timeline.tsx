import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";

/**
 * Twelve days of a winter, and what a bridge actually had to work with.
 *
 * Official ice charts do not arrive on a clock. They land when they land — a
 * day apart, sometimes three — and between them nothing new reaches the
 * bridge, so the data in use quietly ages. GlaciaNav issues a prediction on
 * every satellite pass, so the same line never gets old.
 *
 * A playhead runs the twelve days once, and the two readouts show the age of
 * what each source is offering at that moment. After the run it holds, and
 * the pointer can scrub anywhere along it.
 */

const DAYS = 12;
/** When charts actually landed, in days. Irregular, because they are. */
const CHART_ISSUES = [0, 1.4, 3.9, 4.8, 7.7, 8.2, 11.1];
/** A usable SAR pass roughly every eight hours. */
const PASS_EVERY = 8 / 24;
const PASSES = Array.from({ length: Math.floor(DAYS / PASS_EVERY) + 1 }, (_, i) => i * PASS_EVERY);

const W = 1000;
const H = 210;
const M = { left: 132, right: 26, top: 46, bottom: 40 };
const PW = W - M.left - M.right;
const LANE = { chart: 76, pass: 140 };

const x = (d: number) => M.left + (d / DAYS) * PW;

/** Age of the newest item at or before `d`, in days. */
function ageAt(times: number[], d: number) {
  let last = times[0];
  for (const t of times) if (t <= d) last = t;
  return Math.max(0, d - last);
}

function fmt(days: number) {
  const h = days * 24;
  if (h < 1) return `${Math.round(h * 60)} min`;
  if (h < 24) return `${h.toFixed(1)} h`;
  return `${Math.floor(h / 24)} d ${Math.round(h % 24)} h`;
}

export function ChartGapTimeline() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const [d, setD] = useState(DAYS);
  const [scrubbing, setScrubbing] = useState(false);

  // one pass across the twelve days, then hold
  useEffect(() => {
    if (!inView || scrubbing) return;
    if (reduce) {
      setD(DAYS);
      return;
    }
    let raf = 0;
    let start = 0;
    const RUN = 7000;
    const tick = (now: number) => {
      if (!start) start = now;
      const p = Math.min(1, (now - start) / RUN);
      setD(p * DAYS);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    setD(0);
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, reduce, scrubbing]);

  function scrub(clientX: number) {
    const el = svgRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const u = ((clientX - r.left) / r.width) * W;
    setScrubbing(true);
    setD(Math.max(0, Math.min(DAYS, ((u - M.left) / PW) * DAYS)));
  }

  const chartAge = ageAt(CHART_ISSUES, d);
  const passAge = ageAt(PASSES, d);
  const lastIssue = [...CHART_ISSUES].filter((t) => t <= d).pop() ?? 0;

  return (
    <figure className="m-0">
      <div ref={ref}>
        <svg
          ref={svgRef}
          viewBox={`0 0 ${W} ${H}`}
          className="w-full touch-none"
          onPointerMove={(e) => scrub(e.clientX)}
          onPointerLeave={() => setScrubbing(false)}
          role="img"
          aria-label="Twelve days of ice charts arriving one to three days apart, against a GlaciaNav prediction on every satellite pass."
        >
          {/* day grid */}
          {Array.from({ length: DAYS + 1 }, (_, i) => (
            <g key={i}>
              <line
                x1={x(i)}
                y1={M.top - 10}
                x2={x(i)}
                y2={LANE.pass + 26}
                stroke="var(--ink)"
                strokeOpacity={0.08}
                strokeWidth="1"
              />
              <text
                x={x(i)}
                y={LANE.pass + 44}
                textAnchor="middle"
                fontFamily="var(--font-mono)"
                fontSize="11.5"
                fill="var(--ink-faint)"
              >
                {i}
              </text>
            </g>
          ))}
          <text
            x={W - M.right}
            y={H - 4}
            textAnchor="end"
            fontFamily="var(--font-mono)"
            fontSize="10.5"
            letterSpacing="1"
            fill="var(--ink-faint)"
          >
            DAYS OF ONE WINTER
          </text>

          {/* ---- lane 1: official charts, and the blind gaps between ---- */}
          <text
            x={0}
            y={LANE.chart - 16}
            fontFamily="var(--font-heading)"
            fontWeight="800"
            fontSize="14"
            fill="var(--ink)"
          >
            OFFICIAL ICE CHART
          </text>
          <text x={0} y={LANE.chart - 2} fontFamily="var(--font-mono)" fontSize="10" fill="var(--ink-faint)">
            when it happens to land
          </text>
          <line
            x1={M.left}
            y1={LANE.chart}
            x2={W - M.right}
            y2={LANE.chart}
            stroke="var(--ink)"
            strokeOpacity={0.25}
            strokeWidth="1"
          />
          {CHART_ISSUES.map((t, i) => {
            const next = CHART_ISSUES[i + 1] ?? DAYS;
            const gap = next - t;
            const reached = d >= t;
            return (
              <g key={t}>
                {/* the stretch with nothing new */}
                <rect
                  x={x(t)}
                  y={LANE.chart - 15}
                  width={Math.max(0, x(Math.min(next, d)) - x(t))}
                  height={30}
                  fill="var(--ink)"
                  fillOpacity={gap >= 2 ? 0.13 : 0.07}
                />
                {gap >= 2 && d > t + gap * 0.45 ? (
                  <text
                    x={(x(t) + x(next)) / 2}
                    y={LANE.chart + 5}
                    textAnchor="middle"
                    fontFamily="var(--font-mono)"
                    fontSize="11"
                    fill="var(--ink-soft)"
                  >
                    {gap.toFixed(1)} d blind
                  </text>
                ) : null}
                {reached ? (
                  <rect x={x(t) - 1.5} y={LANE.chart - 19} width={3} height={38} fill="var(--ink)" />
                ) : null}
              </g>
            );
          })}

          {/* ---- lane 2: a prediction every pass ---- */}
          <text
            x={0}
            y={LANE.pass - 16}
            fontFamily="var(--font-heading)"
            fontWeight="800"
            fontSize="14"
            fill="var(--mask-ink)"
          >
            GLACIANAV
          </text>
          <text x={0} y={LANE.pass - 2} fontFamily="var(--font-mono)" fontSize="10" fill="var(--ink-faint)">
            a prediction every pass
          </text>
          <line
            x1={M.left}
            y1={LANE.pass}
            x2={W - M.right}
            y2={LANE.pass}
            stroke="var(--ink)"
            strokeOpacity={0.25}
            strokeWidth="1"
          />
          <rect
            x={M.left}
            y={LANE.pass - 13}
            width={Math.max(0, x(d) - M.left)}
            height={26}
            fill="var(--mask)"
            fillOpacity={0.34}
          />
          {PASSES.filter((t) => t <= d).map((t) => (
            <rect key={t} x={x(t) - 1} y={LANE.pass - 15} width={2} height={30} fill="var(--mask-ink)" />
          ))}

          {/* ---- the playhead ---- */}
          <line
            x1={x(d)}
            y1={M.top - 14}
            x2={x(d)}
            y2={LANE.pass + 26}
            stroke="var(--ink)"
            strokeWidth="1.5"
          />
          <polygon
            points={`${x(d) - 5},${M.top - 20} ${x(d) + 5},${M.top - 20} ${x(d)},${M.top - 11}`}
            fill="var(--ink)"
          />

          {/* ---- what each source is offering at this moment ---- */}
          <g>
            <text x={0} y={M.top - 26} fontFamily="var(--font-mono)" fontSize="10" letterSpacing="1" fill="var(--ink-faint)">
              AGE OF DATA IN USE
            </text>
            <text
              x={M.left}
              y={M.top - 22}
              fontFamily="var(--font-mono)"
              fontSize="15"
              fill="var(--ink)"
            >
              {`chart  ${fmt(chartAge)}`}
            </text>
            <text
              x={M.left + 250}
              y={M.top - 22}
              fontFamily="var(--font-mono)"
              fontSize="15"
              fill="var(--mask-ink)"
            >
              {`GlaciaNav  ${fmt(passAge)}`}
            </text>
            <text
              x={W - M.right}
              y={M.top - 22}
              textAnchor="end"
              fontFamily="var(--font-mono)"
              fontSize="12"
              fill="var(--ink-faint)"
            >
              {`day ${d.toFixed(1)} · last chart day ${lastIssue.toFixed(1)}`}
            </text>
          </g>
        </svg>
      </div>

      <figcaption className="mt-4 flex flex-wrap items-center gap-x-7 gap-y-2 border-t border-ink/15 pt-3">
        <span className="flex items-center gap-2">
          <span className="h-3.5 w-[3px] bg-ink" />
          <span className="font-mono text-[0.64rem] uppercase tracking-[0.12em] text-ink">
            Chart issued
          </span>
        </span>
        <span className="flex items-center gap-2">
          <span className="h-3.5 w-6 bg-ink/15" />
          <span className="font-mono text-[0.64rem] uppercase tracking-[0.12em] text-ink-soft">
            Nothing new reaches the bridge
          </span>
        </span>
        <span className="flex items-center gap-2">
          <span className="h-3.5 w-6 bg-mask/40" />
          <span className="font-mono text-[0.64rem] uppercase tracking-[0.12em] text-mask-ink">
            Continuous prediction
          </span>
        </span>
        <span className="ml-auto font-mono text-[0.64rem] uppercase tracking-[0.12em] text-ink-faint">
          Move across to scrub
        </span>
      </figcaption>
    </figure>
  );
}
