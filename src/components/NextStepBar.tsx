import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { X } from "lucide-react";
import { openBookingModal } from "@/components/booking/GlobalBookingModal";
import { trackCTA } from "@/lib/tracking";

/** Zwevende balk met een volgende stap voor kennispagina's waar bezoekers snel afhaken. */
const NextStepBar = ({ location }: { location: string }) => {
  const [show, setShow] = useState(false);
  const [closed, setClosed] = useState(() => sessionStorage.getItem("nextstep_closed") === "1");

  useEffect(() => {
    const t = setTimeout(() => setShow(true), 2500);
    return () => clearTimeout(t);
  }, []);

  if (closed || !show) return null;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-[calc(100%-2rem)] max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-border bg-card/95 backdrop-blur px-4 py-3 shadow-lg">
        <p className="text-sm text-foreground flex-1 min-w-[180px]">
          Wilt u dit laten werken in uw bedrijf?
        </p>
        <Link
          to="/pricing"
          onClick={() => trackCTA(`${location} — Bekijk de prijzen`, "/pricing")}
          className="text-sm font-medium text-muted-foreground hover:text-foreground underline-offset-4 hover:underline"
        >
          Bekijk de prijzen
        </Link>
        <button
          type="button"
          onClick={() => {
            trackCTA(`${location} — Boek een gratis call`, "booking");
            openBookingModal();
          }}
          className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90"
        >
          Boek een gratis call
        </button>
        <button
          type="button"
          aria-label="Sluiten"
          onClick={() => { sessionStorage.setItem("nextstep_closed", "1"); setClosed(true); }}
          className="text-muted-foreground hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default NextStepBar;
