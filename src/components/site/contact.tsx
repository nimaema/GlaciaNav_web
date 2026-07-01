import { useState, type FormEvent } from "react";
import { ArrowRight, Mail, MapPin } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { contact, meta } from "@/content";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Reveal, Section } from "./reveal";
import { ChartGrid } from "./brand";

/** A small live equalizer — the channel carrier signal. */
function SignalBars() {
  const reduce = useReducedMotion();
  const bars = [0.4, 0.9, 0.6, 1, 0.5, 0.8, 0.35];
  return (
    <span className="flex items-end gap-[3px]" aria-hidden="true">
      {bars.map((b, i) => (
        <motion.span
          key={i}
          className="w-[3px] rounded-full bg-brand"
          style={{ height: 14 }}
          animate={reduce ? { scaleY: b } : { scaleY: [b * 0.4, b, b * 0.5, b * 0.9] }}
          transition={reduce ? undefined : { duration: 1 + i * 0.12, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
        />
      ))}
    </span>
  );
}

export function Contact() {
  const [form, setForm] = useState({ name: "", company: "", email: "", message: "" });

  function update(key: keyof typeof form) {
    return (e: { target: { value: string } }) => setForm((f) => ({ ...f, [key]: e.target.value }));
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const subject = `GlaciaNav inquiry${form.company ? ` from ${form.company}` : ""}`;
    const body = [`Name: ${form.name}`, `Company: ${form.company}`, `Work email: ${form.email}`, "", form.message].join("\n");
    window.location.href = `mailto:${meta.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }

  return (
    <Section id="contact" className="relative overflow-hidden">
      <ChartGrid tone="light" fade="radial" className="opacity-20" />

      <Reveal>
        <div className="mx-auto max-w-4xl overflow-hidden rounded-2xl border border-border bg-card/60 shadow-[0_40px_120px_-40px_color-mix(in_srgb,var(--brand)_40%,transparent)] backdrop-blur">
          {/* Terminal header bar */}
          <div className="flex items-center justify-between gap-4 border-b border-border bg-abyss/60 px-5 py-3.5 md:px-7">
            <span className="inline-flex items-center gap-2.5 font-mono text-[0.62rem] uppercase tracking-[0.18em] text-brand-strong">
              <SignalBars />
              Channel open · 156.8 MHz
            </span>
            <span className="hidden font-mono text-[0.62rem] uppercase tracking-[0.16em] text-muted-foreground sm:inline">
              GlaciaNav · {meta.location} · 60°N
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[0.85fr_1.15fr]">
            {/* Station info */}
            <div className="flex flex-col justify-between gap-8 border-b border-border p-6 md:border-b-0 md:border-r md:p-8">
              <div>
                <h2 className="font-heading text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
                  {contact.headline}
                </h2>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground md:text-base">
                  {contact.subtext}
                </p>
              </div>
              <dl className="flex flex-col gap-3 font-mono text-sm">
                <div className="flex items-center gap-3">
                  <Mail className="size-4 shrink-0 text-brand" strokeWidth={1.75} />
                  <a href={`mailto:${meta.email}`} className="text-brand-strong transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50">
                    {meta.email}
                  </a>
                </div>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <MapPin className="size-4 shrink-0 text-brand" strokeWidth={1.75} />
                  {meta.location}
                </div>
              </dl>
            </div>

            {/* Message composer */}
            <form onSubmit={handleSubmit} className="p-6 md:p-8">
              <p className="mb-5 font-mono text-[0.62rem] uppercase tracking-[0.18em] text-muted-foreground">
                Compose transmission
              </p>
              <FieldGroup>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field>
                    <FieldLabel htmlFor="name" className="font-mono text-[0.68rem] uppercase tracking-[0.12em] text-muted-foreground">Name</FieldLabel>
                    <Input id="name" name="name" autoComplete="name" required value={form.name} onChange={update("name")} placeholder="Your name" />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="company" className="font-mono text-[0.68rem] uppercase tracking-[0.12em] text-muted-foreground">Company</FieldLabel>
                    <Input id="company" name="company" autoComplete="organization" value={form.company} onChange={update("company")} placeholder="Fleet or operator" />
                  </Field>
                </div>
                <Field>
                  <FieldLabel htmlFor="email" className="font-mono text-[0.68rem] uppercase tracking-[0.12em] text-muted-foreground">Work email</FieldLabel>
                  <Input id="email" name="email" type="email" autoComplete="email" required value={form.email} onChange={update("email")} placeholder="you@company.com" />
                </Field>
                <Field>
                  <FieldLabel htmlFor="message" className="font-mono text-[0.68rem] uppercase tracking-[0.12em] text-muted-foreground">Message</FieldLabel>
                  <Textarea id="message" name="message" rows={4} value={form.message} onChange={update("message")} placeholder="Tell us about your fleet and winter routes." />
                </Field>
                <Button type="submit" className="group w-full transition-transform duration-150 active:scale-[0.98]">
                  Transmit message
                  <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                </Button>
              </FieldGroup>
            </form>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
