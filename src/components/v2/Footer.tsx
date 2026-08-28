import { Link } from "react-router-dom";
import { Container } from "./Container";
import { sectors } from "@/data/sectors";

const cols = [
  {
    title: "Diensten",
    links: [
      ["Outbound, ABM, RevOps, Nurturing", "/#diensten"],
      ["De engine", "/de-engine"],
      ["Groeistack", "/groeistack"],
      ["Prijzen", "/pricing"],
      ["Hoe het werkt", "/hoe-het-werkt"],
    ],
  },
  {
    title: "Bewijs",
    links: [
      ["Klanten", "/klanten"],
      ["Partners", "/partners"],
      ["Over ons", "/over-ons"],
      ["Ons team", "/ons-team"],
      ["Contact", "/contact"],
    ],
  },
  {
    title: "Kennis",
    links: [
      ["Playbooks", "/playbooks"],
      ["Cheatsheets", "/cheatsheets"],
      ["Tools en calculators", "/tools"],
      ["Woordenboek", "/woordenboek"],
      ["Blog", "/blog"],
    ],
  },
] as const;

/**
 * Veelgezochte zoekpagina's. Deze dertien landingspagina's staan live maar zijn
 * alleen via Google bereikbaar; een eigen footerrij geeft ze interne links en
 * houdt ze uit de hoofdnavigatie, waar ze niet thuishoren.
 */
const VEELGEZOCHT = [
  ["B2B leadgeneratie", "/b2b-leadgeneratie"],
  ["Leadgeneratie uitbesteden", "/leadgeneratie-uitbesteden"],
  ["Acquisitie uitbesteden", "/acquisitie-uitbesteden"],
  ["Koude acquisitie", "/koude-acquisitie"],
  ["Cold email uitbesteden", "/cold-email-uitbesteden"],
  ["Zakelijke leads", "/zakelijke-leads"],
  ["Online leadgeneratie", "/online-leadgeneratie"],
  ["Leads genereren B2B", "/leads-genereren-b2b"],
  ["Sales automation mkb", "/sales-automation-mkb"],
  ["Leadgeneratie maakindustrie", "/leadgeneratie-maakindustrie"],
  ["Leadgeneratie tech services", "/leadgeneratie-tech-services"],
  ["Leadgeneratie zakelijke dienstverlening", "/leadgeneratie-zakelijke-dienstverlening"],
  ["Apollo.io partner Nederland", "/apollo-io-partner-nederland"],
] as const;

const legal = [
  ["Privacy", "/privacy"],
  ["Voorwaarden", "/terms"],
  ["Cookies", "/cookies"],
] as const;

const linkClass =
  "text-brand-ink-2 transition-colors duration-200 hover:text-brand-accent";

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  if (href.includes("#")) {
    return (
      <a href={href} className={linkClass}>
        {children}
      </a>
    );
  }
  return (
    <Link to={href} className={linkClass}>
      {children}
    </Link>
  );
}

export function Footer() {
  return (
    <footer className="overflow-hidden border-t border-brand-line bg-brand-surface pt-16 text-brand-ink">
      <Container>
        <div className="grid gap-12 pb-14 md:grid-cols-[1.25fr_1fr_1fr_1fr]">
          <div>
            <p className="mb-4 font-display text-[22px] font-bold tracking-tight">
              <span className="text-brand-ink">B2B</span>
              <span className="text-brand-accent">GroeiMachine</span>
            </p>
            <p className="max-w-[38ch] text-[13px] leading-relaxed text-brand-ink-3">
              B2B Groeimachine bouwt commerciële opportunity-engines voor
              B2B-organisaties in de Benelux. Wij vertalen uw verkoopproces naar
              software, koppelen uw systemen en leveren het geheel als een
              digitale commerciële medewerker. Een label van Rebel Force.
            </p>
          </div>
          {cols.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <p className="mb-4 font-display text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-accent">
                {col.title}
              </p>
              <ul className="space-y-2.5 text-[13.5px]">
                {col.links.map(([label, href]) => (
                  <li key={label}>
                    <FooterLink href={href}>{label}</FooterLink>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        {/* Branche-as: dezelfde elf pagina's als in het menu, hier compleet. */}
        <nav aria-label="Branches" className="border-t border-brand-line py-8">
          <p className="mb-4 font-display text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-accent">
            Voor wie
          </p>
          <ul className="flex flex-wrap gap-x-6 gap-y-2.5 text-[13.5px]">
            {sectors.map((sector) => (
              <li key={sector.slug}>
                <FooterLink href={`/sectoren/${sector.slug}`}>{sector.title}</FooterLink>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Veelgezocht" className="border-t border-brand-line py-8">
          <p className="mb-4 font-display text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-ink-3">
            Veelgezocht
          </p>
          <ul className="flex flex-wrap gap-x-6 gap-y-2.5 text-[13px]">
            {VEELGEZOCHT.map(([label, href]) => (
              <li key={href}>
                <FooterLink href={href}>{label}</FooterLink>
              </li>
            ))}
          </ul>
        </nav>
      </Container>

      {/* Signatuur: het merk als reusachtige outline-wordmark, half uit beeld. */}
      <div aria-hidden className="pointer-events-none select-none">
        <p className="v2-giant-word -mb-[2.2vw] whitespace-nowrap text-center font-display text-[10.5vw] font-bold leading-none tracking-[-0.04em] text-transparent [-webkit-text-stroke:1.5px_rgba(238,234,228,0.09)]">
          B2BGROEIMACHINE
        </p>
      </div>

      <div className="border-t border-brand-line py-6 text-[11px] uppercase tracking-[0.12em] text-brand-ink-3">
        <Container className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            {legal.map(([label, href]) => (
              <Link
                key={label}
                to={href}
                className="transition-colors duration-200 hover:text-brand-accent"
              >
                {label}
              </Link>
            ))}
            <a
              href="https://rebelforce.nl"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors duration-200 hover:text-brand-accent"
            >
              rebelforce.nl ↗
            </a>
          </div>
          <div className="flex flex-wrap justify-between gap-x-6 gap-y-2 border-t border-brand-line pt-3">
            <span>© {new Date().getFullYear()} B2BGroeiMachine · b2bgroeimachine.io</span>
            <span>Rebel Force B.V. · KVK 94347778 · BTW NL866743856B01</span>
          </div>
        </Container>
      </div>
    </footer>
  );
}
