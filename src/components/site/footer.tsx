import { ArrowUpRight, MapPin } from "lucide-react";
import { meta, nav } from "@/content";
import { ChartGrid, Hexagon, MarkWatermark } from "./brand";

const focusRing =
  "rounded-md focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50";

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-[#08171b] text-white">
      {/* Brand seam + atmosphere */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand/70 to-transparent" />
      <ChartGrid tone="light" fade="top" className="opacity-30" />
      <Hexagon
        variant="outline"
        strokeWidth={1.5}
        className="pointer-events-none absolute -bottom-24 right-[-3rem] size-80 text-brand/10"
      />
      <MarkWatermark
        src="/logo-icon.svg"
        className="pointer-events-none absolute -left-16 bottom-0 w-72 opacity-[0.05] invert"
      />

      <div className="relative mx-auto w-full max-w-6xl px-5 py-16 md:px-8">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-[1.6fr_1fr_1fr]">
          {/* Brand */}
          <div className="flex flex-col gap-5">
            <a href="#top" className={`flex items-center gap-3 ${focusRing} w-fit`}>
              <img src="/logo-icon.svg" alt="" aria-hidden="true" className="h-9 w-auto" />
              <span className="font-heading text-xl font-semibold tracking-tight text-white">
                GlaciaNav
              </span>
            </a>
            <p className="max-w-xs text-sm leading-relaxed text-zinc-400">{meta.tagline}</p>
            <p className="inline-flex items-center gap-2 text-sm text-zinc-400">
              <MapPin className="size-4 text-brand" strokeWidth={1.75} />
              {meta.location}
            </p>
          </div>

          {/* Navigate */}
          <div>
            <h4 className="font-mono text-[0.7rem] uppercase tracking-[0.2em] text-brand">
              Navigate
            </h4>
            <ul className="mt-4 flex flex-col gap-3">
              {nav.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className={`text-sm text-zinc-300 transition-colors hover:text-white ${focusRing}`}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Get in touch */}
          <div>
            <h4 className="font-mono text-[0.7rem] uppercase tracking-[0.2em] text-brand">
              Get in touch
            </h4>
            <ul className="mt-4 flex flex-col gap-3">
              <li>
                <a
                  href={`mailto:${meta.email}`}
                  className={`inline-flex items-center gap-1.5 text-sm text-zinc-300 transition-colors hover:text-white ${focusRing}`}
                >
                  {meta.email}
                </a>
              </li>
              <li>
                <a
                  href="#contact"
                  className={`group inline-flex items-center gap-1 text-sm font-medium text-brand transition-colors hover:text-white ${focusRing}`}
                >
                  Contact us
                  <ArrowUpRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-14 flex flex-col gap-3 border-t border-white/10 pt-6 font-mono text-xs text-zinc-500 sm:flex-row sm:items-center sm:justify-between">
          <span>© 2026 {meta.name}. All systems nominal.</span>
          <span>Last updated {meta.lastUpdated}</span>
        </div>
      </div>
    </footer>
  );
}
