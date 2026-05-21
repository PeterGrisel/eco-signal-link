import { useState } from "react";
import { useLocation } from "react-router-dom";
import { Mail, Linkedin, HelpCircle, MessageCircle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { COPY } from "@/content/copy";
import { trackCTA } from "@/lib/tracking";

const EMAIL = "peter@b2bgroeimachine.io";
const LINKEDIN = "https://www.linkedin.com/company/b2bgroeimachine/";
const WHATSAPP = "https://wa.me/31852502925";

export default function LeftDock() {
  const [faqOpen, setFaqOpen] = useState(false);
  const location = useLocation();
  if (location.pathname.startsWith("/signaal") || location.pathname.startsWith("/admin")) return null;

  const items = [
    {
      icon: HelpCircle,
      label: "FAQ",
      onClick: () => {
        setFaqOpen(true);
        trackCTA("LeftDock — FAQ", "#faq");
      },
    },
    {
      icon: Mail,
      label: "E-mail",
      href: `mailto:${EMAIL}`,
      onClick: () => trackCTA("LeftDock — Email", `mailto:${EMAIL}`),
    },
    {
      icon: MessageCircle,
      label: "WhatsApp",
      href: WHATSAPP,
      external: true,
      onClick: () => trackCTA("LeftDock — WhatsApp", WHATSAPP),
    },
    {
      icon: Linkedin,
      label: "LinkedIn",
      href: LINKEDIN,
      external: true,
      onClick: () => trackCTA("LeftDock — LinkedIn", LINKEDIN),
    },
  ];

  return (
    <>
      <TooltipProvider delayDuration={120}>
        <div
          aria-hidden={hidden}
          className={`hidden md:flex fixed left-4 top-1/2 -translate-y-1/2 z-40 flex-col items-center gap-1 rounded-full border border-border/50 bg-background/70 backdrop-blur-xl p-2 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.6)] transition-opacity duration-300 ${
            hidden ? "opacity-0 pointer-events-none" : "opacity-100"
          }`}
        >
          {items.map((item) => {
            const Icon = item.icon;
            const inner = (
              <span className="inline-flex w-10 h-10 items-center justify-center rounded-full text-foreground/70 hover:text-primary hover:bg-primary/10 transition-colors">
                <Icon className="w-4 h-4" />
              </span>
            );
            return (
              <Tooltip key={item.label}>
                <TooltipTrigger asChild>
                  {item.href ? (
                    <a
                      href={item.href}
                      target={item.external ? "_blank" : undefined}
                      rel={item.external ? "noopener noreferrer" : undefined}
                      onClick={item.onClick}
                      aria-label={item.label}
                      className="rounded-full"
                    >
                      {inner}
                    </a>
                  ) : (
                    <button type="button" onClick={item.onClick} aria-label={item.label} className="rounded-full">
                      {inner}
                    </button>
                  )}
                </TooltipTrigger>
                <TooltipContent side="right" className="font-display text-[10px] tracking-[0.18em] uppercase">
                  {item.label}
                </TooltipContent>
              </Tooltip>
            );
          })}
        </div>
      </TooltipProvider>

      <Dialog open={faqOpen} onOpenChange={setFaqOpen}>
        <DialogContent className="sm:max-w-[640px] max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl">{COPY.miniFaq.heading}</DialogTitle>
          </DialogHeader>
          <Accordion type="single" collapsible className="w-full">
            {COPY.miniFaq.items.map((item, i) => (
              <AccordionItem key={i} value={`item-${i}`}>
                <AccordionTrigger className="text-left">{item.q}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{item.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </DialogContent>
      </Dialog>
    </>
  );
}
