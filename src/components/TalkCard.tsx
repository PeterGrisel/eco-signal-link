import { Button } from "@/components/ui/button";
import CtaLink from "@/components/CtaLink";
import peterAsset from "@/assets/peter.gif.asset.json";

/**
 * Kaartje met de zwaaiende Peter-GIF en een directe boek-CTA.
 */
const TalkCard = ({ className = "", location = "Hero" }: { className?: string; location?: string }) => (
  <div
    className={`flex items-center gap-4 rounded-2xl border border-foreground/10 bg-card/70 p-2 pr-4 backdrop-blur shadow-[0_8px_40px_-16px_rgba(0,0,0,0.7)] w-full max-w-[340px] ${className}`}
  >
    <div className="relative h-[84px] w-16 shrink-0 overflow-hidden rounded-lg border border-foreground/10 bg-gradient-to-br from-neutral-800 to-neutral-950">
      <img
        src={peterAsset.url}
        alt="Peter Grisel zwaait"
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover object-[center_30%]"
      />
    </div>
    <div className="flex flex-1 flex-col gap-1.5 py-2">
      <h4 className="font-display text-base font-semibold tracking-tight text-foreground">Praat met Peter</h4>
      <p className="text-[11px] uppercase tracking-[0.08em] text-muted-foreground">Oprichter · B2B Groeimachine</p>
      <Button variant="hero" size="sm" className="mt-1 w-full rounded-full" asChild>
        <CtaLink intent="gratisScan" location={location}>
          Ik wil schalen!
        </CtaLink>
      </Button>
    </div>
  </div>
);

export default TalkCard;
