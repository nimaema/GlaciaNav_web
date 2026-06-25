import { RefreshCw, Percent, Plus } from "lucide-react";
import { businessModel } from "@/content";
import { Reveal, Section, SectionHead } from "./reveal";

const streamIcons = [RefreshCw, Percent];

function Stream({ index }: { index: number }) {
  const stream = businessModel.streams[index];
  const Icon = streamIcons[index];
  return (
    <div className="rounded-2xl border border-border bg-card p-7">
      <span className="flex size-10 items-center justify-center rounded-lg bg-secondary text-brand-strong">
        <Icon className="size-[18px]" strokeWidth={1.75} />
      </span>
      <h3 className="mt-5 font-heading text-xl font-semibold text-foreground">
        {stream.title}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        {stream.body}
      </p>
    </div>
  );
}

export function BusinessModel() {
  return (
    <Section id="business">
      <Reveal>
        <SectionHead title={businessModel.headline} />
      </Reveal>

      <Reveal delay={0.05}>
        <div className="mt-12 grid grid-cols-1 items-center gap-6 md:grid-cols-[1fr_auto_1fr]">
          <Stream index={0} />
          <div className="flex items-center justify-center">
            <span className="flex size-10 items-center justify-center rounded-full border border-border bg-background text-muted-foreground">
              <Plus className="size-4" />
            </span>
          </div>
          <Stream index={1} />
        </div>
      </Reveal>

      <Reveal delay={0.1}>
        <p className="mx-auto mt-12 max-w-3xl text-balance text-center font-heading text-2xl font-medium leading-snug tracking-tight text-foreground md:text-3xl">
          “{businessModel.pullQuote}”
        </p>
      </Reveal>
    </Section>
  );
}
