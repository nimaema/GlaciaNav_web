import { useState, type FormEvent } from "react";
import { ArrowRight, Mail } from "lucide-react";
import { contact, meta } from "@/content";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Reveal, Section } from "./reveal";

export function Contact() {
  const [form, setForm] = useState({
    name: "",
    company: "",
    email: "",
    message: "",
  });

  function update(key: keyof typeof form) {
    return (e: { target: { value: string } }) =>
      setForm((f) => ({ ...f, [key]: e.target.value }));
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const subject = `Baltic Beta inquiry${form.company ? ` from ${form.company}` : ""}`;
    const body = [
      `Name: ${form.name}`,
      `Company: ${form.company}`,
      `Work email: ${form.email}`,
      "",
      form.message,
    ].join("\n");
    window.location.href = `mailto:${meta.email}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
  }

  return (
    <Section id="contact">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
        <Reveal>
          <h2 className="font-heading text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
            {contact.headline}
          </h2>
          <p className="mt-4 max-w-md text-base leading-relaxed text-muted-foreground md:text-lg">
            {contact.subtext}
          </p>
          <a
            href={`mailto:${meta.email}`}
            className="mt-6 inline-flex items-center gap-2 rounded-md text-sm font-medium text-brand-strong transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
          >
            <Mail className="size-4" strokeWidth={1.75} />
            {meta.email}
          </a>
        </Reveal>

        <Reveal delay={0.08}>
          <form
            onSubmit={handleSubmit}
            className="rounded-2xl border border-border bg-card p-6 md:p-8"
          >
            <FieldGroup>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field>
                  <FieldLabel htmlFor="name">Name</FieldLabel>
                  <Input
                    id="name"
                    name="name"
                    autoComplete="name"
                    required
                    value={form.name}
                    onChange={update("name")}
                    placeholder="Your name"
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="company">Company</FieldLabel>
                  <Input
                    id="company"
                    name="company"
                    autoComplete="organization"
                    value={form.company}
                    onChange={update("company")}
                    placeholder="Fleet or operator"
                  />
                </Field>
              </div>
              <Field>
                <FieldLabel htmlFor="email">Work email</FieldLabel>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={form.email}
                  onChange={update("email")}
                  placeholder="you@company.com"
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="message">Message</FieldLabel>
                <Textarea
                  id="message"
                  name="message"
                  rows={4}
                  value={form.message}
                  onChange={update("message")}
                  placeholder="Tell us about your fleet and winter routes."
                />
              </Field>
              <Button
                type="submit"
                className="group w-full transition-transform duration-150 active:scale-[0.98]"
              >
                {contact.headline}
                <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
              </Button>
            </FieldGroup>
          </form>
        </Reveal>
      </div>
    </Section>
  );
}
