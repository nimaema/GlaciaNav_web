import { useState, type FormEvent } from "react";
import { ArrowRight, Mail, MapPin } from "lucide-react";
import { LinkedInIcon } from "./brand";
import { contact, meta } from "@/content";
import { Reveal, Section, SectionHead } from "./reveal";
import { DataLabel } from "./brand";

/**
 * Contact: an open survey form on the deep band. No boxed card; mono field
 * labels over underlined inputs, the underline turning cyan on focus. The
 * fastest path from a fleet operator to the team's inbox.
 */

const fieldBase =
  "w-full rounded-none border-0 border-b border-ink/30 bg-transparent px-0 py-2.5 text-base text-ink placeholder:text-ink-faint transition-colors focus:border-b-2 focus:border-mask-ink focus-visible:outline-none";

function FieldLabel({ htmlFor, children }: { htmlFor: string; children: string }) {
  return (
    <label
      htmlFor={htmlFor}
      className="font-mono text-[0.64rem] uppercase tracking-[0.14em] text-ink-soft"
    >
      {children}
    </label>
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
    <Section id="contact" className="relative overflow-hidden border-t border-ink/15 bg-paper-deep">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        {/* The invitation + direct lines */}
        <Reveal>
          <SectionHead title={contact.headline} intro={contact.subtext} />
          <dl className="mt-10 flex flex-col gap-4 border-t border-ink/15 pt-8">
            <div className="flex items-center gap-3">
              <Mail className="size-4 shrink-0 text-ink" strokeWidth={1.75} />
              <a
                href={`mailto:${meta.email}`}
                className="font-mono text-sm text-ink underline decoration-mask decoration-2 underline-offset-4 transition-opacity hover:opacity-75 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
              >
                {meta.email}
              </a>
            </div>
            <div className="flex items-center gap-3">
              <LinkedInIcon className="size-4 shrink-0 text-ink" />
              <a
                href={meta.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-sm text-ink underline decoration-mask decoration-2 underline-offset-4 transition-opacity hover:opacity-75 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
              >
                linkedin.com/company/glacianav
              </a>
            </div>
            <div className="flex items-center gap-3 font-mono text-sm text-ink-soft">
              <MapPin className="size-4 shrink-0 text-ink" strokeWidth={1.75} />
              {meta.location}
            </div>
          </dl>
        </Reveal>

        {/* The form */}
        <Reveal delay={0.1}>
          <form onSubmit={handleSubmit}>
            <DataLabel className="text-mask-ink">New inquiry</DataLabel>
            <div className="mt-6 grid grid-cols-1 gap-x-8 gap-y-7 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <FieldLabel htmlFor="name">Name</FieldLabel>
                <input
                  id="name"
                  name="name"
                  autoComplete="name"
                  required
                  value={form.name}
                  onChange={update("name")}
                  placeholder="Your name"
                  className={fieldBase}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <FieldLabel htmlFor="company">Company</FieldLabel>
                <input
                  id="company"
                  name="company"
                  autoComplete="organization"
                  value={form.company}
                  onChange={update("company")}
                  placeholder="Fleet or operator"
                  className={fieldBase}
                />
              </div>
              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <FieldLabel htmlFor="email">Work email</FieldLabel>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={form.email}
                  onChange={update("email")}
                  placeholder="you@company.com"
                  className={fieldBase}
                />
              </div>
              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <FieldLabel htmlFor="message">Message</FieldLabel>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  value={form.message}
                  onChange={update("message")}
                  placeholder="Tell us about your fleet and where you sail in winter."
                  className={`${fieldBase} resize-none leading-relaxed`}
                />
              </div>
            </div>
            <button
              type="submit"
              className="group mt-9 inline-flex h-11 items-center justify-center gap-2 rounded-sm bg-primary px-7 text-sm font-semibold text-primary-foreground transition-transform duration-150 hover:brightness-105 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
            >
              Send inquiry
              <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
            </button>
          </form>
        </Reveal>
      </div>
    </Section>
  );
}
