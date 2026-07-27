/**
 * A pack-ice field for the Bothnian Bay chart.
 *
 * Real winter ice in this basin is not a handful of blobs. It is a few hundred
 * floes: consolidated pans welded together in the north, breaking into smaller
 * cakes and brash toward the south, cut by leads where the pack has pulled
 * apart, with open water at the ice edge. This builds that, deterministically,
 * so every render and every section shows the same field.
 *
 * Coordinates are the chart's own space (0-100 x, 0-120 y). Land is drawn over
 * the field, so floes may be generated on top of a coast and are simply hidden.
 */

export type Floe = {
  x: number;
  y: number;
  r: number;
  /** Closed polygon, in chart units. */
  d: string;
  /** Ice thickness in metres. */
  t: number;
  /** Displacement over one forecast period. */
  dx: number;
  dy: number;
  /** 0-1 local ice concentration where this floe sits. */
  c: number;
};

/** Deterministic PRNG: same field on every render, in every section. */
function mulberry(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Smooth value noise, for concentration that varies in patches not pixels. */
function noise2(seed: number) {
  const rand = mulberry(seed);
  const g: number[][] = [];
  for (let i = 0; i < 24; i++) {
    g[i] = [];
    for (let j = 0; j < 24; j++) g[i][j] = rand();
  }
  const smooth = (t: number) => t * t * (3 - 2 * t);
  return (x: number, y: number) => {
    const gx = ((x % 23) + 23) % 23;
    const gy = ((y % 23) + 23) % 23;
    const x0 = Math.floor(gx);
    const y0 = Math.floor(gy);
    const fx = smooth(gx - x0);
    const fy = smooth(gy - y0);
    const a = g[x0][y0];
    const b = g[x0 + 1][y0];
    const c = g[x0][y0 + 1];
    const d = g[x0 + 1][y0 + 1];
    return (a * (1 - fx) + b * fx) * (1 - fy) + (c * (1 - fx) + d * fx) * fy;
  };
}

/**
 * Ice concentration at a point: heavy in the north, thinning southward, with
 * patchiness and a lead running out from the coast where the pack has parted.
 */
function concentration(x: number, y: number, n: (x: number, y: number) => number) {
  // the ice edge migrates across the basin; north is solid, south is open
  const lat = 1 - (y - 10) / 92;
  let c = lat * 1.22 + (n(x / 13, y / 13) - 0.5) * 0.7;

  // fast ice welds to both shores, so the margins stay solid further south
  const shore = Math.min(Math.abs(x - 20), Math.abs(x - 80));
  if (shore < 9) c += (1 - shore / 9) * 0.3;

  // a lead: the pack pulled open along a line from the north-west
  const lead = Math.abs((y - 30) - (x - 28) * 1.45);
  if (lead < 5.5) c -= (1 - lead / 5.5) * 0.9;

  // a second, shorter lead further south
  const lead2 = Math.abs((y - 78) - (x - 40) * -0.6);
  if (lead2 < 4) c -= (1 - lead2 / 4) * 0.62;

  return Math.max(0, Math.min(1, c));
}

function buildField(): Floe[] {
  const rand = mulberry(20260727);
  const n = noise2(913);
  const floes: Floe[] = [];

  const STEP = 5.2;
  for (let gx = 12; gx <= 90; gx += STEP) {
    for (let gy = 8; gy <= 116; gy += STEP) {
      // jitter the lattice so the pack never reads as a grid
      const x = gx + (rand() - 0.5) * STEP * 0.85;
      const y = gy + (rand() - 0.5) * STEP * 0.85;
      const c = concentration(x, y, n);
      if (rand() > c * 1.06) continue;

      // consolidated pans in the north, cakes and brash at the margin
      const size = (0.5 + c * 0.78) * STEP * 0.6 * (0.68 + rand() * 0.8);
      const verts = 7 + Math.floor(rand() * 4);
      const pts: string[] = [];
      const start = rand() * Math.PI * 2;
      for (let v = 0; v < verts; v++) {
        const a = start + (v / verts) * Math.PI * 2 + (rand() - 0.5) * 0.42;
        const rr = size * (0.74 + rand() * 0.5);
        pts.push(`${(x + Math.cos(a) * rr).toFixed(2)} ${(y + Math.sin(a) * rr * 0.88).toFixed(2)}`);
      }

      // thicker where the pack is consolidated and older, plus ridging noise
      const t = Math.max(
        0.12,
        Math.min(2.15, c * 1.55 + (size / STEP) * 0.7 + (n(x / 6, y / 6) - 0.5) * 0.55)
      );

      // the basin drains south-southwest; speed falls where the pack is tight
      const spread = (n(x / 9 + 5, y / 9 + 5) - 0.5) * 0.5;
      const speed = (1.15 - c * 0.5) * (2.4 + rand() * 1.1);
      floes.push({
        x,
        y,
        r: size,
        d: `M${pts.join("L")}Z`,
        t,
        dx: Math.sin(3.46 + spread) * speed,
        dy: -Math.cos(3.46 + spread) * speed,
        c,
      });
    }
  }
  return floes;
}

export const ICE_FIELD: Floe[] = buildField();

/** Thickness classes, the way an ice chart bins them. */
export const THICKNESS_CLASSES = [
  { max: 0.35, label: "New ice", short: "<0.35", tone: "var(--strata-1)" },
  { max: 0.7, label: "Thin first-year", short: "0.35–0.7", tone: "var(--strata-2)" },
  { max: 1.1, label: "Medium first-year", short: "0.7–1.1", tone: "var(--strata-3)" },
  { max: 1.6, label: "Thick first-year", short: "1.1–1.6", tone: "var(--strata-4)" },
  { max: 99, label: "Multiyear", short: ">1.6", tone: "var(--strata-5)" },
];

export function classOf(t: number) {
  return THICKNESS_CLASSES.findIndex((c) => t <= c.max);
}

/** One path per thickness class: a whole choropleth in five nodes. */
export function thicknessPaths(field: Floe[] = ICE_FIELD) {
  const buckets: string[][] = THICKNESS_CLASSES.map(() => []);
  for (const f of field) buckets[classOf(f.t)].push(f.d);
  return buckets.map((b, i) => ({ ...THICKNESS_CLASSES[i], d: b.join("") }));
}

/** Every floe as one path, optionally displaced by its own drift. */
export function fieldPath(field: Floe[] = ICE_FIELD, drift = 0) {
  if (!drift) return field.map((f) => f.d).join("");
  return field
    .map((f) =>
      f.d.replace(/(-?[\d.]+) (-?[\d.]+)/g, (_, x: string, y: string) =>
        `${(Number(x) + f.dx * drift).toFixed(2)} ${(Number(y) + f.dy * drift).toFixed(2)}`
      )
    )
    .join("");
}

/** A sparse, even sample of the field — for drift arrows and callouts. */
export function sample(every: number, minC = 0.35, field: Floe[] = ICE_FIELD) {
  return field.filter((f, i) => i % every === 0 && f.c > minC);
}
