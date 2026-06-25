import { TrendingDown, Leaf, ShieldCheck, Crosshair } from "lucide-react";
import { solution } from "@/content";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Reveal, Section, SectionHead } from "./reveal";

const benefitIcons = [TrendingDown, Leaf, ShieldCheck];

export function Solution() {
  return (
    <Section id="solution" className="bg-card">
      <Reveal>
        <SectionHead title={solution.headline} intro={solution.subtext} />
      </Reveal>

      <div className="mt-14 grid grid-cols-1 gap-x-12 gap-y-12 lg:grid-cols-12">
        {/* Left: benefits + flagship */}
        <div className="lg:col-span-7">
          <Reveal>
            <ul className="flex flex-col divide-y divide-border">
              {solution.benefits.map((b, i) => {
                const Icon = benefitIcons[i];
                return (
                  <li key={b.title} className="flex items-start gap-4 py-4 first:pt-0">
                    <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg bg-secondary text-brand-strong">
                      <Icon className="size-[18px]" strokeWidth={1.75} />
                    </span>
                    <div>
                      <p className="font-heading font-semibold text-foreground">
                        {b.title}
                      </p>
                      <p className="text-sm text-muted-foreground">{b.note}</p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </Reveal>

          {/* Flagship feature */}
          <Reveal delay={0.05}>
            <div className="mt-8 rounded-2xl border border-brand/25 bg-brand-surface/60 p-6 md:p-7">
              <div className="flex items-center gap-2.5">
                <Crosshair className="size-5 text-brand-strong" strokeWidth={1.75} />
                <span className="font-mono text-xs uppercase tracking-[0.18em] text-brand-strong">
                  Flagship
                </span>
              </div>
              <h3 className="mt-3 font-heading text-2xl font-semibold text-foreground">
                {solution.flagship.title}
              </h3>
              <p className="mt-3 max-w-xl leading-relaxed text-muted-foreground">
                {solution.flagship.body}
              </p>
            </div>
          </Reveal>
        </div>

        {/* Right: how it works */}
        <div className="lg:col-span-5">
          <Reveal delay={0.1}>
            <p className="mb-2 font-heading text-sm font-semibold text-foreground">
              How it works
            </p>
            <Accordion type="single" collapsible defaultValue="item-0">
              {solution.howItWorks.map((item, i) => (
                <AccordionItem key={item.title} value={`item-${i}`}>
                  <AccordionTrigger className="text-left font-heading text-base font-medium hover:no-underline">
                    {item.title}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                    {item.body}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
