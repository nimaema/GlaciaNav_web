import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { Menu, X } from "lucide-react";
import { nav, hero } from "@/content";
import { cn } from "@/lib/utils";

const focusRing =
  "focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50";

/**
 * Floe nav: a slim survey-sheet header. Ink wordmark, mono section links with a
 * chartreuse indicator that slides under the active section, mask-filled CTA.
 */
export function Nav() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<number | null>(null);
  const [hover, setHover] = useState<number | null>(null);

  // Reading progress through the survey, drawn as a mask hairline under the bar.
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 28, restDelta: 0.001 });

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

  // Slide the mask indicator under the hovered link, or the active section.
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
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border bg-paper/85 backdrop-blur-md">
      <motion.span
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-[2px] origin-left bg-mask"
        style={{ scaleX: progress }}
      />
      <nav className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-5 md:px-8">
        <a
          href="#top"
          className={cn("flex shrink-0 items-center gap-2.5", focusRing)}
          aria-label="GlaciaNav home"
        >
          <img src="/logo-icon.svg" alt="" aria-hidden="true" className="h-6 w-auto" />
          <span className="display-condensed text-lg font-extrabold text-ink">
            GlaciaNav
          </span>
        </a>

        {/* Links with sliding mask underline */}
        <div
          ref={containerRef}
          onMouseLeave={() => setHover(null)}
          className="relative hidden h-full items-stretch md:flex"
        >
          <motion.span
            aria-hidden="true"
            className="absolute bottom-0 h-[3px] bg-mask"
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
                "relative z-10 flex items-center px-3.5 font-mono text-[0.72rem] uppercase tracking-[0.12em] transition-colors",
                target === index ? "text-ink" : "text-ink-soft hover:text-ink",
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
            "hidden h-9 shrink-0 items-center rounded-sm bg-primary px-4 text-sm font-semibold text-primary-foreground transition-transform duration-150 hover:brightness-105 active:scale-[0.98] md:inline-flex",
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
            "inline-flex size-9 items-center justify-center rounded-sm text-ink md:hidden",
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
        <div className="border-t border-border bg-paper px-4 py-3 md:hidden">
          <ul className="flex flex-col">
            {nav.map((item, index) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "block border-b border-border px-1 py-3.5 font-mono text-[0.78rem] uppercase tracking-[0.12em] transition-colors",
                    active === index ? "text-ink" : "text-ink-soft",
                    focusRing
                  )}
                >
                  <span className={active === index ? "mask-highlight" : undefined}>
                    {item.label}
                  </span>
                </a>
              </li>
            ))}
            <li className="pt-3">
              <a
                href="#contact"
                onClick={() => setOpen(false)}
                className={cn(
                  "flex h-11 items-center justify-center rounded-sm bg-primary px-4 text-sm font-semibold text-primary-foreground",
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
