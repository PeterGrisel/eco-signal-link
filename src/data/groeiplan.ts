export type Cell = {
  id: string;
  num: string;
  title: string;
  prompt: string;
  phase: "voor" | "tijdens" | "na";
};

/** De negen vakken van het 1-pagina groeiplan. */
export const CELLS: Cell[] = [
  { id: "doelmarkt",     num: "01", title: "Mijn doelmarkt",        prompt: "Wie is mijn ideale klant en wie nadrukkelijk niet?", phase: "voor" },
  { id: "boodschap",     num: "02", title: "Mijn boodschap",        prompt: "Welk probleem los ik op, in de woorden van mijn klant?", phase: "voor" },
  { id: "kanalen",       num: "03", title: "Mijn kanalen",          prompt: "Waar bereik ik mijn koper en in welke volgorde?", phase: "voor" },
  { id: "vangmechanisme",num: "04", title: "Mijn vangmechanisme",   prompt: "Hoe vang ik elke vorm van interesse?", phase: "tijdens" },
  { id: "opwarm",        num: "05", title: "Mijn opwarmsysteem",    prompt: "Hoe bouw ik vertrouwen op tot het koopmoment?", phase: "tijdens" },
  { id: "conversie",     num: "06", title: "Mijn conversiestrategie", prompt: "Hoe wordt een warm gesprek een getekende deal?", phase: "tijdens" },
  { id: "ervaring",      num: "07", title: "Mijn klantervaring",    prompt: "Hoe lever ik een ervaring die wordt doorverteld?", phase: "na" },
  { id: "waarde",        num: "08", title: "Mijn klantwaarde",      prompt: "Hoe groeit de waarde per klant, maand op maand?", phase: "na" },
  { id: "referral",      num: "09", title: "Mijn referralmotor",    prompt: "Hoe organiseer ik aanbevelingen, in plaats van erop te hopen?", phase: "na" },
];

/** Ingevulde vakken in vaste volgorde, als leesbare regels. */
export const ingevuldeVakken = (fields: Record<string, unknown> | null | undefined) =>
  CELLS.map((c) => ({ ...c, tekst: String(fields?.[c.id] ?? "").trim() })).filter((c) => c.tekst);
