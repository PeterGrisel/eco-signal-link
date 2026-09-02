import { Link } from "react-router-dom";
import {
  BarChart3,
  Database,
  Radar,
  Send,
  Sparkles,
  Workflow,
  type LucideIcon,
} from "lucide-react";
import { Reveal } from "@/components/v2/Reveal";
import {
  groeistackCategories,
  groeistackSeed,
  faviconFor,
  type GroeistackCategory,
} from "@/data/groeistack";
import { groeistackLogo } from "@/data/groeistackLogos";

/**
 * De toolflow: zes schakels van signaal tot dashboard, met de tools per schakel.
 *
 * Deze stond eerder op de oude "hoe het werkt"-pagina en hoort thuis onder de
 * werkomgeving: de film laat zien wat er gebeurt, dit laat zien waarmee. De
 * volgorde is de flow — een signaal komt binnen, wordt verrijkt, geactiveerd,
 * belandt in het CRM, wordt gewogen en verschijnt in het dashboard.
 *
 * Overgezet naar de merktokens; het origineel gebruikte nog de oude palet-
 * variabelen en zou hier als een vreemd eiland liggen.
 */

const ICONEN: Record<GroeistackCategory["icon"], LucideIcon> = {
  radar: Radar,
  database: Database,
  send: Send,
  workflow: Workflow,
  sparkles: Sparkles,
  barchart: BarChart3,
};

/** Ons eigen logo als we het hebben, anders de favicon van de leverancier. */
function toolLogo(naam: string, website: string) {
  return groeistackLogo(naam) ?? faviconFor(website);
}

export function Toolflow() {
  return (
    <>
      <ol className="grid gap-[22px] md:grid-cols-2 lg:grid-cols-3">
        {groeistackCategories.map((cat, i) => {
          const Icon = ICONEN[cat.icon];
          const tools = groeistackSeed.filter((t) => t.category === cat.key);
          return (
            <Reveal key={cat.key} index={i} className="h-full">
              <li className="flex h-full flex-col overflow-hidden rounded-brand border border-brand-line bg-brand-paper">
                <span
                  aria-hidden
                  className={`block h-[3px] w-full ${i === 0 ? "bg-brand-accent" : "bg-brand-ink"}`}
                />
                <div className="flex grow flex-col px-6 pb-6 pt-[21px]">
                  <div className="mb-4 flex items-center gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[2px] border border-brand-line bg-brand-mist">
                      <Icon className="h-4 w-4 text-brand-accent-ink" strokeWidth={1.7} />
                    </span>
                    <div className="min-w-0">
                      <p className="font-mono text-[9.5px] font-bold uppercase tracking-[0.16em] text-brand-ink-3">
                        Schakel {String(i + 1).padStart(2, "0")}
                      </p>
                      <h3 className="font-display text-[16px] font-bold tracking-[-0.015em]">
                        {cat.label}
                      </h3>
                    </div>
                  </div>
                  <p className="mb-4 text-[13.5px] text-brand-ink-2">{cat.blurb}</p>
                  <ul className="mt-auto flex flex-wrap gap-1.5">
                    {tools.map((tool) => (
                      <li
                        key={tool.name}
                        className="inline-flex items-center gap-1.5 rounded-[2px] border border-brand-line bg-brand-mist/70 px-2 py-1"
                      >
                        <img
                          src={toolLogo(tool.name, tool.website)}
                          alt=""
                          aria-hidden
                          loading="lazy"
                          className="h-3.5 w-3.5 shrink-0 rounded-[1px] object-contain"
                        />
                        <span className="whitespace-nowrap text-[11.5px] text-brand-ink-2">
                          {tool.name}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            </Reveal>
          );
        })}
      </ol>

      <Reveal className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-brand-line pt-8">
        <p className="max-w-[52ch] text-[14px] text-brand-ink-2">
          Dit is een selectie. De volledige groeistack telt bijna driehonderd
          tools, met per tool waar hij goed in is en waar hij afhaakt.
        </p>
        <Link
          to="/groeistack"
          className="ml-auto font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-brand-accent-ink underline-offset-4 hover:underline"
        >
          Bekijk de volledige groeistack →
        </Link>
      </Reveal>
    </>
  );
}
