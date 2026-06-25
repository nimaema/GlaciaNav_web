import { RefreshCw, Percent, Plus, Check } from "lucide-react";
import { businessModel } from "@/content";
import { Reveal, Section, SectionHead } from "./reveal";
import { HexIcon, MarkWatermark } from "./brand";
import { TiltCard } from "./cards";

const streamIcons = [RefreshCw, Percent];

function Stream({ index }: { index: number }) {
  const stream = businessModel.streams[index];
  const Icon = streamIcons[index];
  return (
    <TiltCard className="h-full">
      <div className="flex items-center justify-between">
        <HexIcon tone="glass" className="size-12">
          <Icon className="size-5" strokeWidth={1.75} />
        </HexIcon>
        <span className="rounded-full border border-white/15 bg-white/[0.04] px-3 py-1 font-mono text-[0.65rem] uppercase tracking-[0.14em] text-brand">
          {stream.tag}
        </span>
      </div>
      <h3 className="mt-5 font-heading text-xl font-semibold text-white">{stream.title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-zinc-300">{stream.body}</p>
      <ul className="mt-5 flex flex-col gap-2.5 border-t border-white/10 pt-5">
        {stream.points.map((point) => (
          <li key={point} className="flex items-center gap-2.5 text-sm text-zinc-200">
            <Check className="size-4 shrink-0 text-brand" strokeWidth={2.25} />
            {point}
          </li>
        ))}
      </ul>
    </TiltCard>
  );
}

export function BusinessModel() {
  return (
    <Section id="business">
      <Reveal>
        <SectionHead title={businessModel.headline} intro={businessModel.subtext} />
      </Reveal>

      <Reveal delay={0.05}>
        <div className="mt-12 grid grid-cols-1 items-center gap-6 md:grid-cols-[1fr_auto_1fr]">
          <Stream index={0} />
          <div className="flex items-center justify-center">
            <span className="flex size-12 items-center justify-center rounded-full border border-brand/30 bg-brand-surface text-brand-strong">
              <Plus className="size-5" />
            </span>
          </div>
          <Stream index={1} />
        </div>
      </Reveal>

      {/* Pull quote */}
      <Reveal delay={0.1}>
        <div className="relative mt-8 overflow-hidden rounded-3xl border border-brand/20 bg-gradient-to-br from-brand-surface to-card px-7 py-12 text-center md:py-16">
          <MarkWatermark
            src="/favicon.svg"
            className="absolute -right-10 -top-10 w-48 opacity-[0.06]"
          />
          <MarkWatermark
            src="/favicon.svg"
            className="absolute -bottom-12 -left-10 w-44 opacity-[0.05]"
          />
          <p className="relative mx-auto max-w-3xl text-balance font-heading text-2xl font-medium leading-snug tracking-tight text-foreground md:text-[2rem]">
            “{businessModel.pullQuote}”
          </p>
        </div>
      </Reveal>
    </Section>
  );
}
