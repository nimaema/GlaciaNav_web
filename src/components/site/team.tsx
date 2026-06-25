import { Mail } from "lucide-react";
import { team } from "@/content";
import { Reveal, Section, SectionHead, Stagger, StaggerItem } from "./reveal";

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("");
}

export function Team() {
  return (
    <Section id="team" className="bg-card">
      <Reveal>
        <SectionHead title={team.headline} intro={team.note} />
      </Reveal>

      <Stagger className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {team.members.map((member) => (
          <StaggerItem key={member.email}>
            <div className="flex h-full flex-col rounded-2xl border border-border bg-card p-6 transition-colors hover:border-brand/40">
              <span className="flex size-12 items-center justify-center rounded-full bg-secondary font-heading text-base font-semibold text-brand-strong">
                {initials(member.name)}
              </span>
              <p className="mt-5 font-heading text-lg font-semibold text-foreground">
                {member.name}
              </p>
              <p className="text-sm text-muted-foreground">{member.role}</p>
              <a
                href={`mailto:${member.email}`}
                className="mt-4 inline-flex items-center gap-1.5 rounded-md text-sm font-medium text-brand-strong transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
              >
                <Mail className="size-4" strokeWidth={1.75} />
                Email
              </a>
            </div>
          </StaggerItem>
        ))}
      </Stagger>
    </Section>
  );
}
