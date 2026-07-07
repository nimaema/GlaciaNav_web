import { ArrowUp, ArrowUpRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { meta, nav } from "@/content";
import { ChartGrid } from "./brand";

const focusRing =
  "rounded-md focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50";

const SYSTEMS = [
  { label: "SAR ingest", state: "Nominal" },
  { label: "Forecast", state: "Live" },
  { label: "Routing", state: "Ready" },
];

export function Footer() {
  const reduce = useReducedMotion();
  return (
    <footer className="relative overflow-hidden bg-abyss text-white">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand/70 to-transparent" />
      <ChartGrid tone="light" fade="top" className="opacity-20" />

      <div className="relative mx-auto w-full max-w-6xl px-5 md:px-8">
        {/* Console status strip */}
        <div className="flex flex-wrap items-center gap-x-8 gap-y-3 border-b border-white/10 py-5 font-mono text-[0.62rem] uppercase tracking-[0.16em]">
          {SYSTEMS.map((s) => (
            <span key={s.label} className="inline-flex items-center gap-2 text-zinc-400">
              <motion.span
                className="size-1.5 rounded-full bg-brand"
                animate={reduce ? undefined : { opacity: [1, 0.3, 1] }}
                transition={{ duration: 1.8, repeat: Number.POSITIVE_INFINITY }}
              />
              {s.label}
              <span className="text-brand-strong">{s.state}</span>
            </span>
          ))}
          <span className="ml-auto text-zinc-500">Bay of Bothnia · 65°N</span>
        </div>

        {/* Course line: statement + navigation + helm */}
        <div className="grid grid-cols-1 items-start gap-10 py-14 lg:grid-cols-[1.3fr_1fr] lg:gap-16">
          <div>
            <div className="flex items-center gap-3">
              <img src="/logo-icon-white-arrow.svg" alt="" aria-hidden="true" className="h-8 w-auto" />
              <span className="font-heading text-xl font-semibold tracking-tight">GlaciaNav</span>
            </div>
            <p className="mt-5 max-w-md font-heading text-xl font-medium leading-snug tracking-tight text-zinc-200 md:text-2xl">
              {meta.descriptor}
            </p>
            <a
              href="#contact"
              className={`group mt-6 inline-flex items-center gap-2 text-sm font-medium text-brand transition-colors hover:text-white ${focusRing}`}
            >
              Set a course with us
              <ArrowUpRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </div>

          <div className="flex flex-col gap-6 lg:items-end">
            {/* Inline nav — not a column stack */}
            <nav className="flex flex-wrap gap-x-6 gap-y-2 font-mono text-[0.72rem] uppercase tracking-[0.14em] lg:justify-end">
              {nav.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className={`text-zinc-400 transition-colors hover:text-brand-strong ${focusRing}`}
                >
                  {item.label}
                </a>
              ))}
            </nav>
            <a
              href={`mailto:${meta.email}`}
              className={`font-mono text-sm text-zinc-300 transition-colors hover:text-white ${focusRing}`}
            >
              {meta.email}
            </a>
            <a
              href="#top"
              className={`inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 font-mono text-[0.68rem] uppercase tracking-[0.14em] text-zinc-300 transition-colors hover:border-brand/50 hover:text-white ${focusRing}`}
            >
              <ArrowUp className="size-3.5" />
              Return to helm
            </a>
          </div>
        </div>
      </div>

      {/* Oversized ghosted wordmark — the signature */}
      <div className="relative -mb-[0.12em] select-none px-4" aria-hidden="true">
        <span
          className="block text-center font-heading font-semibold leading-none tracking-tight text-transparent"
          style={{
            fontSize: "clamp(4rem, 20vw, 17rem)",
            WebkitTextStroke: "1px color-mix(in srgb, var(--brand) 32%, transparent)",
          }}
        >
          GlaciaNav
        </span>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-abyss via-abyss/30 to-transparent" />
      </div>

      {/* Bottom telemetry */}
      <div className="relative border-t border-white/10">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-5 py-6 font-mono text-xs text-zinc-500 sm:flex-row sm:items-center sm:justify-between md:px-8">
          <span>© 2026 {meta.name}. All systems nominal.</span>
          <span>Last updated {meta.lastUpdated}</span>
        </div>
      </div>
    </footer>
  );
}
