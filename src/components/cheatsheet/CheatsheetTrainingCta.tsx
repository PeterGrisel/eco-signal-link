import { Link } from "react-router-dom";
import { Signal, ArrowRight, Check } from "lucide-react";
import { trackCTA } from "@/lib/tracking";

/**
 * Reusable upsell card linking from cheatsheets to the full Signaal training.
 * Styled to match the dark cheatsheet theme (#0B0B0B / #E3874F).
 *
 * Variants:
 * - default: large hero card (used at end of cheatsheets and on index)
 * - compact: slim inline strip (used mid-cheatsheet, after prompts section)
 */
const CheatsheetTrainingCta = ({
  full = true,
  variant = "default",
  trackLabel,
}: {
  full?: boolean;
  variant?: "default" | "compact";
  trackLabel?: string;
}) => {
  if (variant === "compact") {
    return (
      <div
        className={`${full ? "md:col-span-2" : ""} relative overflow-hidden rounded-md border border-[#E3874F]/30 bg-[#161616] px-4 py-3 md:px-5 md:py-3.5 flex items-center gap-3 md:gap-4`}
      >
        <div className="flex-shrink-0 w-8 h-8 rounded bg-[#E3874F]/15 border border-[#E3874F]/30 flex items-center justify-center">
          <Signal className="w-4 h-4 text-[#E3874F]" />
        </div>
        <div className="flex-1 min-w-0">
          <p
            className="text-[11px] md:text-[13px] uppercase tracking-wide text-white leading-tight"
            style={{ fontFamily: "Anton, sans-serif" }}
          >
            Wil je dit als <span className="text-[#E3874F]">volledig systeem</span> bouwen?
          </p>
          <p className="text-[10px] md:text-[11px] text-[#888] mt-0.5">
            7 lagen · 90 min · €97 eenmalig
          </p>
        </div>
        <Link
          to="/signaal"
          onClick={() =>
            trackCTA(
              trackLabel || "Cheatsheet Mid CTA — Bekijk training",
              "/signaal"
            )
          }
          className="group flex-shrink-0 inline-flex items-center gap-1.5 bg-[#E3874F] text-[#0B0B0B] px-3 py-1.5 md:px-4 md:py-2 rounded font-bold text-[10px] md:text-xs uppercase tracking-wider hover:opacity-90 transition-opacity whitespace-nowrap"
        >
          Training
          <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    );
  }

  return (
    <div
      className={`${full ? "md:col-span-2" : ""} relative overflow-hidden rounded-md border border-[#E3874F]/40 bg-gradient-to-br from-[#1a1410] via-[#181818] to-[#181818] p-5 md:p-6`}
    >
      {/* Glow accent */}
      <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[#E3874F]/10 blur-3xl" />

      <div className="relative flex flex-col md:flex-row items-start md:items-center gap-5">
        <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-[#E3874F]/15 border border-[#E3874F]/30 flex items-center justify-center">
          <Signal className="w-6 h-6 text-[#E3874F]" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            <span
              className="text-[9px] font-bold tracking-[.14em] uppercase text-[#0B0B0B] bg-[#E3874F] px-2 py-0.5 rounded-sm"
              style={{ fontFamily: "Fira Sans, sans-serif" }}
            >
              Volledige training
            </span>
            <span className="text-[10px] text-[#888] tracking-[.08em] uppercase">90 min · 7 lagen</span>
          </div>
          <h3
            className="text-xl md:text-2xl uppercase leading-tight text-white"
            style={{ fontFamily: "Anton, sans-serif" }}
          >
            Bouw je eigen <span className="text-[#E3874F]">signaaldetectiesysteem</span>
          </h3>
          <p className="text-[12px] text-[#BFBFBF] mt-1.5 leading-relaxed">
            Deze cheatsheet is een proeve. De volledige training neemt je mee in 7 lagen — van signaal tot pipeline — met AI-agent, blueprint en installatie-checklists.
          </p>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2.5 text-[10px] text-[#888]">
            <span className="flex items-center gap-1">
              <Check className="w-3 h-3 text-[#E3874F]" /> Direct toegang
            </span>
            <span className="flex items-center gap-1">
              <Check className="w-3 h-3 text-[#E3874F]" /> Eenmalig €97
            </span>
            <span className="flex items-center gap-1">
              <Check className="w-3 h-3 text-[#E3874F]" /> Partner badge
            </span>
          </div>
        </div>

        <Link
          to="/signaal"
          onClick={() => trackCTA("Cheatsheet Training CTA — Bekijk training", "/signaal")}
          className="group flex-shrink-0 inline-flex items-center gap-2 bg-[#E3874F] text-[#0B0B0B] px-5 py-2.5 rounded font-bold text-xs uppercase tracking-wider hover:opacity-90 transition-opacity whitespace-nowrap"
        >
          Bekijk training
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </div>
  );
};

export default CheatsheetTrainingCta;
