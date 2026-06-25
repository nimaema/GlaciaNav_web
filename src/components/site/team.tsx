import { Mail } from "lucide-react";
import { team } from "@/content";
import { Reveal, Stagger, StaggerItem } from "./reveal";
import { Hexagon, HexMarker } from "./brand";
import { WaveCanvas } from "./cards";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("");
}

export function Team() {
  return (
    <section
      id="team"
      className="relative overflow-hidden bg-[#08171b] py-24 text-white md:py-32"
    >
      {/* Seams + animated currents */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-[#f7fafb] to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#f7fafb] to-transparent" />
      <WaveCanvas className="opacity-70" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 size-[36rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,color-mix(in_srgb,var(--brand)_14%,transparent),transparent_70%)] blur-2xl" />

      <div className="relative mx-auto w-full max-w-6xl px-5 md:px-8">
        <Reveal>
          <p className="inline-flex items-center gap-2 font-mono text-[0.7rem] uppercase tracking-[0.25em] text-brand">
            <HexMarker />
            The crew
          </p>
          <h2 className="mt-4 font-heading text-3xl font-semibold tracking-tight md:text-4xl">
            {team.headline}
          </h2>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-zinc-300 md:text-lg">
            {team.note}
          </p>
        </Reveal>

        <TooltipProvider delayDuration={150}>
          <Stagger className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {team.members.map((member) => (
              <StaggerItem key={member.email} className="h-full">
                <div className="group flex h-full flex-col items-start rounded-2xl border border-white/10 bg-white/[0.05] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-brand/40 hover:bg-white/[0.08] hover:shadow-[0_24px_48px_-24px_color-mix(in_srgb,var(--brand)_45%,transparent)]">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="relative flex size-16 items-center justify-center">
                        <Avatar className="size-16 rounded-none hex-clip bg-brand/15">
                          <AvatarImage className="rounded-none" />
                          <AvatarFallback className="rounded-none bg-transparent font-heading text-lg font-semibold text-brand">
                            {initials(member.name)}
                          </AvatarFallback>
                        </Avatar>
                        <Hexagon
                          variant="outline"
                          strokeWidth={3}
                          className="pointer-events-none absolute inset-0 size-full text-brand/50 transition-colors duration-300 group-hover:text-brand"
                        />
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>{member.email}</TooltipContent>
                  </Tooltip>

                  <p className="mt-5 font-heading text-lg font-semibold text-white">
                    {member.name}
                  </p>
                  <p className="text-sm text-zinc-400">{member.role}</p>
                  <a
                    href={`mailto:${member.email}`}
                    className="mt-4 inline-flex items-center gap-1.5 rounded-md text-sm font-medium text-brand transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
                  >
                    <Mail className="size-4" strokeWidth={1.75} />
                    Email
                  </a>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </TooltipProvider>
      </div>
    </section>
  );
}
