import { Link } from "react-router-dom";
import { Sparkles, TrendingUp, ArrowRight } from "lucide-react";
import { trackCTA } from "@/lib/tracking";

interface Props {
  variant: "signaal" | "pricing";
  slug: string;
}

const config = {
  signaal: {
    icon: Sparkles,
    eyebrow: "Mission Control",
    title: "Bouw uw eigen B2B-groeisysteem",
    body: "Doorloop Signaal: een interactieve learning journey. U krijgt een persoonlijk plan met concrete stappen voor uw pipeline.",
    cta: "Start Signaal",
    href: "/signaal",
    label: "BlogPost Mid — Signaal",
  },
  pricing: {
    icon: TrendingUp,
    eyebrow: "Done-for-you of Build & Transfer",
    title: "Bekijk wat een groeimachine kost",
    body: "Transparante uurtarieven, 6 of 12 maanden engagement. Geen vendor lock-in, u behoudt alle data en flows.",
    cta: "Bekijk pricing",
    href: "/pricing",
    label: "BlogPost Mid — Pricing",
  },
};

const MidContentCta = ({ variant, slug }: Props) => {
  const c = config[variant];
  const Icon = c.icon;

  return (
    <div className="not-prose my-12 group">
      <Link
        to={c.href}
        onClick={() => trackCTA(c.label, `/blog/${slug}`)}
        className="block relative overflow-hidden rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/10 via-secondary/50 to-background p-6 md:p-8 hover:border-primary/60 transition-all"
      >
        <div className="absolute -top-12 -right-12 w-40 h-40 bg-primary/20 rounded-full blur-3xl group-hover:bg-primary/30 transition-colors" />
        <div className="relative flex items-start gap-4">
          <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center">
            <Icon className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs uppercase tracking-wider text-primary font-semibold mb-1.5">
              {c.eyebrow}
            </p>
            <h4 className="font-display text-lg md:text-xl font-bold text-foreground mb-2 leading-snug">
              {c.title}
            </h4>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              {c.body}
            </p>
            <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary group-hover:gap-2.5 transition-all">
              {c.cta}
              <ArrowRight className="w-4 h-4" />
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default MidContentCta;
