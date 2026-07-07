import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { nav, hero } from "@/content";
import { cn } from "@/lib/utils";

const focusRing =
  "focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50";

export function Nav() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<number | null>(null);
  const [hover, setHover] = useState<number | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const linkRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const [indicator, setIndicator] = useState({ left: 0, width: 0, opacity: 0 });

  // Scrollspy: the active link follows the section currently in view.
  useEffect(() => {
    const sections = nav.map((n) => document.getElementById(n.href.slice(1)));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = sections.indexOf(entry.target as HTMLElement);
            if (idx !== -1) setActive(idx);
          }
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );
    sections.forEach((s) => s && observer.observe(s));
    return () => observer.disconnect();
  }, []);

  // Slide the indicator to the hovered link, or the active section.
  useEffect(() => {
    const target = hover ?? active;
    const update = () => {
      const btn = target != null ? linkRefs.current[target] : null;
      if (!btn || !containerRef.current) {
        setIndicator((i) => ({ ...i, opacity: 0 }));
        return;
      }
      const b = btn.getBoundingClientRect();
      const c = containerRef.current.getBoundingClientRect();
      setIndicator({ left: b.left - c.left, width: b.width, opacity: 1 });
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [hover, active]);

  const target = hover ?? active;

  return (
    <header className="fixed inset-x-0 top-4 z-50 flex justify-center px-4">
      <nav className="flex w-full max-w-2xl items-center justify-between gap-2 rounded-full border border-border/70 bg-background/75 p-1.5 pl-2.5 shadow-[0_8px_30px_-12px_rgba(2,108,122,0.25)] backdrop-blur-xl md:w-auto md:gap-4">
        <a
          href="#top"
          className={cn("flex shrink-0 items-center gap-2 rounded-full pl-0.5", focusRing)}
          aria-label="GlaciaNav home"
        >
          <img
            src="/logo-icon-white-arrow.svg"
            alt=""
            aria-hidden="true"
            className="h-6 w-auto md:h-7"
          />
          <span className="font-heading text-base font-semibold tracking-tight text-foreground md:text-lg">
            GlaciaNav
          </span>
        </a>

        {/* Links with sliding indicator */}
        <div
          ref={containerRef}
          onMouseLeave={() => setHover(null)}
          className="relative hidden items-center md:flex"
        >
          <motion.span
            aria-hidden="true"
            className="absolute top-1/2 -z-0 h-9 -translate-y-1/2 rounded-full bg-brand/12"
            animate={{ left: indicator.left, width: indicator.width, opacity: indicator.opacity }}
            transition={{ type: "spring", stiffness: 400, damping: 32 }}
          />
          {nav.map((item, index) => (
            <a
              key={item.href}
              ref={(el) => {
                linkRefs.current[index] = el;
              }}
              href={item.href}
              onMouseEnter={() => setHover(index)}
              className={cn(
                "relative z-10 rounded-full px-3.5 py-2 text-sm font-medium transition-colors",
                target === index
                  ? "text-brand-strong"
                  : "text-muted-foreground hover:text-foreground",
                focusRing
              )}
            >
              {item.label}
            </a>
          ))}
        </div>

        <a
          href="#contact"
          className={cn(
            "hidden h-9 shrink-0 items-center rounded-full bg-primary px-4 text-sm font-medium text-primary-foreground transition-transform duration-150 hover:bg-primary/90 active:scale-[0.98] md:inline-flex",
            focusRing
          )}
        >
          {hero.primaryCta}
        </a>

        {/* Mobile toggle */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className={cn(
            "inline-flex size-9 items-center justify-center rounded-full text-foreground md:hidden",
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
        <div className="absolute inset-x-4 top-[4.5rem] rounded-2xl border border-border bg-background/95 p-2 shadow-xl backdrop-blur-xl md:hidden">
          <ul className="flex flex-col gap-1">
            {nav.map((item, index) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "block rounded-xl px-3 py-3 text-sm font-medium transition-colors",
                    active === index
                      ? "bg-brand/12 text-brand-strong"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground",
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
                  "flex h-11 items-center justify-center rounded-xl bg-primary px-4 text-sm font-medium text-primary-foreground",
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
