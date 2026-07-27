import { useState, type FormEvent } from "react";
import { ArrowRight, Mail, MapPin } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { contact, meta } from "@/content";
import { Reveal, Section } from "./reveal";
import { DataLabel, LinkedInIcon } from "./brand";

/**
 * Contact: a survey requisition. Fields are numbered like entries on a form
 * and rule out when filled, the sequence that follows a submission is stated
 * plainly, and the direct lines sit alongside so nobody has to use the form
 * to reach the team.
 */

const FIELDS = [
  { id: "name", no: "01", label: "Name", placeholder: "Your name", required: true, span: 1 },
  { id: "company", no: "02", label: "Company", placeholder: "Fleet or operator", required: false, span: 1 },
  { id: "email", no: "03", label: "Work email", placeholder: "you@company.com", required: true, span: 2, type: "email" },
] as const;

const NEXT = [
  { no: "01", title: "We read it", body: "A member of the team, not an autoresponder." },
  { no: "02", title: "We reply within two working days", body: "With a straight answer on whether we can help." },
  { no: "03", title: "We look at your winter", body: "Your routes, your season, what the ice does to them." },
];

export function Contact() {
  const reduce = useReducedMotion();
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

  const filled = (k: keyof typeof form) => form[k].trim().length > 0;

  return (
    <Section id="contact" className="relative overflow-hidden border-t border-ink/15 bg-paper-deep">
      {/* Header spans the full width, so the form below can breathe */}
      <Reveal>
        <div className="flex flex-col gap-6 border-b-2 border-ink pb-8 md:flex-row md:items-end md:justify-between">
          <div>
            <DataLabel className="text-mask-ink">New inquiry</DataLabel>
            <h2 className="display-condensed mt-3 text-4xl font-extrabold leading-[0.95] text-ink md:text-5xl">
              {contact.headline}
            </h2>
          </div>
          <p className="max-w-sm text-base leading-relaxed text-ink-soft">{contact.subtext}</p>
        </div>
      </Reveal>

      <div className="grid grid-cols-1 gap-12 pt-12 lg:grid-cols-[1.35fr_1fr] lg:gap-20">
        {/* The requisition */}
        <Reveal>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-x-10 sm:grid-cols-2">
              {FIELDS.map((f) => (
                <div
                  key={f.id}
                  className={`flex flex-col gap-1.5 border-t border-ink/20 py-5 ${
                    f.span === 2 ? "sm:col-span-2" : ""
                  }`}
                >
                  <label
                    htmlFor={f.id}
                    className="flex items-center gap-2.5 font-mono text-[0.62rem] uppercase tracking-[0.16em] text-ink-soft"
                  >
                    <span className="text-ink-faint tabular-nums">{f.no}</span>
                    {f.label}
                    {f.required ? <span className="text-mask-ink">*</span> : null}
                  </label>
                  <div className="relative">
                    <input
                      id={f.id}
                      name={f.id}
                      type={"type" in f ? f.type : "text"}
                      autoComplete={f.id === "email" ? "email" : f.id === "company" ? "organization" : "name"}
                      required={f.required}
                      value={form[f.id as keyof typeof form]}
                      onChange={update(f.id as keyof typeof form)}
                      placeholder={f.placeholder}
                      className="peer w-full rounded-none border-0 bg-transparent px-0 py-1.5 text-lg text-ink placeholder:text-ink-faint focus:outline-none"
                    />
                    {/* the rule fills in as the entry is made */}
                    <span className="absolute inset-x-0 bottom-0 h-px bg-ink/25" />
                    <motion.span
                      className="absolute inset-x-0 bottom-0 h-[2px] origin-left bg-mask"
                      initial={false}
                      animate={{ scaleX: filled(f.id as keyof typeof form) ? 1 : 0 }}
                      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    />
                    <span className="absolute inset-x-0 bottom-0 h-[2px] origin-left scale-x-0 bg-mask-ink transition-transform duration-300 peer-focus:scale-x-100" />
                  </div>
                </div>
              ))}

              {/* Message */}
              <div className="flex flex-col gap-1.5 border-y border-ink/20 py-5 sm:col-span-2">
                <label
                  htmlFor="message"
                  className="flex items-center gap-2.5 font-mono text-[0.62rem] uppercase tracking-[0.16em] text-ink-soft"
                >
                  <span className="text-ink-faint tabular-nums">04</span>
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  value={form.message}
                  onChange={update("message")}
                  placeholder="Tell us about your fleet and where you sail in winter."
                  className="w-full resize-none rounded-none border-0 bg-transparent px-0 py-1.5 text-base leading-relaxed text-ink placeholder:text-ink-faint focus:outline-none"
                />
              </div>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
              <button
                type="submit"
                className="group inline-flex h-12 items-center justify-center gap-2 rounded-sm bg-primary px-8 text-sm font-semibold text-primary-foreground transition-transform duration-150 hover:brightness-105 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
              >
                Send inquiry
                <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
              </button>
              <span className="font-mono text-[0.62rem] uppercase tracking-[0.12em] text-ink-faint">
                Opens in your mail client
              </span>
            </div>
          </form>
        </Reveal>

        {/* What follows, and how to skip the form entirely */}
        <Reveal delay={0.1}>
          <div className="lg:pt-1">
            <DataLabel>What happens next</DataLabel>
            <ol className="mt-5">
              {NEXT.map((n, i) => (
                <motion.li
                  key={n.no}
                  className="flex gap-4 border-t border-ink/15 py-4 last:border-b"
                  initial={reduce ? false : { opacity: 0, x: 8 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.45 }}
                >
                  <span className="mt-0.5 font-mono text-[0.62rem] tracking-[0.1em] text-mask-ink tabular-nums">
                    {n.no}
                  </span>
                  <span>
                    <span className="block font-semibold text-ink">{n.title}</span>
                    <span className="mt-0.5 block text-sm leading-relaxed text-ink-soft">
                      {n.body}
                    </span>
                  </span>
                </motion.li>
              ))}
            </ol>

            <div className="mt-10">
              <DataLabel>Direct</DataLabel>
              <div className="mt-4 flex flex-col gap-px overflow-hidden rounded-lg border border-ink/25 bg-ink/10">
                <a
                  href={`mailto:${meta.email}`}
                  className="group flex items-center gap-3 bg-plate px-4 py-3.5 transition-colors hover:bg-paper focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
                >
                  <Mail className="size-4 shrink-0 text-ink" strokeWidth={1.75} />
                  <span className="font-mono text-sm text-ink">{meta.email}</span>
                  <ArrowRight className="ml-auto size-4 shrink-0 text-ink-faint transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-mask-ink" />
                </a>
                <a
                  href={meta.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-3 bg-plate px-4 py-3.5 transition-colors hover:bg-paper focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
                >
                  <LinkedInIcon className="size-4 shrink-0 text-ink" />
                  <span className="font-mono text-sm text-ink">linkedin.com/company/glacianav</span>
                  <ArrowRight className="ml-auto size-4 shrink-0 -rotate-45 text-ink-faint transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:text-mask-ink" />
                </a>
                <div className="flex items-center gap-3 bg-plate px-4 py-3.5">
                  <MapPin className="size-4 shrink-0 text-ink" strokeWidth={1.75} />
                  <span className="font-mono text-sm text-ink-soft">{meta.location}</span>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
