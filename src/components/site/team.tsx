import { ArrowUpRight } from "lucide-react";
import { team } from "@/content";
import { Reveal, Stagger, StaggerItem } from "./reveal";
import { HexMarker } from "./brand";
import { WaveCanvas } from "./cards";

/**
 * Crew. Real portraits, graded into the polar-night palette so four different
 * source photos read as one set, with instrument overlays (crew code, station,
 * corner ticks). Hover clears the grade to full colour and lifts the card.
 */
export function Team() {
  return (
    <section id="team" className="relative overflow-hidden bg-abyss py-24 text-white md:py-32">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand/40 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-brand/25 to-transparent" />
      <WaveCanvas className="opacity-50" />

      <div className="relative mx-auto w-full max-w-6xl px-5 md:px-8">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-4 border-b border-white/10 pb-6">
            <div>
              <p className="inline-flex items-center gap-2 font-mono text-[0.7rem] uppercase tracking-[0.25em] text-brand">
                <HexMarker />
                Crew manifest
              </p>
              <h2 className="mt-4 font-heading text-3xl font-semibold tracking-tight md:text-4xl">
                {team.headline}
              </h2>
            </div>
            <p className="max-w-sm font-mono text-[0.72rem] uppercase leading-relaxed tracking-[0.06em] text-zinc-500">
              {team.note}
            </p>
          </div>
        </Reveal>

        <Stagger className="mt-10 grid grid-cols-2 gap-4 md:gap-5 lg:grid-cols-4">
          {team.members.map((member, i) => (
            <StaggerItem key={member.email}>
              <a
                href={`mailto:${member.email}`}
                aria-label={`Email ${member.name}`}
                className="group relative block aspect-[4/5] overflow-hidden rounded-2xl border border-white/12 bg-white/[0.03] transition-all duration-300 hover:border-brand/50 hover:shadow-[0_30px_60px_-30px_color-mix(in_srgb,var(--brand)_55%,transparent)] focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/60"
              >
                {/* Portrait, graded by default → full colour on hover */}
                <img
                  src={member.photo}
                  alt={member.name}
                  loading="lazy"
                  style={{ objectPosition: member.focus }}
                  className="absolute inset-0 size-full object-cover grayscale-[0.3] brightness-90 contrast-[1.03] saturate-[0.95] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04] group-hover:grayscale-0 group-hover:brightness-100 group-hover:saturate-100"
                />
                {/* Teal unifying wash (fades on hover) */}
                <span className="pointer-events-none absolute inset-0 bg-brand/20 mix-blend-color opacity-40 transition-opacity duration-500 group-hover:opacity-0" />
                {/* Readability scrim */}
                <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-abyss via-abyss/25 to-transparent" />

                {/* Crew code */}
                <span className="absolute left-3 top-3 rounded border border-white/15 bg-abyss/50 px-1.5 py-0.5 font-mono text-[0.58rem] uppercase tracking-[0.14em] text-brand-strong backdrop-blur-sm">
                  C·0{i + 1}
                </span>

                {/* Corner ticks */}
                {["right-3 top-3 border-r border-t", "left-3 bottom-16 border-l border-b"].map((p) => (
                  <span key={p} aria-hidden="true" className={`pointer-events-none absolute size-3 border-brand/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100 ${p}`} />
                ))}

                {/* Identity plate */}
                <div className="absolute inset-x-0 bottom-0 p-4">
                  <div className="flex items-end justify-between gap-2">
                    <div>
                      <p className="font-heading text-base font-semibold leading-tight text-white">
                        {member.name}
                      </p>
                      <p className="mt-0.5 font-mono text-[0.62rem] uppercase tracking-[0.12em] text-brand-strong">
                        {member.role}
                      </p>
                    </div>
                    <ArrowUpRight className="size-4 shrink-0 -translate-y-0.5 text-brand opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100" />
                  </div>
                </div>
              </a>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
