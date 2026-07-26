import { ArrowUp, ArrowUpRight } from "lucide-react";
import { meta, nav } from "@/content";
import { LinkedInIcon } from "./brand";

const focusRing =
  "rounded-sm focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50";

/**
 * Footer: the last sheet of the survey. Same paper, same ink, closed by a
 * heavy rule and the outlined wordmark, cyan reserved for interaction.
 */
export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t-2 border-ink bg-paper">
      <div className="relative mx-auto w-full max-w-6xl px-5 md:px-8">
        <div className="grid grid-cols-1 items-start gap-10 py-14 lg:grid-cols-[1.3fr_1fr] lg:gap-16">
          <div>
            <div className="flex items-center gap-3">
              <img src="/logo-icon.svg" alt="" aria-hidden="true" className="h-8 w-auto" />
              <span className="display-condensed text-xl font-extrabold text-ink">GlaciaNav</span>
            </div>
            <p className="mt-5 max-w-md text-xl font-medium leading-snug tracking-tight text-ink-soft md:text-2xl">
              {meta.descriptor}
            </p>
            <a
              href="#contact"
              className={`group mt-6 inline-flex items-center gap-2 text-sm font-semibold text-mask-ink transition-colors hover:text-ink ${focusRing}`}
            >
              Open a channel with us
              <ArrowUpRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </div>

          <div className="flex flex-col gap-6 lg:items-end">
            <nav className="flex flex-wrap gap-x-6 gap-y-2 font-mono text-[0.72rem] uppercase tracking-[0.14em] lg:justify-end">
              {nav.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className={`text-ink-soft transition-colors hover:text-mask-ink ${focusRing}`}
                >
                  {item.label}
                </a>
              ))}
            </nav>
            <div className="flex items-center gap-5 lg:justify-end">
              <a
                href={`mailto:${meta.email}`}
                className={`font-mono text-sm text-ink underline decoration-mask decoration-2 underline-offset-4 transition-opacity hover:opacity-75 ${focusRing}`}
              >
                {meta.email}
              </a>
              <a
                href={meta.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GlaciaNav on LinkedIn"
                className={`text-ink-soft transition-colors hover:text-mask-ink ${focusRing}`}
              >
                <LinkedInIcon className="size-4.5" />
              </a>
            </div>
            <a
              href="#top"
              className={`inline-flex items-center gap-2 border border-ink/30 px-4 py-2 font-mono text-[0.68rem] uppercase tracking-[0.14em] text-ink transition-colors hover:border-ink hover:bg-ink hover:text-paper ${focusRing}`}
            >
              <ArrowUp className="size-3.5" />
              Back to the top
            </a>
          </div>
        </div>
      </div>

      {/* Oversized outlined wordmark, pressed into the paper */}
      <div className="relative -mb-[0.14em] select-none px-4" aria-hidden="true">
        <span
          className="display-condensed block text-center font-extrabold leading-none text-transparent"
          style={{
            fontSize: "clamp(4rem, 21vw, 18rem)",
            WebkitTextStroke: "1.5px color-mix(in srgb, var(--ink) 22%, transparent)",
          }}
        >
          GlaciaNav
        </span>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-paper via-paper/20 to-transparent" />
      </div>

      <div className="relative border-t border-ink/15">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-5 py-6 font-mono text-xs text-ink-faint sm:flex-row sm:items-center sm:justify-between md:px-8">
          <span>© 2026 {meta.name} · {meta.location}</span>
          <span>Last updated {meta.lastUpdated}</span>
        </div>
      </div>
    </footer>
  );
}
