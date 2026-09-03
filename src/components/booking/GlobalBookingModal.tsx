import * as React from "react";
import { Link } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ExternalLink, Check, Sparkles, Video } from "lucide-react";
import { COPY, BOOKING_URL } from "@/content/copy";
import { trackEvent } from "@/lib/tracking";

interface GlobalBookingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  prefillData?: { name?: string; email?: string; company?: string };
}

const MEETING_URL = BOOKING_URL;

export function GlobalBookingModal({ open, onOpenChange, prefillData }: GlobalBookingModalProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const g = COPY.groeiplan;
  // Het Groeiplan-paneel hoort alleen bij de groeiplan-pagina; elders tonen we
  // enkel de agenda.
  const toonGroeiplan =
    typeof window !== "undefined" && window.location.pathname.startsWith("/groeiplan");

  const meetingUrl = React.useMemo(() => {
    const url = new URL(MEETING_URL);
    if (prefillData?.name) url.searchParams.set("name", prefillData.name);
    if (prefillData?.email) url.searchParams.set("email", prefillData.email);
    return url.toString();
  }, [prefillData]);

  React.useEffect(() => {
    if (!open) return;
    trackEvent("demo_modal_open", "conversion", "Booking modal geopend", {
      source: window.location.pathname,
      has_prefill: !!(prefillData?.email || prefillData?.name),
    });
  }, [open]);


  // Luister naar boekings-events uit de agenda-iframe (Outlook Book with me),
  // zodat we zien of een geopende kalender ook echt tot een afspraak leidt.
  React.useEffect(() => {
    const gezien = new Set<string>();
    const log = (naam: string, label: string) => {
      if (gezien.has(naam)) return;
      gezien.add(naam);
      trackEvent(naam, "conversion", label, { source: window.location.pathname });
    };

    const onMessage = (e: MessageEvent) => {
      const origin = typeof e.origin === "string" ? e.origin : "";
      const vertrouwd =
        origin.includes("outlook.office.com") ||
        origin.includes("outlook.office365.com") ||
        origin.includes("microsoft");
      if (!vertrouwd) return;

      const ruw = typeof e.data === "string" ? e.data : JSON.stringify(e.data ?? "");
      const tekst = ruw.toLowerCase();

      if (tekst.includes("bookingconfirmed") || tekst.includes("bookingsuccess") || tekst.includes("meetingbooksucceeded")) {
        log("demo_booked", "Afspraak geboekt via agenda");
        return;
      }
      if (tekst.includes("bookingfailed") || tekst.includes("error")) {
        log("booking_failed", "Boeking in agenda mislukt");
      }
    };

    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);


  // Meet of de kalender-iframe daadwerkelijk laadt (anders is een lege modal
  // niet te onderscheiden van een bezoeker die niet boekt).
  React.useEffect(() => {
    if (!open) return;
    let gemeld = false;
    const check = window.setInterval(() => {
      if (gemeld) return;
      const iframe = containerRef.current?.querySelector("iframe");
      if (iframe) {
        gemeld = true;
        window.clearInterval(check);
        trackEvent("booking_calendar_loaded", "conversion", "Agenda geladen", {
          source: window.location.pathname,
        });
      }
    }, 400);
    const stop = window.setTimeout(() => {
      window.clearInterval(check);
      if (!gemeld) {
        trackEvent("booking_calendar_failed", "conversion", "Agenda niet geladen", {
          source: window.location.pathname,
        });
      }
    }, 8000);
    return () => {
      window.clearInterval(check);
      window.clearTimeout(stop);
    };
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`${toonGroeiplan ? "sm:max-w-[700px] lg:max-w-[1100px]" : "sm:max-w-[620px]"} max-h-[95vh] lg:h-[800px] p-0 overflow-y-auto lg:overflow-hidden bg-background border border-glow flex flex-col`}>
        <div className={`grid ${toonGroeiplan ? "lg:grid-cols-[450px_1fr]" : ""} lg:h-full lg:overflow-hidden`}>
          
          {/* Left panel: What they get (Groeiplan overview) */}
          {toonGroeiplan && (
          <div className="p-6 md:p-8 lg:p-10 bg-[#0d1321] border-b lg:border-b-0 lg:border-r border-glow flex flex-col justify-between overflow-y-auto lg:h-full">

            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-medium text-primary mb-4">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Inclusief na de sessie</span>
              </div>
              
              <h3 className="font-display font-bold text-2xl md:text-3xl tracking-tight text-foreground mb-3">
                Uw 1-Pagina Groeiplan
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                In een sessie van 60 minuten brengen we uw commerciële groeimotor terug naar één helder A4:
              </p>

              {/* 3x3 grid overview */}
              <div className="grid grid-cols-3 gap-2.5 mb-6">
                {g.cells.map((cell) => (
                  <div 
                    key={cell.num} 
                    className="bg-background/40 border border-glow/40 rounded-lg p-2.5 flex flex-col justify-between min-h-[90px] hover:border-primary/30 transition-colors"
                  >
                    <span className="font-display text-[10px] font-bold text-primary tracking-wider mb-1">
                      {cell.num}
                    </span>
                    <h4 className="font-display font-semibold text-[11px] leading-tight text-foreground">
                      {cell.title}
                    </h4>
                  </div>
                ))}
              </div>

              {/* Phases info */}
              <div className="space-y-2 mb-6">
                <div className="flex items-start gap-2 text-xs">
                  <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span className="text-muted-foreground"><strong>Fase 1:</strong> Doelmarkt, boodschap en kanalen (Voor)</span>
                </div>
                <div className="flex items-start gap-2 text-xs">
                  <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span className="text-muted-foreground"><strong>Fase 2:</strong> Vangmechanisme, opwarmen en conversie (Tijdens)</span>
                </div>
                <div className="flex items-start gap-2 text-xs">
                  <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span className="text-muted-foreground"><strong>Fase 3:</strong> Klantervaring, klantwaarde en referral (Na)</span>
                </div>
              </div>

              {/* Demo explanation CTA */}
              <div className="mt-5 p-3 rounded-lg bg-primary/5 border border-glow/40">
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Wil u eerst meer uitleg over onze werkwijze?{" "}
                  <Link 
                    to="/demo" 
                    onClick={() => onOpenChange(false)}
                    className="text-primary hover:underline font-semibold inline-flex items-center gap-1"
                  >
                    Bekijk de 3-minuten video
                    <Video className="w-3.5 h-3.5" />
                  </Link>
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-glow/40 mt-4">
              <p className="text-[11px] text-muted-foreground/80 leading-relaxed italic">
                "Geen lang abstract adviesrapport. Wel een praktisch groeiplan waarmee u direct ziet waar groei nu lekt."
              </p>
            </div>
          </div>
          )}


          {/* Right panel: Booking Form */}
          <div className="flex flex-col h-full lg:overflow-hidden">
            <div className="px-6 pt-6 pb-2 border-b border-glow/20 shrink-0">
              <DialogTitle className="text-lg md:text-xl font-display font-bold">Boek een gratis call</DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground">
                Kies een moment dat u uitkomt. Wij bevestigen de afspraak per e-mail.
              </DialogDescription>
            </div>
            
            <div className="p-4 md:p-6 flex-1 overflow-y-auto min-h-[520px] lg:min-h-0 flex flex-col justify-between gap-4">
              <div ref={containerRef} className="flex-1 min-h-[460px]">
                <iframe
                  src={meetingUrl}
                  title="Agenda van Peter"
                  className="w-full h-full min-h-[460px] rounded-lg border border-glow/20 bg-background"
                  allow="camera; microphone; clipboard-write"
                />
              </div>

              <div className="text-center pt-4 border-t border-glow/10 shrink-0">
                <a
                  href={meetingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() =>
                    trackEvent("booking_open_new_tab", "conversion", "Agenda in nieuw tabblad", {
                      source: window.location.pathname,
                    })
                  }
                  className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  Ziet u geen agenda? Open in nieuw tabblad
                </a>
              </div>
            </div>

          </div>

        </div>
      </DialogContent>
    </Dialog>
  );
}

type BookingPrefill = { name?: string; email?: string; company?: string };

export function BookingModalHost() {
  const [open, setOpen] = React.useState(false);
  const [prefill, setPrefill] = React.useState<BookingPrefill | undefined>();
  React.useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<BookingPrefill | undefined>).detail;
      setPrefill(detail && Object.keys(detail).length ? detail : undefined);
      setOpen(true);
    };
    window.addEventListener("lovable:open-booking", handler);
    return () => window.removeEventListener("lovable:open-booking", handler);
  }, []);
  return <GlobalBookingModal open={open} onOpenChange={setOpen} prefillData={prefill} />;
}

/** `prefill` vult het agenda-formulier vast in, bijvoorbeeld het e-mailadres
 *  dat de bezoeker in de hero heeft ingetypt. */
export function openBookingModal(prefill?: BookingPrefill) {
  window.dispatchEvent(new CustomEvent("lovable:open-booking", { detail: prefill }));
}