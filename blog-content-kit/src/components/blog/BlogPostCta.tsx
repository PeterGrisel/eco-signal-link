import { Link } from "react-router-dom";
import { trackCTA } from "@/lib/tracking";
import { BOOKING_URL } from "@/content/copy";

type Variant =
  | "signaal"
  | "icp-scoring"
  | "follow-up"
  | "businesscase"
  | "handoff"
  | "default";

const VARIANTS: Record<
  Variant,
  { eyebrow: string; title: string; body: string; cta: string; href: string; external?: boolean }
> = {
  signaal: {
    eyebrow: "Volgende stap",
    title: "Vraag een signaalscan aan",
    body: "Wij brengen in kaart welke intent-signalen in uw markt al meetbaar zijn, en welke u nu nog mist.",
    cta: "Plan signaalscan →",
    href: "/signaal",
  },
  "icp-scoring": {
    eyebrow: "Volgende stap",
    title: "Doe de ICP & scoring scan",
    body: "Check uw ICP-definitie en lead scoring tegen ons referentiemodel. Resultaat: een scherpe scoringmatrix voor uw team.",
    cta: "Start ICP & scoring scan →",
    href: "/icp-ai",
  },
  "follow-up": {
    eyebrow: "Volgende stap",
    title: "Audit uw follow-up workflow",
    body: "Wij lopen uw routing, opvolging en SQL-handoff door. U krijgt concrete fixes voor lekkende fasen in uw funnel.",
    cta: "Plan follow-up audit →",
    href: "/hoe-het-werkt",
  },
  businesscase: {
    eyebrow: "Volgende stap",
    title: "Bereken uw groeisysteem business case",
    body: "Reken in 5 minuten uit wat een voorspelbare pijplijn voor uw bedrijf oplevert. Markt, ratio's, pipelinewaarde.",
    cta: "Open de Funnel Calculator →",
    href: "/funnel-calculator",
  },
  handoff: {
    eyebrow: "Volgende stap",
    title: "Download het sales handoff playbook",
    body: "Praktische templates voor SQL-definitie, routing en de overdracht van marketing naar sales.",
    cta: "Bekijk playbooks →",
    href: "/playbooks",
  },
  default: {
    eyebrow: "Volgende stap",
    title: "Plan een B2B Groeiscan",
    body: "60 minuten met Peter. U krijgt een 1-pagina groeiplan met de belangrijkste keuzes voor uw pijplijn.",
    cta: "Plan Groeiscan →",
    href: BOOKING_URL,
    external: true,
  },
};

/**
 * Bepaal welke CTA-variant past bij een blog-artikel.
 * Volgorde: expliciete cta_variant op de post → categorie → default.
 */
export function pickVariant(opts: {
  ctaVariant?: string | null;
  categorySlug?: string | null;
}): Variant {
  const explicit = (opts.ctaVariant || "").toLowerCase();
  if (explicit in VARIANTS) return explicit as Variant;

  switch (opts.categorySlug) {
    case "signal-based-prospecting":
      return "signaal";
    case "sales-operations":
      return "follow-up";
    case "growth-systems-mkb":
      return "businesscase";
    case "outbound-engagement":
    case "recruitment-talent":
    default:
      return "default";
  }
}

interface Props {
  variant: Variant;
  postSlug: string;
}

const BlogPostCta = ({ variant, postSlug }: Props) => {
  const v = VARIANTS[variant];
  const trackLabel = `BlogPost CTA — ${variant}`;
  const className =
    "inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2.5 rounded-lg font-display font-semibold text-sm hover:bg-primary/90 transition-colors";

  return (
    <div className="mt-16 p-8 rounded-2xl bg-gradient-to-br from-primary/10 via-secondary to-secondary border border-primary/20">
      <span className="text-xs font-semibold uppercase tracking-wider text-primary mb-2 block">
        {v.eyebrow}
      </span>
      <h3 className="font-display text-xl font-bold text-foreground mb-2">{v.title}</h3>
      <p className="text-muted-foreground text-sm mb-5 max-w-xl">{v.body}</p>
      {v.external ? (
        <a
          href={v.href}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackCTA(trackLabel, `/blog/${postSlug}`)}
          className={className}
        >
          {v.cta}
        </a>
      ) : (
        <Link
          to={v.href}
          onClick={() => trackCTA(trackLabel, `/blog/${postSlug}`)}
          className={className}
        >
          {v.cta}
        </Link>
      )}
    </div>
  );
};

export default BlogPostCta;