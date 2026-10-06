import { Reveal } from "@/components/v2/Reveal";
import { MENUS, euro, reken } from "@/data/breinPrijzen";

/**
 * De drie abonnementen als kaarten. Prijzen komen uit
 * `src/data/breinPrijzen.ts`, dus homepage en prijspagina tonen hetzelfde.
 */
export function MenuKaarten() {
  return (
    <div className="grid items-stretch gap-[18px] md:grid-cols-3">
      {MENUS.map((menu, i) => {
        const r = reken(menu.ids);
        return (
          <Reveal key={menu.naam} index={i} className="h-full">
            <article
              className={`flex h-full flex-col overflow-hidden rounded-brand border ${
                menu.top ? "border-brand-accent bg-brand-tint" : "border-brand-line bg-brand-paper"
              }`}
            >
              <span aria-hidden className={`h-[3px] w-full ${menu.top ? "bg-brand-accent" : "bg-brand-ink"}`} />
              <div className="flex grow flex-col px-6 pb-7 pt-[23px]">
                {menu.label && (
                  <span className="mb-3 block font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-brand-accent-ink">{menu.label}</span>
                )}
                <h3 className="mb-4 font-display text-xl font-bold tracking-[-0.015em]">{menu.naam}</h3>
                <p className="font-display text-[clamp(30px,3vw,40px)] font-black leading-none tracking-[-0.03em]">
                  {euro(r.prijs)}
                </p>
                <p className="mt-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-brand-ink-3">
                  per maand, all-in
                </p>
                <ul className="mt-5 space-y-2 text-[13px] text-brand-ink-2">
                  {menu.inhoud.map((punt) => (
                    <li key={punt} className="flex items-start gap-2.5">
                      <span aria-hidden className="mt-[7px] size-[5px] shrink-0 rounded-full bg-brand-accent" />
                      {punt}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          </Reveal>
        );
      })}
    </div>
  );
}
