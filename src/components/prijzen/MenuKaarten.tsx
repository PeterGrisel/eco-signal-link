import { Button } from "@/components/v2/Button";
import { Reveal } from "@/components/v2/Reveal";
import { BIJ_ELK_ABONNEMENT, MENUS, euro, reken } from "@/data/breinPrijzen";

/**
 * De drie abonnementen als kaarten: prijs, voor wie, wat het brein overneemt.
 * Prijzen en teksten komen uit `src/data/breinPrijzen.ts`, dus homepage,
 * prijspagina en dienstpagina's tonen hetzelfde.
 */
export function MenuKaarten() {
  return (
    <div>
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
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <h3 className="font-display text-xl font-bold tracking-[-0.015em]">{menu.naam}</h3>
                    {menu.top && (
                      <span className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-brand-accent-ink">
                        Aanbevolen
                      </span>
                    )}
                  </div>
                  <p className="font-display text-[clamp(30px,3vw,40px)] font-black leading-none tracking-[-0.03em]">
                    {euro(r.prijs)}
                  </p>
                  <p className="mt-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-brand-ink-3">
                    per maand, all-in
                  </p>

                  <p className="mt-5 text-[13.5px] italic text-brand-ink-2">{menu.voorWie}</p>

                  <div className="mt-4 border-t border-brand-line pt-4 text-[13.5px] leading-relaxed">
                    <p>
                      {menu.opbouw && <span className="text-brand-ink-2">{menu.opbouw} </span>}
                      <b className="font-semibold">{menu.kern}</b>
                    </p>
                    <p className="mt-1.5 text-brand-ink-2">{menu.wat}</p>
                    {menu.extra && (
                      <p className="mt-3 flex items-start gap-2.5 text-brand-ink">
                        <span aria-hidden className="mt-[7px] size-[5px] shrink-0 rounded-full bg-brand-accent" />
                        {menu.extra}
                      </p>
                    )}
                  </div>

                  <div className="mt-auto pt-6">
                    <Button href="/groeiplan#invullen" variant={menu.top ? "primary" : "outline"}>
                      Maak uw groeiplan
                    </Button>
                  </div>
                </div>
              </article>
            </Reveal>
          );
        })}
      </div>
      <Reveal className="mt-5">
        <p className="text-[13px] text-brand-ink-2">
          {BIJ_ELK_ABONNEMENT.map((punt, i) => (
            <span key={punt}>
              {i > 0 && <span aria-hidden className="mx-2 text-brand-accent">·</span>}
              {punt}
            </span>
          ))}
        </p>
      </Reveal>
    </div>
  );
}
