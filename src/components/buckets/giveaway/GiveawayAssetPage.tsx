import { ReactNode } from "react";
import { BOOKING_URL } from "@/content/copy";
import { trackCTA } from "@/lib/tracking";
import GiveawayRenderer, { GiveawayPayload } from "./GiveawayRenderer";

interface Item {
  title: string;
  subtitle?: string | null;
  intro?: string | null;
  layout: string;
  slot_label?: string | null;
  type_label?: string | null;
  payload: GiveawayPayload;
}

interface Props {
  item: Item;
  ctaText?: string;
  toolbar?: ReactNode;
}

const splitTitle = (t: string) => {
  const parts = t.split(/\s+/);
  if (parts.length < 2) return [t, ""];
  const last = parts.pop() as string;
  return [parts.join(" "), last];
};

export const GiveawayAssetPage = ({ item, ctaText = "Plan uw Groeiplan-sessie →", toolbar }: Props) => {
  const [a, b] = splitTitle(item.title);
  const handleCta = () => trackCTA(`Give-Away · ${item.title}`, BOOKING_URL);
  return (
    <div className="gw-stage">
      <div className="gw-stage-inner">
        {toolbar && (
          <div className="js-chrome flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <span className="block w-5 h-px bg-[#E8945A]" />
              <span className="uppercase tracking-[0.14em] text-[11px] text-[#E8945A] font-display font-semibold">
                {[item.type_label, item.slot_label].filter(Boolean).join(" · ")}
              </span>
            </div>
            {toolbar}
          </div>
        )}

        <div className="js-asset bg-[#1A1A1A] border border-[#2E2E2E] rounded-xl px-6 md:px-12 py-10 md:py-11 shadow-[0_24px_50px_-20px_rgba(0,0,0,0.6)]">
          <div className="border-b border-[#2E2E2E] pb-6 mb-6">
            <div className="flex items-center gap-2.5 mb-3.5">
              <span className="block w-[22px] h-px bg-[#E8945A]" />
              <span className="uppercase tracking-[0.14em] text-[10.5px] text-[#E8945A] font-display font-semibold">
                {[item.slot_label, item.type_label].filter(Boolean).join(" · ")}
              </span>
            </div>
            <h1 className="m-0 font-display font-bold text-[28px] md:text-[35px] leading-[1.1] tracking-tight text-[#EEEAE4]">
              {a}{" "}
              {b && <span className="italic font-medium text-[#E8945A]">{b}</span>}
            </h1>
            {item.intro && (
              <p className="mt-3 max-w-[580px] text-[#998D7D] text-[15px] leading-relaxed">{item.intro}</p>
            )}
          </div>

          <GiveawayRenderer layout={item.layout} payload={item.payload} />

          <div className="border-t border-[#2E2E2E] mt-9 pt-5 flex items-end justify-between gap-4 flex-wrap">
            <div>
              <div className="font-display font-bold text-[17px] text-[#EEEAE4] tracking-tight">
                B2B<span className="text-[#E8945A]">GroeiMachine</span>
              </div>
              <div className="text-[10.5px] text-[#998D7D] mt-1 font-display tracking-wide">
                Powered by Rebel Force · b2bgroeimachine.io
              </div>
            </div>
            <a
              href={BOOKING_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleCta}
              className="bg-[#E8945A] text-[#121212] hover:bg-[#F0A968] font-display font-semibold text-[13.5px] px-4 py-2.5 rounded-md whitespace-nowrap transition-colors no-underline"
            >
              {ctaText}
            </a>
          </div>
        </div>

        <div className="gw-no-print mt-6 flex items-center justify-center">
          <a
            href={BOOKING_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleCta}
            className="inline-flex items-center gap-2 bg-[#E8945A] text-[#121212] hover:bg-[#F0A968] font-display font-semibold text-sm px-5 py-3 rounded-md transition-colors no-underline"
          >
            Bespreek jouw ingevulde template →
          </a>
        </div>
      </div>
    </div>
  );
};

export default GiveawayAssetPage;