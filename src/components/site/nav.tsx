import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { nav, hero } from "@/content";
import { cn } from "@/lib/utils";

// Match the focus treatment shadcn components use elsewhere in the app.
const focusRing =
  "focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50";

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-300",
        scrolled
          ? "border-b border-border/70 bg-background/80 backdrop-blur-md"
          : "border-b border-transparent"
      )}
    >
      <nav className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-5 md:px-8">
        <a
          href="#top"
          className={cn("flex items-center rounded-md", focusRing)}
          aria-label="GlaciaNav home"
        >
          <img
            src="/logo-horizontal.svg"
            alt="GlaciaNav"
            className="h-7 w-auto md:h-8"
          />
        </a>

        <div className="hidden items-center gap-8 md:flex">
          <ul className="flex items-center gap-7">
            {nav.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className={cn(
                    "rounded-md text-sm font-medium text-muted-foreground transition-colors hover:text-foreground",
                    focusRing
                  )}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
          <a
            href="#contact"
            className={cn(
              "inline-flex h-9 items-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-transform duration-150 hover:bg-primary/90 active:scale-[0.98]",
              focusRing
            )}
          >
            {hero.primaryCta}
          </a>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className={cn(
            "inline-flex size-11 items-center justify-center rounded-lg text-foreground md:hidden",
            focusRing
          )}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </nav>

      {/* Mobile menu */}
      {open ? (
        <div className="border-t border-border bg-background/95 backdrop-blur md:hidden">
          <ul className="mx-auto flex max-w-6xl flex-col gap-1 px-5 py-3">
            {nav.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "block rounded-md px-2 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground",
                    focusRing
                  )}
                >
                  {item.label}
                </a>
              </li>
            ))}
            <li className="pt-1">
              <a
                href="#contact"
                onClick={() => setOpen(false)}
                className={cn(
                  "flex h-11 items-center justify-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground",
                  focusRing
                )}
              >
                {hero.primaryCta}
              </a>
            </li>
          </ul>
        </div>
      ) : null}
    </header>
  );
}
