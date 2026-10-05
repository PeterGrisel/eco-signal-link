import { ArrowRight } from "lucide-react";
import { openBookingModal } from "@/components/booking/GlobalBookingModal";
import { trackCTA } from "@/lib/tracking";

type Props = { club: string; accent: string; location: string };

/** Duidelijke volgende stap halverwege een clubpagina. */
const ClubCta = ({ club, accent, location }: Props) => (
  <section className="py-12 md:py-16 border-t border-border">
    <div className="container mx-auto px-4 md:px-6">
      <div
        className="rounded-2xl border border-border bg-card p-6 md:p-10 flex flex-col md:flex-row md:items-center gap-6 justify-between"
        style={{ borderLeft: `4px solid ${accent}` }}
      >
        <div className="max-w-xl">
          <p className="text-xs uppercase tracking-widest text-muted-foreground">Volgende stap</p>
          <h2 className="mt-2 font-display text-2xl md:text-3xl font-bold text-foreground">
            Wat kan dit voor {club} doen?
          </h2>
          <p className="mt-2 text-muted-foreground">
            In 30 minuten laat Peter zien welke bedrijven bij {club} passen. Gratis en zonder verplichting.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            trackCTA(`${location} — Plan een gesprek over ${club}`, "booking");
            openBookingModal();
          }}
          className="inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 font-semibold shrink-0 transition-opacity hover:opacity-90"
          style={{ backgroundColor: accent, color: accent.toUpperCase() === "#FFD200" ? "#0A2A66" : "#FFFFFF" }}
        >
          Plan een gesprek over {club} <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  </section>
);

export default ClubCta;
