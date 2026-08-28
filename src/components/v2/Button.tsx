import { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";

type Variant = "primary" | "outline" | "invert";

const variants: Record<Variant, string> = {
  primary: "bg-brand-accent text-brand-ground hover:bg-brand-accent-2",
  outline:
    "border-[1.5px] border-brand-line text-brand-ink hover:border-brand-accent hover:text-brand-accent",
  invert:
    "border-[1.5px] border-brand-ground/25 text-brand-ground hover:bg-brand-ground hover:text-brand-paper",
};

const base =
  "inline-block rounded-md px-6 py-3 font-display text-sm font-semibold tracking-tight transition-[background-color,color,border-color,transform] duration-200 active:scale-[.96] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-accent";

/**
 * Magnetische knop: trekt licht naar de cursor en veert terug. `href` mag een
 * interne route, een anker of een externe URL zijn; `onClick` zonder `href`
 * levert een gewone knop op, bijvoorbeeld om de boekingsmodal te openen.
 */
export function Button({
  variant = "primary",
  href,
  onClick,
  children,
}: {
  variant?: Variant;
  href?: string;
  onClick?: () => void;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 320, damping: 22 });
  const y = useSpring(my, { stiffness: 320, damping: 22 });

  function onMove(e: React.MouseEvent) {
    const el = ref.current;
    if (!el || reduced) return;
    const r = el.getBoundingClientRect();
    mx.set((e.clientX - (r.left + r.width / 2)) * 0.18);
    my.set((e.clientY - (r.top + r.height / 2)) * 0.28);
  }
  function onLeave() {
    mx.set(0);
    my.set(0);
  }

  const cls = `${base} ${variants[variant]}`;
  const isExternal = !!href && /^(https?:|mailto:|tel:)/.test(href);
  const isAnchor = !!href && href.startsWith("#");

  return (
    <motion.span
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ x, y }}
      className="inline-block"
    >
      {!href ? (
        <button type="button" onClick={onClick} className={cls}>
          {children}
        </button>
      ) : isExternal || isAnchor ? (
        <a
          href={href}
          className={cls}
          {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        >
          {children}
        </a>
      ) : (
        <Link to={href} className={cls}>
          {children}
        </Link>
      )}
    </motion.span>
  );
}
