import { meta } from "@/content";

export function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-5 py-10 md:flex-row md:items-center md:justify-between md:px-8">
        <div className="flex flex-col gap-3">
          <img src="/logo-horizontal.svg" alt="GlaciaNav" className="h-7 w-auto" />
          <p className="max-w-xs text-sm text-muted-foreground">{meta.tagline}</p>
        </div>

        <div className="flex flex-col gap-1.5 text-sm text-muted-foreground md:items-end">
          <a
            href={`mailto:${meta.email}`}
            className="rounded-md font-medium text-brand-strong transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
          >
            {meta.email}
          </a>
          <span>{meta.location}</span>
          <span className="font-mono text-xs text-muted-foreground">
            Last updated {meta.lastUpdated}
          </span>
          <span className="text-xs text-muted-foreground">
            © 2026 {meta.name}
          </span>
        </div>
      </div>
    </footer>
  );
}
