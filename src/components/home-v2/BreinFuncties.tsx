import { lazy, Suspense, useCallback, useEffect, useRef, useState } from "react";
import { Reveal } from "@/components/v2/Reveal";
import { Section } from "@/components/v2/Section";
import { SectionHeader } from "@/components/v2/SectionHeader";
import machinePoster from "@/assets/brein-machine-poster.jpg";
import { trackEvent } from "@/lib/tracking";

/**
 * Kan deze browser WebGL 2 starten? three.js heeft WebGL 2 nodig. Zo niet,
 * dan geven we de reden terug en tonen we een stilstaand beeld.
 */
function webglReden(): string | null {
  try {
    const canvas = document.createElement("canvas");
    const gl2 = canvas.getContext("webgl2") as WebGL2RenderingContext | null;
    if (gl2) {
      gl2.getExtension("WEBGL_lose_context")?.loseContext();
      return null;
    }
    const gl1 = document.createElement("canvas").getContext("webgl");
    if (gl1) {
      gl1.getExtension("WEBGL_lose_context")?.loseContext();
      return "Deze browser heeft alleen WebGL 1. De machine vraagt WebGL 2.";
    }
    return "WebGL staat uit of is geblokkeerd in deze browser.";
  } catch (e) {
    return `WebGL-test faalde: ${e instanceof Error ? e.message : String(e)}`;
  }
}

/**
 * "Functies van het brein" als raster onder de werkomgeving.
 *
 * De hero belooft: zoekt, rapporteert, plant en voert uit. Hier staat wat dat
 * concreet betekent, per functie, met als afsluiter de kern van het aanbod:
 * u verzint het, wij installeren en beheren het voor u.
 */
const FUNCTIES: { rol: string; naam: string; body: string }[] = [
  {
    rol: "01",
    naam: "Leads",
    body: "Het brein zoekt bedrijven en beslissers die nu passen. Elke dag een frisse lijst, zonder handwerk.",
  },
  {
    rol: "02",
    naam: "Reporting",
    body: "U ziet wat er gebeurt: wie is benaderd, wie reageert en wat het oplevert.",
  },
  {
    rol: "03",
    naam: "Taken",
    body: "Opvolging, herinneringen en vervolgacties gebeuren vanzelf. Niemand hoeft eraan te denken.",
  },
  {
    rol: "04",
    naam: "Content planning",
    body: "Posts, nieuwsbrieven en campagnes staan op tijd in de planning. In uw tone en uw huisstijl.",
  },
  {
    rol: "05",
    naam: "Outreach via mail en socials",
    body: "Het juiste bericht op het juiste moment, op mail en socials. Persoonlijk, nooit massaal.",
  },
  {
    rol: "06",
    naam: "Eigen skilllab",
    body: "Uw team bouwt en test nieuwe vaardigheden in een eigen lab. Wat werkt, schuift door naar de praktijk.",
  },
  {
    rol: "07",
    naam: "Agents",
    body: "Kleine AI-medewerkers, elk met één taak. Samen vormen ze één systeem dat doordraait.",
  },
  {
    rol: "08",
    naam: "Ads",
    body: "Een volledige 360-analyse van uw ads. Uw hele funnel van a tot z in kaart, push en pull, zodat u erop kunt sturen.",
  },
];

/** Welk station in de machine hoort bij welke functiekaart. */
const STATION_NAAR_KAART: Record<string, number> = {
  cabinet: 0, // Leads
  cashdesk: 1, // Resultaat / Reporting
  admin: 2, // Taken
  storefront: 3, // Content planning
  engine: 4, // Outreach
};

// De 3D-machine is zwaar (three.js): pas laden als hij in beeld scrolt.
const BreinMachine = lazy(() => import("@/components/ui/agentic-factory-3d"));

export function BreinFuncties() {
  const machineRef = useRef<HTMLDivElement>(null);
  const [machineLaden, setMachineLaden] = useState(false);
  // Reden waarom 3D niet start; null = 3D proberen.
  const [geen3d, setGeen3d] = useState<string | null>(null);
  const [poging, setPoging] = useState(0);
  const [actieveKaart, setActieveKaart] = useState<number | null>(null);
  const herstelTimer = useRef<number | null>(null);

  useEffect(() => {
    const el = machineRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          const reden = webglReden();
          if (reden) setGeen3d(reden);
          setMachineLaden(true);
          obs.disconnect();
        }
      },
      { rootMargin: "500px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // Meet waarom 3D bij bezoekers niet start, zodat we het kunnen oplossen.
  useEffect(() => {
    if (!geen3d) return;
    console.warn("Brein-machine: 3D start niet:", geen3d);
    trackEvent("machine_3d_unavailable", "tech", geen3d, {
      ua: navigator.userAgent,
      dpr: window.devicePixelRatio,
      poging,
    });
  }, [geen3d, poging]);

  // Een browser weigert soms tijdelijk een 3D-context (GPU nog bezig, oude
  // contexten nog niet opgeruimd). Probeer daarom één keer vanzelf opnieuw.
  const autoHerstart = useRef(0);
  const onUnavailable = useCallback((reden?: string) => {
    setGeen3d(reden || "De 3D-scène kon niet starten.");
    if (autoHerstart.current < 1) {
      autoHerstart.current += 1;
      window.setTimeout(() => {
        setGeen3d(null);
        setPoging((p) => p + 1);
      }, 1500);
    }
  }, []);

  const onStation = useCallback((id: string) => {
    const kaart = STATION_NAAR_KAART[id];
    if (kaart === undefined) return;
    setActieveKaart(kaart);
    if (herstelTimer.current) window.clearTimeout(herstelTimer.current);
    herstelTimer.current = window.setTimeout(() => setActieveKaart(null), 7000);
  }, []);

  return (
    <Section id="functies" tone="paper" className="v2-gordijn">
      <SectionHeader
        eyebrow="Functies van het brein"
        title="Alles wat het brein doet, toegelicht."
        lead="Zoeken, rapporteren, plannen en uitvoeren is de basis. Dit is wat het brein verder voor u doet."
      />

      {/* Het brein als machine: draaibaar, met vijf functies als stations. */}
      {/* De ref staat buiten Reveal: Reveal vervangt zijn eigen element bij de
          scroll-animatie, waardoor een observer op een element erbinnen doodgaat. */}
      <div ref={machineRef}>
        <Reveal index={0}>
          <div className="overflow-hidden rounded-brand border border-brand-line bg-black">
          {geen3d ? (
            <figure className="relative bg-black">
              <img
                src={machinePoster}
                alt="Het Commercieel Brein als machine met vijf stations: Leads, Outreach, Taken, Content en Resultaat"
                width={960}
                height={580}
                loading="lazy"
                decoding="async"
                className="mx-auto block h-auto w-full max-w-[960px]"
              />
              <figcaption className="flex flex-col items-center gap-3 px-5 pb-5 text-center">
                <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/45">
                  Commercieel Brein · vijf functies, één systeem
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setGeen3d(null);
                    setPoging((p) => p + 1);
                  }}
                  className="rounded-full border border-white/20 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.18em] text-white/70 transition-colors hover:border-brand-accent hover:text-brand-accent"
                >
                  Probeer 3D opnieuw
                </button>
                <span className="max-w-[60ch] text-[11px] text-white/35">{geen3d}</span>
              </figcaption>
            </figure>
          ) : machineLaden ? (
            <Suspense
              fallback={
                <div className="grid h-[480px] place-items-center bg-black">
                  <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/50">
                    Brein start op…
                  </p>
                </div>
              }
            >
              <BreinMachine
                key={poging}
                height="clamp(480px, 76vh, 720px)"
                onStation={(id: string) => onStation(id)}
                onUnavailable={onUnavailable}
              />
            </Suspense>
          ) : (
            <div className="grid h-[480px] place-items-center bg-black">
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/40">
                Uw commerciële brein
              </p>
            </div>
          )}
          </div>
        </Reveal>
      </div>

      <div className="mt-[18px] grid gap-[18px] sm:grid-cols-2 lg:grid-cols-4">
        {FUNCTIES.map((functie, i) => (
          <Reveal key={functie.rol} index={i} className="h-full">
            <article
              data-functie={functie.rol}
              className={`flex h-full flex-col rounded-brand border p-6 transition-colors duration-500 ${
                actieveKaart === i
                  ? "border-brand-accent bg-brand-accent/10"
                  : "border-brand-line bg-brand-paper"
              }`}
            >
              <p className="mb-4 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-brand-accent-ink">
                {functie.rol}
              </p>
              <h3 className="mb-2 font-display text-lg font-bold leading-snug tracking-[-0.015em]">
                {functie.naam}
              </h3>
              <p className="text-[13.5px] text-brand-ink-2">{functie.body}</p>
            </article>
          </Reveal>
        ))}
      </div>

      {/* De kern van het aanbod: u verzint het, wij installeren en beheren. */}
      <Reveal index={FUNCTIES.length} className="mt-[18px]">
        <article className="flex flex-col items-start gap-4 rounded-brand border border-brand-accent bg-brand-paper p-6 sm:flex-row sm:items-center sm:justify-between sm:p-7">
          <div>
            <h3 className="mb-1 font-display text-xl font-bold leading-snug tracking-[-0.015em]">
              U verzint het. Wij installeren en beheren het voor u.
            </h3>
            <p className="max-w-[60ch] text-[13.5px] text-brand-ink-2">
              Vertel ons wat u nodig heeft. Wij bouwen het, koppelen het aan uw tools en houden het draaiende.
            </p>
          </div>
          <span
            aria-hidden
            className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-brand-accent-ink"
          >
            Uw brief, ons brein
          </span>
        </article>
      </Reveal>
    </Section>
  );
}
