import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Linkedin, Mail } from "lucide-react";

/**
 * Hero-beeld voor Outreach as a Service: één signaal wordt één bericht.
 * Wissel tussen drie signalen; het bericht en de sequence passen zich aan.
 * Voorbeelddata.
 */
type Deel = string | { p: string };
const SIGNALEN: {
  tab: string;
  signaal: string;
  bron: string;
  bericht: Deel[];
  antwoord: string;
}[] = [
  {
    tab: "Vacature",
    signaal: "Installatiebedrijf Van Lier zoekt een Head of Sales",
    bron: "vacaturesite · 3 dagen geleden",
    bericht: [
      "Hoi Eva, ik zag dat ",
      { p: "Van Lier een Head of Sales zoekt" },
      ". Vaak betekent dat: de groei is er, maar de pijplijn hangt nog aan een paar mensen. ",
      { p: "Twee installateurs in Brabant" },
      " hebben dat opgevangen met een systeem dat elke week nieuwe gesprekken oplevert. Zal ik laten zien hoe?",
    ],
    antwoord: "Goede timing. Kun je donderdag om 10:00?",
  },
  {
    tab: "Nieuwe vestiging",
    signaal: "Logistiek Brouwer opent een vestiging in Venlo",
    bron: "nieuwsbericht · vandaag",
    bericht: [
      "Hoi Mark, gefeliciteerd met ",
      { p: "de nieuwe vestiging in Venlo" },
      ". Een nieuwe regio vraagt om nieuwe klanten, en die zitten vaak niet in uw huidige CRM. ",
      { p: "Voor verladers in Noord-Limburg" },
      " hebben we de lijst al grotendeels klaar. Interesse in een korte blik?",
    ],
    antwoord: "Stuur maar door, ik kijk er vanmiddag naar.",
  },
  {
    tab: "Investering",
    signaal: "SaaS-bedrijf Klokwerk haalt € 4 miljoen op",
    bron: "persbericht · 1 week geleden",
    bericht: [
      "Hoi Lotte, mooi nieuws over ",
      { p: "de investeringsronde van Klokwerk" },
      ". Na een ronde moet de pijplijn meestal snel twee keer zo groot. ",
      { p: "Twee scale-ups in HR-tech" },
      " deden dat zonder eerst vijf SDR's aan te nemen. Zin om te sparren?",
    ],
    antwoord: "Ja, plan maar iets in voor volgende week.",
  },
];

const SEQUENCE = [
  { dag: "Dag 1", kanaal: "mail", tekst: "Eerste bericht" },
  { dag: "Dag 3", kanaal: "linkedin", tekst: "Connectieverzoek" },
  { dag: "Dag 6", kanaal: "mail", tekst: "Korte follow-up" },
  { dag: "Dag 9", kanaal: "linkedin", tekst: "Bericht met case" },
];

export function OutreachComposer() {
  const reduce = useReducedMotion();
  const [actief, setActief] = useState(0);
  const [handmatig, setHandmatig] = useState(false);

  useEffect(() => {
    if (reduce || handmatig) return;
    const t = window.setInterval(() => setActief((a) => (a + 1) % SIGNALEN.length), 7000);
    return () => window.clearInterval(t);
  }, [reduce, handmatig]);

  const s = SIGNALEN[actief];

  return (
    <div className="w-full overflow-hidden rounded-[6px] border border-white/[.12] bg-[#0F0D0A] text-[13px] shadow-[0_30px_80px_-30px_rgba(0,0,0,0.8)]">
      <div role="tablist" aria-label="Signalen" className="flex border-b border-white/[.08]">
        {SIGNALEN.map((sig, i) => (
          <button
            key={sig.tab}
            role="tab"
            aria-selected={i === actief}
            onClick={() => {
              setActief(i);
              setHandmatig(true);
            }}
            className={`flex-1 px-3 py-3 font-mono text-[10.5px] font-bold uppercase tracking-[0.14em] transition-colors ${
              i === actief ? "bg-white/[.05] text-brand-accent" : "text-[#8C8378] hover:text-white"
            }`}
          >
            {sig.tab}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={actief}
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="grid gap-4 p-4"
        >
          <div className="flex items-start gap-3 rounded-[4px] border border-brand-accent/40 bg-brand-accent/[.08] px-3 py-2.5">
            <span className="mt-1 size-2 shrink-0 rounded-full bg-brand-accent" />
            <span>
              <span className="block text-white">{s.signaal}</span>
              <span className="font-mono text-[11px] text-[#A99F93]">signaal · {s.bron}</span>
            </span>
          </div>

          <p className="leading-relaxed text-[#E9E3DA]">
            {s.bericht.map((d, i) =>
              typeof d === "string" ? (
                <span key={i}>{d}</span>
              ) : (
                <mark key={i} className="rounded-[2px] bg-brand-accent/20 px-0.5 text-white">
                  {d.p}
                </mark>
              ),
            )}
          </p>

          <ol className="grid grid-cols-4 gap-1.5">
            {SEQUENCE.map((stap, i) => (
              <motion.li
                key={stap.dag}
                initial={reduce ? false : { opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + i * 0.12 }}
                className="rounded-[4px] border border-white/[.08] px-2 py-2"
              >
                <span className="flex items-center gap-1.5 font-mono text-[10px] text-[#A99F93]">
                  {stap.kanaal === "mail" ? <Mail className="size-3" /> : <Linkedin className="size-3" />}
                  {stap.dag}
                </span>
                <span className="mt-1 block text-[11.5px] leading-tight text-[#E9E3DA]">{stap.tekst}</span>
              </motion.li>
            ))}
          </ol>

          <motion.div
            initial={reduce ? false : { opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.75 }}
            className="ml-auto max-w-[80%] rounded-[10px] rounded-br-[2px] bg-emerald-500/15 px-3 py-2 text-emerald-200"
          >
            {s.antwoord}
            <span className="mt-0.5 block font-mono text-[10px] text-emerald-300/70">antwoord · in uw agenda gezet</span>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
