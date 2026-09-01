import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronDown, Menu, X } from "lucide-react";
import { Button } from "./Button";
import { Container } from "./Container";
import { ScrollProgress } from "./ScrollProgress";
import { openBookingModal } from "@/components/booking/GlobalBookingModal";
import { sectors } from "@/data/sectors";
import { trackCTA } from "@/lib/tracking";

type Item = { label: string; href: string; note?: string };
type Group = { label: string; href?: string; items?: Item[] };

/**
 * Twee assen, zoals elk serieus B2B-bureau ze voert: wat wij doen, maal voor
 * wie het is. Daarachter hangen de bewijs- en kennispagina's die anders
 * onvindbaar blijven.
 */
const GROUPS: Group[] = [
  {
    label: "Diensten",
    items: [
      { label: "Outbound", href: "/#diensten", note: "Nieuwe accounts openen" },
      { label: "ABM", href: "/#diensten", note: "De accounts die er echt toe doen" },
      { label: "RevOps", href: "/#diensten", note: "Het proces onder de motorkap" },
      { label: "Nurturing", href: "/#diensten", note: "Top of mind bij wie nog niet koopt" },
      { label: "De engine", href: "/de-engine", note: "De volledige architectuur" },
      { label: "Groeistack", href: "/groeistack", note: "Onze modulaire B2B groeistack" },
    ],
  },
  {
    label: "Voor wie",
    items: [
      ...sectors.map((s) => ({
        label: s.title,
        href: `/sectoren/${s.slug}`,
        note: s.tagline,
      })),
      { label: "Alle branches", href: "/#voor-wie", note: "Bekijk de volledige lijst" },
    ],
  },
  {
    label: "Bewijs",
    items: [
      { label: "Klanten", href: "/klanten", note: "Wie er met de engine werkt" },
      { label: "Partners", href: "/partners", note: "Het Signal Certified netwerk" },
      { label: "Over ons", href: "/over-ons", note: "Onze missie en aanpak" },
      { label: "Ons team", href: "/ons-team", note: "De mensen achter de engine" },
    ],
  },
  {
    label: "Kennis",
    items: [
      { label: "Playbooks", href: "/playbooks", note: "Bewezen werkstromen" },
      { label: "Cheatsheets", href: "/cheatsheets", note: "Templates en frameworks" },
      { label: "Tools", href: "/tools", note: "Funnel-, pipeline- en value calculators" },
      { label: "Woordenboek", href: "/woordenboek", note: "De begrippen uit het model" },
      { label: "Blog", href: "/blog", note: "Wat wij onderweg leren" },
    ],
  },
  { label: "Prijzen", href: "/pricing" },
];

const triggerClass =
  "relative flex items-center gap-1.5 py-1 font-mono text-[10.5px] font-bold uppercase tracking-[0.14em] text-brand-ink-2 transition-colors duration-[180ms] hover:text-brand-ink";

/** Interne link of anker: react-router voor routes, gewone anchor voor #hashes. */
function Go({
  href,
  className,
  onClick,
  children,
}: {
  href: string;
  className?: string;
  onClick?: () => void;
  children: React.ReactNode;
}) {
  if (href.includes("#")) {
    return (
      <a href={href} className={className} onClick={onClick}>
        {children}
      </a>
    );
  }
  return (
    <Link to={href} className={className} onClick={onClick}>
      {children}
    </Link>
  );
}

export function Nav() {
  const [open, setOpen] = useState<string | null>(null);
  const [mobile, setMobile] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  /**
   * Na Escape mag hover het menu niet meteen heropenen: het paneel verdwijnt,
   * de layout schuift op en de browser vuurt opnieuw een mouseenter op de knop.
   * Deze vlag houdt het menu dicht tot de muis de balk echt verlaat.
   */
  const hoverGeblokkeerd = useRef(false);
  const location = useLocation();

  // Menu's sluiten bij navigatie, bij Escape en bij een klik buiten de balk.
  useEffect(() => {
    setOpen(null);
    setMobile(false);
  }, [location.pathname, location.hash]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        hoverGeblokkeerd.current = true;
        setOpen(null);
        setMobile(false);
      }
    };
    const onClick = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) setOpen(null);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("click", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("click", onClick);
    };
  }, []);

  function book() {
    trackCTA("nav_plan_kennismaking", "navbar");
    openBookingModal();
  }

  return (
    <nav
      ref={navRef}
      className="sticky top-0 z-50 border-b border-brand-line bg-brand-paper/[.94] backdrop-blur-[10px]"
      onMouseLeave={() => {
        hoverGeblokkeerd.current = false;
        setOpen(null);
      }}
    >
      <Container className="flex items-center justify-between gap-7 py-3.5">
        <Link to="/" aria-label="B2B Groeimachine, home" className="shrink-0">
          <span className="font-display text-[17px] font-black tracking-[-0.02em]">
            <span className="text-brand-ink">B2B</span>
            <span className="text-brand-accent-ink">GroeiMachine</span>
          </span>
        </Link>

        <div className="hidden items-center gap-7 lg:flex">
          {GROUPS.map((group) =>
            group.items ? (
              <div
                key={group.label}
                onMouseEnter={() => {
                  if (!hoverGeblokkeerd.current) setOpen(group.label);
                }}
              >
                <button
                  type="button"
                  className={triggerClass}
                  aria-expanded={open === group.label}
                  onClick={() => {
                    hoverGeblokkeerd.current = false;
                    setOpen(open === group.label ? null : group.label);
                  }}
                >
                  {group.label}
                  <ChevronDown
                    aria-hidden
                    className={`size-3 transition-transform duration-200 ${
                      open === group.label ? "rotate-180" : ""
                    }`}
                  />
                </button>
              </div>
            ) : (
              <Link key={group.label} to={group.href!} className={triggerClass}>
                {group.label}
              </Link>
            ),
          )}
        </div>

        <div className="flex items-center gap-3">
          <span className="hidden md:block">
            <Button onClick={book}>Boek een gratis call</Button>
          </span>
          <button
            type="button"
            aria-label={mobile ? "Sluit menu" : "Open menu"}
            aria-expanded={mobile}
            onClick={() => setMobile((v) => !v)}
            className="rounded-btn border border-brand-line p-2 text-brand-ink lg:hidden"
          >
            {mobile ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>
        </div>
      </Container>

      {/* Uitklapper op desktop: één rij kaarten binnen dezelfde contentwrap. */}
      {open && (
        <div className="hidden border-t border-brand-line bg-brand-mist lg:block">
          <Container className="grid grid-cols-3 gap-x-8 gap-y-1 py-6">
            {GROUPS.find((g) => g.label === open)?.items?.map((item) => (
              <Go
                key={item.label + item.href}
                href={item.href}
                className="group rounded-brand px-3 py-2.5 transition-colors duration-[180ms] hover:bg-brand-paper"
                onClick={() => setOpen(null)}
              >
                <span className="block font-display text-[14px] font-bold tracking-[-0.01em] text-brand-ink transition-colors duration-[180ms] group-hover:text-brand-accent-ink">
                  {item.label}
                </span>
                {item.note && (
                  <span className="mt-0.5 block text-[12.5px] text-brand-ink-3">{item.note}</span>
                )}
              </Go>
            ))}
          </Container>
        </div>
      )}

      {/* Mobiel: alles uitgeklapt onder elkaar, geen tweede niveau om te missen. */}
      {mobile && (
        <div className="max-h-[75svh] overflow-y-auto border-t border-brand-line bg-brand-paper lg:hidden">
          <Container className="flex flex-col gap-6 py-5">
            {GROUPS.map((group) => (
              <div key={group.label}>
                {group.items ? (
                  <>
                    <p className="mb-2 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-brand-accent-ink">
                      {group.label}
                    </p>
                    <div className="flex flex-col">
                      {group.items.map((item) => (
                        <Go
                          key={item.label + item.href}
                          href={item.href}
                          className="border-b border-brand-line py-2.5 font-display text-sm font-semibold text-brand-ink last:border-b-0"
                          onClick={() => setMobile(false)}
                        >
                          {item.label}
                        </Go>
                      ))}
                    </div>
                  </>
                ) : (
                  <Link
                    to={group.href!}
                    className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-brand-accent-ink"
                    onClick={() => setMobile(false)}
                  >
                    {group.label}
                  </Link>
                )}
              </div>
            ))}
            <span className="md:hidden">
              <Button onClick={book}>Boek een gratis call</Button>
            </span>
          </Container>
        </div>
      )}

      <ScrollProgress />
    </nav>
  );
}
