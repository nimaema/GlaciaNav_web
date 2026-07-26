import { motion, useReducedMotion } from "framer-motion";

/**
 * Coverage chart, drawn like a survey figure on paper. Three reach rings grow
 * outward from the Baltic origin as the go-to-market widens; the third
 * horizon is dashed chartreuse, the detection color, because it is the one
 * still being hunted.
 */

const CENTER = { x: 176, y: 214 };
export const ZONES = [
  { r: 46, color: "var(--strata-4)", nodes: [[150, 190], [196, 176], [168, 240]] },
  { r: 104, color: "var(--strata-5)", nodes: [[110, 120], [250, 150], [96, 268]] },
  { r: 176, color: "var(--mask-ink)", nodes: [[300, 70], [352, 250], [70, 340], [250, 360]] },
];

export function MarketMap({ active }: { active: number }) {
  const reduce = useReducedMotion();
  return (
    <svg viewBox="0 0 400 400" className="h-full w-full" aria-hidden="true">
      <defs>
        <pattern id="mm-grid" width="25" height="25" patternUnits="userSpaceOnUse">
          <path d="M25 0H0V25" fill="none" stroke="rgba(11,36,48,0.07)" strokeWidth="1" />
        </pattern>
      </defs>

      <rect width="400" height="400" fill="var(--plate)" />
      <rect width="400" height="400" fill="url(#mm-grid)" />

      {/* meridian sweep lines from the Baltic origin */}
      {Array.from({ length: 12 }).map((_, i) => {
        const a = (i / 12) * Math.PI * 2;
        return (
          <line
            key={i}
            x1={CENTER.x}
            y1={CENTER.y}
            x2={CENTER.x + Math.cos(a) * 260}
            y2={CENTER.y + Math.sin(a) * 260}
            stroke="rgba(11,36,48,0.06)"
            strokeWidth="1"
          />
        );
      })}

      {/* coverage rings */}
      {ZONES.map((z, i) => {
        const on = i <= active;
        const focused = i === active;
        return (
          <g key={i}>
            <motion.circle
              cx={CENTER.x}
              cy={CENTER.y}
              r={z.r}
              fill={focused ? "color-mix(in srgb, var(--mask) 12%, transparent)" : "transparent"}
              stroke={z.color}
              strokeWidth={focused ? 1.75 : 1}
              strokeDasharray={i === 2 ? "5 4" : undefined}
              initial={reduce ? false : { scale: 0.4, opacity: 0 }}
              animate={{ scale: on ? 1 : 0.4, opacity: on ? (focused ? 1 : 0.45) : 0.12 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              style={{ transformOrigin: `${CENTER.x}px ${CENTER.y}px` }}
            />
            {on
              ? z.nodes.map((n, k) => (
                  <g key={k}>
                    <line
                      x1={CENTER.x}
                      y1={CENTER.y}
                      x2={n[0]}
                      y2={n[1]}
                      stroke={z.color}
                      strokeWidth="1"
                      opacity={focused ? 0.5 : 0.18}
                    />
                    <motion.rect
                      x={n[0] - 3}
                      y={n[1] - 3}
                      width={focused ? 7 : 5}
                      height={focused ? 7 : 5}
                      fill={z.color}
                      initial={reduce ? false : { scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2 + k * 0.08, type: "spring", stiffness: 300 }}
                      style={{ transformOrigin: `${n[0]}px ${n[1]}px` }}
                    />
                    {focused && !reduce ? (
                      <motion.rect
                        x={n[0] - 4}
                        y={n[1] - 4}
                        width={8}
                        height={8}
                        fill="none"
                        stroke={z.color}
                        animate={{ scale: [1, 2.4], opacity: [0.7, 0] }}
                        transition={{ duration: 1.8, repeat: Number.POSITIVE_INFINITY, delay: k * 0.3 }}
                        style={{ transformOrigin: `${n[0]}px ${n[1]}px` }}
                      />
                    ) : null}
                  </g>
                ))
              : null}
          </g>
        );
      })}

      {/* origin: the Baltic beachhead */}
      <rect x={CENTER.x - 5} y={CENTER.y - 5} width={10} height={10} fill="var(--ink)" />
      <rect x={CENTER.x - 8} y={CENTER.y - 8} width={16} height={16} fill="none" stroke="var(--ink)" strokeOpacity="0.35" strokeWidth="2" />
    </svg>
  );
}
