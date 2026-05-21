import { forwardRef, type AnchorHTMLAttributes, type ReactNode } from "react";
import { CTA, type CtaKey } from "@/content/copy";
import { trackCTA } from "@/lib/tracking";

type CtaLinkProps = {
  /** Welke centrale CTA wordt gebruikt (label/href komen uit `src/content/copy.ts`) */
  intent: CtaKey;
  /** Plek op de pagina, voor tracking. Bijv. "Hero", "Navbar (mobile)" */
  location: string;
  /** Override label (standaard: CTA[intent].label) */
  children?: ReactNode;
} & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "onClick">;

/**
 * Eén plek voor CTA-href, label en trackingnaam.
 * Voorkomt drift tussen "Plan de nulmeting", "Plan een gesprek", etc.
 */
const CtaLink = forwardRef<HTMLAnchorElement, CtaLinkProps>(
  ({ intent, location, children, ...rest }, ref) => {
    const cta = CTA[intent];
    const external = "external" in cta && cta.external;
    return (
      <a
        ref={ref}
        href={cta.href}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
        onClick={() => trackCTA(`${location} — ${cta.label.replace(/\s*→\s*$/, "")}`, cta.href)}
        {...rest}
      >
        {children ?? cta.label}
      </a>
    );
  }
);
CtaLink.displayName = "CtaLink";

export default CtaLink;