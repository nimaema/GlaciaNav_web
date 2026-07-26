import { ArrowUpRight } from "lucide-react";
import { team } from "@/content";
import { Reveal, SectionHead, Stagger, StaggerItem } from "./reveal";
import { PlateFrame } from "./brand";

/**
 * The team, presented as survey specimens: grayscale portraits on plates,
 * captioned below. Hover detects a person: the photo gains full color and the
 * chartreuse registration frame locks on.
 */
export function Team() {
  return (
    <section id="team" className="scroll-mt-20 border-y border-ink/15 bg-paper-deep py-20 md:py-28">
      <div className="mx-auto w-full max-w-6xl px-5 md:px-8">
        <Reveal>
          <SectionHead title={team.headline} intro={team.note} />
        </Reveal>

        <Stagger className="mt-12 grid grid-cols-2 gap-5 md:gap-6 lg:grid-cols-4">
          {team.members.map((member) => (
            <StaggerItem key={member.email}>
              <a
                href={`mailto:${member.email}`}
                aria-label={`Email ${member.name}`}
                className="group block focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
              >
                <div className="relative aspect-[4/5] overflow-hidden rounded-lg border border-ink/70 bg-plate">
                  <img
                    src={member.photo}
                    alt={member.name}
                    loading="lazy"
                    style={{ objectPosition: member.focus }}
                    className="absolute inset-0 size-full object-cover grayscale transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03] group-hover:grayscale-0"
                  />
                  <PlateFrame
                    tone="mask"
                    className="m-2.5 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  />
                </div>
                <div className="mt-3 flex items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold leading-tight text-ink">{member.name}</p>
                    <p className="mt-0.5 font-mono text-[0.62rem] uppercase tracking-[0.12em] text-ink-soft">
                      {member.role}
                    </p>
                  </div>
                  <ArrowUpRight className="mt-0.5 size-4 shrink-0 text-ink-faint transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-mask-ink" />
                </div>
              </a>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
