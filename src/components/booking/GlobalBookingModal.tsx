import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ExternalLink, Check, Sparkles } from "lucide-react";
import { COPY } from "@/content/copy";
import { trackEvent } from "@/lib/tracking";

interface GlobalBookingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  prefillData?: { name?: string; email?: string; company?: string };
}

const HUBSPOT_MEETING_URL = "https://meetings-eu1.hubspot.com/peter-grisel";
const HUBSPOT_EMBED_SCRIPT = "https://static.hsappstatic.net/MeetingsEmbed/ex/MeetingsEmbedCode.js";

export function GlobalBookingModal({ open, onOpenChange, prefillData }: GlobalBookingModalProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const g = COPY.groeiplan;

  const meetingUrl = React.useMemo(() => {
    const url = new URL(HUBSPOT_MEETING_URL);
    if (prefillData?.name) {
      const parts = prefillData.name.trim().split(" ");
      url.searchParams.set("firstName", parts[0] || "");
      if (parts.length > 1) url.searchParams.set("lastName", parts.slice(1).join(" "));
    }
    if (prefillData?.email) url.searchParams.set("email", prefillData.email);
    if (prefillData?.company) url.searchParams.set("company", prefillData.company);
    return url.toString();
  }, [prefillData]);

  React.useEffect(() => {
    if (!open) return;
    trackEvent("demo_modal_open", "conversion", "Groeiplan booking modal", {
      source: window.location.pathname,
      has_prefill: !!(prefillData?.email || prefillData?.name),
    });
    const timer = setTimeout(() => {
      document.querySelectorAll(`script[src="${HUBSPOT_EMBED_SCRIPT}"]`).forEach((s) => s.remove());
      const script = document.createElement("script");
      script.src = HUBSPOT_EMBED_SCRIPT;
      script.async = true;
      document.body.appendChild(script);
    }, 150);
    return () => clearTimeout(timer);
  }, [open]);

  // Listen for HubSpot meeting-booked postMessage and fire conversion event.
  React.useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      const data = e.data as { meetingBookSucceeded?: boolean } | undefined;
      if (data && data.meetingBookSucceeded) {
        trackEvent("demo_booked", "conversion", "Groeiplan sessie geboekt", {
          source: window.location.pathname,
        });
      }
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] lg:max-w-[1100px] max-h-[95vh] lg:h-[800px] p-0 overflow-y-auto lg:overflow-hidden bg-background border border-glow flex flex-col">
        <div className="grid lg:grid-cols-[450px_1fr] lg:h-full lg:overflow-hidden">
          
          {/* Left panel: What they get (Groeiplan overview) */}
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
            </div>

            <div className="pt-4 border-t border-glow/40">
              <p className="text-[11px] text-muted-foreground/80 leading-relaxed italic">
                "Geen lang abstract adviesrapport. Wel een praktisch groeiplan waarmee u direct ziet waar groei nu lekt."
              </p>
            </div>
          </div>

          {/* Right panel: HubSpot Booking Form */}
          <div className="flex flex-col h-full lg:overflow-hidden">
            <div className="px-6 pt-6 pb-2 border-b border-glow/20 shrink-0">
              <DialogTitle className="text-lg md:text-xl font-display font-bold">Plan uw 60-minuten Groeiplan-sessie</DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground">
                Kies een moment dat u uitkomt. Wij bevestigen de afspraak per e-mail.
              </DialogDescription>
            </div>
            
            <div className="p-4 md:p-6 flex-1 overflow-y-auto min-h-[500px] lg:min-h-0 flex flex-col justify-between">
              <div className="flex-1">
                <div
                  ref={containerRef}
                  className="meetings-iframe-container"
                  data-src={`${meetingUrl}?embed=true`}
                />
              </div>
              
              <div className="text-center pt-4 border-t border-glow/10 shrink-0">
                <a
                  href={meetingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  Open in nieuw tabblad
                </a>
              </div>
            </div>
          </div>

        </div>
      </DialogContent>
    </Dialog>
  );
}

export function BookingModalHost() {
  const [open, setOpen] = React.useState(false);
  React.useEffect(() => {
    const handler = () => setOpen(true);
    window.addEventListener("lovable:open-booking", handler);
    return () => window.removeEventListener("lovable:open-booking", handler);
  }, []);
  return <GlobalBookingModal open={open} onOpenChange={setOpen} />;
}

export function openBookingModal() {
  window.dispatchEvent(new CustomEvent("lovable:open-booking"));
}