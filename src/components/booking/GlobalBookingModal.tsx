import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ExternalLink } from "lucide-react";

interface GlobalBookingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  prefillData?: { name?: string; email?: string; company?: string };
}

const HUBSPOT_MEETING_URL = "https://meetings-eu1.hubspot.com/peter-grisel";
const HUBSPOT_EMBED_SCRIPT = "https://static.hsappstatic.net/MeetingsEmbed/ex/MeetingsEmbedCode.js";

export function GlobalBookingModal({ open, onOpenChange, prefillData }: GlobalBookingModalProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);

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
    const timer = setTimeout(() => {
      document.querySelectorAll(`script[src="${HUBSPOT_EMBED_SCRIPT}"]`).forEach((s) => s.remove());
      const script = document.createElement("script");
      script.src = HUBSPOT_EMBED_SCRIPT;
      script.async = true;
      document.body.appendChild(script);
    }, 150);
    return () => clearTimeout(timer);
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[750px] max-h-[90vh] p-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-2">
          <DialogTitle className="text-lg font-display">Reserveer uw capaciteit</DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Kies een moment dat u uitkomt. Wij bevestigen per e-mail.
          </DialogDescription>
        </DialogHeader>
        <div className="px-6 pb-6" style={{ minHeight: "660px" }}>
          <div
            ref={containerRef}
            className="meetings-iframe-container"
            data-src={`${meetingUrl}?embed=true`}
          />
          <div className="text-center mt-4">
            <a
              href={meetingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Open in nieuw tabblad
            </a>
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
