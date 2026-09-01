/**
 * De partnerrij in de hero.
 *
 * Elke badge is een licht chipje met het merkicoon en de naam. Voor Stairoids
 * hebben we nog geen logobestand; die krijgt alleen de naam tot er een
 * `/logos/groeistack/stairoids.webp` naast de andere staat.
 */

interface Partner {
  naam: string;
  /** Pad onder /public, of weglaten als we het merk nog niet hebben. */
  logo?: string;
}

const PARTNERS: Partner[] = [
  { naam: "HubSpot", logo: "/logos/groeistack/hubspot.webp" },
  { naam: "Pipedrive", logo: "/logos/groeistack/pipedrive.webp" },
  { naam: "Claude", logo: "/logos/groeistack/claude.webp" },
  { naam: "Apollo", logo: "/logos/groeistack/apollo.webp" },
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
            <span className="inline-flex h-8 items-center gap-2 rounded-btn bg-brand-mist px-3">
              {partner.logo && (
                <img
                  src={partner.logo}
                  alt=""
                  aria-hidden
                  width={18}
                  height={18}
                  loading="lazy"
                  className="size-[18px] shrink-0 rounded-[3px] object-contain"
                />
              )}
              <span className="font-display text-[13px] font-bold tracking-[-0.01em] text-brand-ink">
                {partner.naam}
              </span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
