import { BadgeCheck } from "lucide-react";

/**
 * De partnerrij in de hero.
 *
 * Elke badge staat voor een leverancier waar wij officieel partner van zijn.
 * `logo` is optioneel: zodra de officiële partner-artwork in
 * `public/logos/partners/` staat, vervangt die het vinkje. Zolang dat er niet
 * is houden we één uniforme, typografische badge aan — een half ingevulde rij
 * met deels echte en deels nagetekende merken oogt onbetrouwbaar.
 */

interface Partner {
  naam: string;
  /** Pad onder /public, bijvoorbeeld "/logos/partners/hubspot.svg". */
  logo?: string;
}

const PARTNERS: Partner[] = [
  { naam: "HubSpot" },
  { naam: "Pipedrive" },
  { naam: "Claude" },
  { naam: "Apollo" },
  { naam: "Stairoids" },
];

export function PartnerBadges({ className = "" }: { className?: string }) {
  return (
    <div className={className}>
      <p className="mb-3 font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-[#8C8378]">
        Officieel partner van
      </p>
      <ul className="flex flex-wrap items-center gap-2">
        {PARTNERS.map((partner) => (
          <li key={partner.naam}>
            <span className="inline-flex items-center gap-2 rounded-btn border border-white/[.14] bg-white/[.04] py-1.5 pl-2.5 pr-3">
              {partner.logo ? (
                <img
                  src={partner.logo}
                  alt=""
                  aria-hidden
                  loading="lazy"
                  className="size-[15px] shrink-0 object-contain"
                />
              ) : (
                <BadgeCheck aria-hidden className="size-[15px] shrink-0 text-brand-accent" />
              )}
              <span className="font-display text-[12.5px] font-bold tracking-[-0.01em] text-[#E7E0D6]">
                {partner.naam}
              </span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
