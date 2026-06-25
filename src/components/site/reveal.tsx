import { type ReactNode } from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { cn } from "@/lib/utils";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

/**
 * Scroll-reveal. Fades + lifts content in once as it enters the viewport.
 * Collapses to a plain render under prefers-reduced-motion.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 20,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
}) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.6, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};

const child: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
};

/** Staggered container for grids/lists. Wrap items in <StaggerItem>. */
export function Stagger({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      variants={reduce ? undefined : stagger}
      initial={reduce ? false : "hidden"}
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div className={className} variants={reduce ? undefined : child}>
      {children}
    </motion.div>
  );
}

/** Consistent section shell: vertical rhythm + centered max width. */
export function Section({
  id,
  className,
  children,
}: {
  id?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      className={cn("scroll-mt-20 py-20 md:py-28", className)}
    >
      <div className="mx-auto w-full max-w-6xl px-5 md:px-8">{children}</div>
    </section>
  );
}

/** Section headline + optional intro, stacked (no split-header). */
export function SectionHead({
  title,
  intro,
  className,
}: {
  title: string;
  intro?: string;
  className?: string;
}) {
  return (
    <div className={cn("max-w-2xl", className)}>
      <h2 className="font-heading text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
        {title}
      </h2>
      {intro ? (
        <p className="mt-4 text-base leading-relaxed text-muted-foreground md:text-lg">
          {intro}
        </p>
      ) : null}
    </div>
  );
}
