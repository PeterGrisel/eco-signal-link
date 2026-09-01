/**
 * De partnerrij in de hero.
 *
 * Elke badge is een licht chipje met het echte woordmerk. Dat is bewust: de
 * woordmerken van HubSpot en Pipedrive staan in donkere letters en zouden op
 * onze donkere hero wegvallen.
 *
 * Voor Apollo en Stairoids bestaat geen vrij beschikbaar merkbestand; die
 * krijgen hun naam in de merktypografie tot de officiële partner-artwork in
 * `public/logos/partners/` staat. Zet dan `logo` en het beeld neemt het over.
 */

interface Partner {
  naam: string;
  /** Pad onder /public, bijvoorbeeld "/logos/partners/hubspot.svg". */
  logo?: string;
}

const PARTNERS: Partner[] = [
  { naam: "HubSpot", logo: "/logos/partners/hubspot.svg" },
  { naam: "Pipedrive", logo: "/logos/partners/pipedrive.svg" },
  { naam: "Claude", logo: "/logos/partners/claude.svg" },
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
            <span className="inline-flex h-8 items-center justify-center rounded-btn bg-brand-mist px-3.5">
              {partner.logo ? (
                <img
                  src={partner.logo}
                  alt={partner.naam}
                  width={96}
                  height={16}
                  loading="lazy"
                  className="h-4 w-auto"
                />
              ) : (
                <span className="font-display text-[13px] font-bold tracking-[-0.01em] text-brand-ink">
                  {partner.naam}
                </span>
              )}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
