/**
 * Centrale bron voor alle marketing-copy en CTA-variabelen.
 * Wijzig hier → consistent op de hele site.
 *
 * Regels:
 * - Geen em-dashes (gebruik —‐vrij; gebruik puntkomma of nieuwe zin)
 * - B1 Nederlands, max 12 woorden per zin, 'u/uw'
 * - CTA-labels: minimalistisch, geen specifieke meeting-belofte
 */

export const BOOKING_URL =
  "https://app.usemotion.com/meet/Rebel-Force/meeting";

/** CTA-labels en hun bijbehorende doel-URL */
export const CTA = {
  /** Hoofd-CTA: gebruikt in hero, navbar, sticky, sections */
  nulmeting: {
    label: "Plan de nulmeting →",
    labelShort: "Plan de nulmeting",
    href: BOOKING_URL,
    external: true,
  },
  /** Soft CTA: hoe het werkt anker */
  hoeHetWerkt: {
    label: "Hoe het werkt",
    href: "#hoe-het-werkt",
    external: false,
  },
  /** Tertiaire CTA: situatie bespreken (in body-tekst) */
  bespreekSituatie: {
    label: "Bespreek uw situatie →",
    href: BOOKING_URL,
    external: true,
  },
} as const;

/** Vaste propositie- en sectie-teksten die meerdere keren voorkomen */
export const COPY = {
  proposition: {
    heroBody:
      "Wij brengen uw sales- en serviceproces in kaart en automatiseren wat handmatig loopt. Begin met een nulmeting.",
    signalHeading:
      "Samen bepalen we welke signalen en reacties terechtkomen",
    signalSubtext:
      "Geen algemene demo. We kijken welke signalen bij uw ICP passen en hoe we die samen kwalificeren.",
  },
  ctaSection: {
    headingLine1: "Klaar voor uw",
    headingAccent: "nulmeting?",
    body:
      "30 minuten. Wij brengen uw proces in kaart en laten zien waar de winst zit. Geen verkoopgesprek.",
    speakWith: "Spreek direct met Peter",
    fineprint: "€0 · 30 minuten · Vrijblijvend",
  },
  process: {
    eyebrow: "Van nulmeting tot resultaat",
  },
} as const;

export type CtaKey = keyof typeof CTA;