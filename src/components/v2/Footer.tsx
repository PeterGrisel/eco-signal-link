import { useEffect, useState } from "react";
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
    title: "Over Ons",
    links: [
      ["Klanten", "/klanten"],
      ["Partners", "/partners"],
      ["Ons team", "/ons-team"],
      ["Contact", "/contact"],
    ],
  },
  {
    title: "Kennis",
    links: [
      ["De werkomgeving", "/werkomgeving"],
      ["Signalen per markt", "/signalen"],
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
  "text-[#CBC3B8] transition-colors duration-[180ms] hover:text-brand-accent";

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

/**
 * De groet wisselt van taal, naar het model van daliagents.com. Bij ons zegt
 * dat ook iets: dezelfde engine gaat mee naar een nieuwe markt, alleen de
 * hypothese en de taal veranderen. Puur decoratief, dus aria-hidden op de
 * regels die niet aan de beurt zijn.
 */
const GROETEN = [
  { taal: "nl", woord: "Hallo" },
  { taal: "en", woord: "Hello" },
  { taal: "de", woord: "Hallo" },
  { taal: "fr", woord: "Bonjour" },
  { taal: "es", woord: "Hola" },
];

function Groet() {
  const [i, setI] = useState(0);

  useEffect(() => {
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => setI((v) => (v + 1) % GROETEN.length), 2600);
    return () => clearInterval(t);
  }, []);

  return (
    <p className="relative h-[1.25em] font-display text-[clamp(38px,6vw,72px)] font-black leading-none tracking-[-0.04em]">
      {GROETEN.map((groet, index) => (
        <span
          key={groet.taal}
          lang={groet.taal}
          aria-hidden={index !== i}
          className="absolute left-0 top-0 transition-[opacity,transform] duration-[600ms] ease-out"
          style={{
            opacity: index === i ? 1 : 0,
            transform: index === i ? "translateY(0)" : "translateY(38%)",
          }}
        >
          {groet.woord}
        </span>
      ))}
    </p>
  );
}

export function Footer() {
  return (
    <footer className="overflow-hidden bg-brand-deep pt-16 text-white">
      <Container>
        {/* Aanhef: de groet wisselt, het adres blijft. */}
        <div className="mb-16 grid gap-8 border-b border-white/[.12] pb-14 md:grid-cols-2 md:items-end">
          <div>
            <p className="mb-5 flex items-center gap-4 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-brand-accent">
              Even sparren
              <span aria-hidden className="h-px w-16 bg-brand-accent" />
            </p>
            <Groet />
          </div>
          <div className="md:text-right">
            <a
              href="mailto:info@rebelforce.nl"
              className="font-display text-[clamp(18px,2.4vw,26px)] font-bold tracking-[-0.02em] text-white underline decoration-white/30 underline-offset-4 transition-colors duration-[180ms] hover:text-brand-accent hover:decoration-brand-accent"
            >
              info@rebelforce.nl
            </a>
            <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.14em] text-[#A29584]">
              Reactie binnen één werkdag
            </p>
          </div>
        </div>

        <div className="grid gap-12 pb-14 md:grid-cols-[1.25fr_1fr_1fr_1fr]">
          <div>
            <p className="mb-4 font-display text-[22px] font-black tracking-[-0.02em]">
              <span className="text-white">B2B</span>
              <span className="text-brand-accent">GroeiMachine</span>
            </p>
            <p className="max-w-[38ch] text-[13px] leading-relaxed text-[#A29584]">
              B2B Groeimachine ontwerpt en bouwt commerciële opportunity-engines voor
              B2B-organisaties in de Benelux. Wij vertalen uw verkoopproces naar
              software, koppelen uw systemen en leveren het geheel als een
              digitale commerciële medewerker. Een label van Rebel Force.
            </p>
          </div>
          {cols.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <p className="mb-4 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-brand-accent">
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
        <nav aria-label="Branches" className="border-t border-white/[.12] py-8">
          <p className="mb-4 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-brand-accent">
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

        <nav aria-label="Veelgezocht" className="border-t border-white/[.12] py-8">
          <p className="mb-4 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-[#A29584]">
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
        <p className="v2-giant-word -mb-[2.2vw] whitespace-nowrap text-center font-display text-[10.5vw] font-black leading-none tracking-[-0.04em] text-transparent [-webkit-text-stroke:1.5px_rgba(255,255,255,0.08)]">
          B2BGROEIMACHINE
        </p>
      </div>

      <div className="border-t border-white/[.12] py-6 font-mono text-[10px] uppercase tracking-[0.12em] text-[#A29584]">
        <Container className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            {legal.map(([label, href]) => (
              <Link
                key={label}
                to={href}
                className="transition-colors duration-[180ms] hover:text-brand-accent"
              >
                {label}
              </Link>
            ))}
            <a
              href="https://rebelforce.nl"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors duration-[180ms] hover:text-brand-accent"
            >
              rebelforce.nl ↗
            </a>
          </div>
          <div className="flex flex-wrap justify-between gap-x-6 gap-y-2 border-t border-white/[.12] pt-3">
            <span>© {new Date().getFullYear()} B2BGroeiMachine · b2bgroeimachine.io</span>
            <span>Rebel Force B.V. · KVK 94347778 · BTW NL866743856B01</span>
          </div>
        </Container>
      </div>
    </footer>
  );
}
