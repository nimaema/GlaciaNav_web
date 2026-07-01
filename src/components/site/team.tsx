import { ArrowUpRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { team, meta } from "@/content";
import { Reveal } from "./reveal";
import { Hexagon } from "./brand";
import { WaveCanvas } from "./cards";

function initials(name: string) {
  return name.split(" ").map((p) => p[0]).slice(0, 2).join("");
}

/**
 * Crew manifest. Not a grid of cards — a single ship's document: a stamped
 * header, column headers, and one ruled row per person, the way a vessel logs
 * who is aboard. Rows highlight and surface the channel (email) on hover.
 */
export function Team() {
  const reduce = useReducedMotion();
  return (
    <section id="team" className="relative overflow-hidden bg-abyss py-24 text-white md:py-32">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand/40 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-brand/25 to-transparent" />
      <WaveCanvas className="opacity-60" />

      <div className="relative mx-auto w-full max-w-5xl px-5 md:px-8">
        <Reveal>
          <div className="relative overflow-hidden rounded-2xl border border-white/12 bg-white/[0.02] backdrop-blur-sm">
            {/* Manifest header — stamped like a document */}
            <div className="flex items-start justify-between gap-4 border-b border-white/12 bg-white/[0.02] px-6 py-5 md:px-8">
              <div>
                <p className="font-mono text-[0.62rem] uppercase tracking-[0.28em] text-brand">
                  Crew manifest
                </p>
                <h2 className="mt-2 font-heading text-2xl font-semibold tracking-tight md:text-3xl">
                  {team.headline}
                </h2>
                <p className="mt-1 font-mono text-[0.62rem] uppercase tracking-[0.14em] text-zinc-500">
                  R/V GlaciaNav · {meta.location}
                </p>
              </div>
              {/* Hex seal */}
              <div className="relative hidden size-20 shrink-0 items-center justify-center sm:flex">
                <motion.div
                  className="absolute inset-0"
                  animate={reduce ? undefined : { rotate: 360 }}
                  transition={{ duration: 60, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                >
                  <Hexagon variant="outline" strokeWidth={1} className="size-full text-brand/30" />
                </motion.div>
                <Hexagon variant="outline" strokeWidth={1.5} className="absolute inset-2 size-[calc(100%-16px)] text-brand/50" />
                <div className="text-center">
                  <span className="block font-mono text-lg font-semibold text-brand-strong">
                    {String(team.members.length).padStart(2, "0")}
                  </span>
                  <span className="block font-mono text-[0.5rem] uppercase tracking-[0.14em] text-zinc-500">
                    aboard
                  </span>
                </div>
              </div>
            </div>

            {/* Column key */}
            <div className="hidden grid-cols-[3rem_auto_1.5fr_1fr_auto] gap-4 px-8 py-3 font-mono text-[0.58rem] uppercase tracking-[0.16em] text-zinc-600 md:grid">
              <span>Desig.</span>
              <span />
              <span>Name</span>
              <span>Station</span>
              <span className="text-right">Channel</span>
            </div>

            {/* Roster rows */}
            <ul>
              {team.members.map((member, i) => (
                <li key={member.email}>
                  <motion.a
                    href={`mailto:${member.email}`}
                    className="group grid grid-cols-[auto_1fr_auto] items-center gap-x-4 border-t border-white/8 px-6 py-5 transition-colors hover:bg-brand/[0.05] focus-visible:bg-brand/[0.05] focus-visible:outline-none md:grid-cols-[3rem_auto_1.5fr_1fr_auto] md:px-8"
                  >
                    <span className="hidden font-mono text-xs text-brand/60 tabular-nums md:block">
                      C·0{i + 1}
                    </span>
                    <span className="relative flex size-11 shrink-0 items-center justify-center">
                      <span className="absolute inset-0 hex-clip bg-brand/12" />
                      <Hexagon variant="outline" strokeWidth={2.5} className="absolute inset-0 size-full text-brand/40 transition-colors group-hover:text-brand" />
                      <span className="relative font-heading text-sm font-semibold text-brand-strong">
                        {initials(member.name)}
                      </span>
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate font-heading text-lg font-semibold text-white">
                        {member.name}
                      </span>
                      <span className="mt-0.5 block font-mono text-[0.68rem] uppercase tracking-[0.1em] text-zinc-400 md:hidden">
                        {member.role}
                      </span>
                    </span>
                    <span className="hidden text-sm text-zinc-400 md:block">{member.role}</span>
                    <span className="inline-flex items-center gap-1.5 justify-self-end font-mono text-[0.65rem] text-zinc-500 transition-colors group-hover:text-brand-strong">
                      <span className="hidden lg:inline">{member.email}</span>
                      <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </span>
                  </motion.a>
                </li>
              ))}
            </ul>

            {/* Manifest footer — signature line */}
            <div className="flex flex-col gap-2 border-t border-white/12 bg-white/[0.02] px-6 py-4 font-mono text-[0.6rem] uppercase tracking-[0.14em] text-zinc-500 sm:flex-row sm:items-center sm:justify-between md:px-8">
              <span>{team.note}</span>
              <span className="text-brand/70">Manifest verified · 2026</span>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
