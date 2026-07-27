import { useEffect, useRef, useState } from "react";
import { motion, useMotionValueEvent, useScroll, useSpring } from "framer-motion";
import { Menu, X } from "lucide-react";
import { nav, hero, meta } from "@/content";
import { cn } from "@/lib/utils";

const focusRing =
  "focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50";

/**
 * Floe nav: the survey sheet's header rule.
 *
 * At the top of the page it stands tall and carries the station identity; once
 * you start reading it compacts to a working strip and the section index takes
 * over. Sections are numbered because the page really is a sequence, the
 * active one is marked by a cyan rule, and a hairline across the foot of the
 * bar reports how far through the survey you are.
 */
export function Nav() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<number | null>(null);
  const [hover, setHover] = useState<number | null>(null);
  const [compact, setCompact] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const linkRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const [indicator, setIndicator] = useState({ left: 0, width: 0, opacity: 0 });

  // Reading progress through the survey.
  const { scrollY, scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 28, restDelta: 0.001 });
  useMotionValueEvent(scrollY, "change", (y) => setCompact(y > 80));

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
  }, [hover, active, compact]);

  const target = hover ?? active;

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 border-b bg-paper/85 backdrop-blur-md transition-[border-color,box-shadow] duration-300",
        compact ? "border-ink/25 shadow-[0_1px_12px_-6px_rgba(11,36,48,0.35)]" : "border-border"
      )}
    >
      <motion.span
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 z-10 h-[2px] origin-left bg-mask"
        style={{ scaleX: progress }}
      />

      <motion.nav
        className="mx-auto flex w-full max-w-6xl items-center justify-between gap-6 px-5 md:px-8"
        animate={{ height: compact ? 60 : 82 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Station identity */}
        <a
          href="#top"
          className={cn("flex shrink-0 items-center gap-3", focusRing)}
          aria-label="GlaciaNav home"
        >
          <motion.img
            src="/logo-icon.svg"
            alt=""
            aria-hidden="true"
            className="w-auto"
            animate={{ height: compact ? 24 : 30 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          />
          <span className="flex flex-col justify-center">
            <span className="display-condensed text-lg font-extrabold leading-none text-ink">
              GlaciaNav
            </span>
            <motion.span
              className="block overflow-hidden font-mono text-[0.56rem] uppercase tracking-[0.18em] text-ink-faint"
              animate={{ height: compact ? 0 : 14, opacity: compact ? 0 : 1 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="block pt-1">Ice intelligence · {meta.location}</span>
            </motion.span>
          </span>
        </a>

        {/* Numbered section index */}
        <div
          ref={containerRef}
          onMouseLeave={() => setHover(null)}
          className="relative hidden items-stretch self-stretch md:flex"
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
                "group relative z-10 flex items-center gap-1.5 px-3.5 font-mono text-[0.7rem] uppercase tracking-[0.12em] transition-colors",
                target === index ? "text-ink" : "text-ink-soft hover:text-ink",
                focusRing
              )}
            >
              <span
                className={cn(
                  "text-[0.6rem] tabular-nums transition-colors",
                  target === index ? "text-mask-ink" : "text-ink-faint"
                )}
              >
                {String(index + 1).padStart(2, "0")}
              </span>
              {item.label}
            </a>
          ))}
        </div>

        {/* Status + action */}
        <div className="flex shrink-0 items-center gap-4">
          <span className="hidden items-center gap-1.5 font-mono text-[0.6rem] uppercase tracking-[0.14em] text-ink-soft lg:inline-flex">
            <span className="relative flex size-1.5">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-mask opacity-70" />
              <span className="relative inline-flex size-1.5 rounded-full bg-mask outline outline-1 outline-ink/30" />
            </span>
            Feed live
          </span>
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
        </div>
      </motion.nav>

      {/* Mobile menu */}
      {open ? (
        <div className="border-t border-border bg-paper px-5 py-3 md:hidden">
          <ul className="flex flex-col">
            {nav.map((item, index) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-center gap-3 border-b border-border py-3.5 font-mono text-[0.78rem] uppercase tracking-[0.12em] transition-colors",
                    active === index ? "text-ink" : "text-ink-soft",
                    focusRing
                  )}
                >
                  <span
                    className={cn(
                      "text-[0.62rem] tabular-nums",
                      active === index ? "text-mask-ink" : "text-ink-faint"
                    )}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
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
