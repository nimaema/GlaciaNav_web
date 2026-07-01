import { motion, useReducedMotion } from "framer-motion";

/**
 * Arctic expansion map.
 *
 * A stylised top-of-world view. Three coverage rings grow outward from the
 * Baltic as the go-to-market widens — Baltic → Nordic → global winter lanes —
 * with route arcs reaching the target regions. Hovering a phase focuses its
 * ring. Pure SVG; the "landmass" is abstract, not a literal map.
 */

// Coverage zones centred on the Baltic (cx,cy in a 0–400 viewBox).
const CENTER = { x: 176, y: 214 };
const ZONES = [
  { r: 46, color: "var(--brand)", nodes: [[150, 190], [196, 176], [168, 240]] },
  { r: 104, color: "var(--brand-strong)", nodes: [[110, 120], [250, 150], [96, 268]] },
  { r: 176, color: "var(--signal)", nodes: [[300, 70], [352, 250], [70, 340], [250, 360]] },
];

export function MarketMap({ active }: { active: number }) {
  const reduce = useReducedMotion();
  return (
    <svg viewBox="0 0 400 400" className="h-full w-full" aria-hidden="true">
      <defs>
        <radialGradient id="mm-glow" cx="44%" cy="54%" r="60%">
          <stop offset="0%" stopColor="color-mix(in srgb, var(--brand) 22%, transparent)" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
        <pattern id="mm-grid" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M20 0H0V20" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
        </pattern>
      </defs>

      <rect width="400" height="400" fill="url(#mm-grid)" />
      <rect width="400" height="400" fill="url(#mm-glow)" />

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
            stroke="rgba(255,255,255,0.04)"
            strokeWidth="1"
          />
        );
      })}

      {/* coverage rings, outermost first so labels sit on top */}
      {ZONES.map((z, i) => {
        const on = i <= active;
        const focused = i === active;
        return (
          <g key={i}>
            <motion.circle
              cx={CENTER.x}
              cy={CENTER.y}
              r={z.r}
              fill={focused ? "color-mix(in srgb, var(--brand) 6%, transparent)" : "transparent"}
              stroke={z.color}
              strokeWidth={focused ? 1.75 : 1}
              strokeDasharray={i === 2 ? "4 4" : undefined}
              initial={reduce ? false : { scale: 0.4, opacity: 0 }}
              animate={{ scale: on ? 1 : 0.4, opacity: on ? (focused ? 1 : 0.4) : 0.12 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              style={{ transformOrigin: `${CENTER.x}px ${CENTER.y}px` }}
            />
            {/* target nodes + route arcs for this zone */}
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
                    <motion.circle
                      cx={n[0]}
                      cy={n[1]}
                      r={focused ? 3.5 : 2.5}
                      fill={z.color}
                      initial={reduce ? false : { scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2 + k * 0.08, type: "spring", stiffness: 300 }}
                    />
                    {focused && !reduce ? (
                      <motion.circle
                        cx={n[0]}
                        cy={n[1]}
                        r={3.5}
                        fill="none"
                        stroke={z.color}
                        animate={{ scale: [1, 2.6], opacity: [0.7, 0] }}
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
      <circle cx={CENTER.x} cy={CENTER.y} r={5} fill="var(--brand)" />
      <circle cx={CENTER.x} cy={CENTER.y} r={5} fill="none" stroke="var(--brand)" strokeOpacity="0.4" strokeWidth="6" />
    </svg>
  );
}
