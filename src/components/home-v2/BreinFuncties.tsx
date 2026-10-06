import { Reveal } from "@/components/v2/Reveal";
import { Section } from "@/components/v2/Section";
import { SectionHeader } from "@/components/v2/SectionHeader";

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
    naam: "Designer",
    body: "Beeld, pagina's en campagnes in uw huisstijl. Zonder aparte ontwerper aan te nemen.",
  },
];

export function BreinFuncties() {
  return (
    <Section id="functies" tone="paper" className="v2-gordijn">
      <SectionHeader
        eyebrow="Functies van het brein"
        title="Alles wat het brein doet, toegelicht."
        lead="Zoeken, rapporteren, plannen en uitvoeren is de basis. Dit is wat het brein verder voor u doet."
      />
      <div className="grid gap-[18px] sm:grid-cols-2 lg:grid-cols-4">
        {FUNCTIES.map((functie, i) => (
          <Reveal key={functie.rol} index={i} className="h-full">
            <article className="flex h-full flex-col rounded-brand border border-brand-line bg-brand-paper p-6">
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
