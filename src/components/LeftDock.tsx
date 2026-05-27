import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { Mail, Linkedin, HelpCircle, MessageCircle, Euro, BookOpen } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { trackCTA } from "@/lib/tracking";

const EMAIL = "info@rebelforce.nl";
const LINKEDIN = "https://www.linkedin.com/company/b2bgroeimachine/";
const WHATSAPP = "https://wa.me/31852502925";

export default function LeftDock() {
  const location = useLocation();
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const target = document.getElementById("section-smederij");
    if (!target) return;
    const observer = new IntersectionObserver(
      ([entry]) => setHidden(entry.isIntersecting),
      { threshold: 0, rootMargin: "-20% 0px -20% 0px" }
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, [location.pathname]);

  if (location.pathname.startsWith("/signaal") || location.pathname.startsWith("/admin")) return null;

  const items = [
    {
      icon: HelpCircle,
      label: "FAQ",
      href: "/#faq",
      onClick: () => trackCTA("LeftDock — FAQ", "/#faq"),
    },
    {
      icon: BookOpen,
      label: "Hoe het werkt",
      href: "/hoe-het-werkt",
      onClick: () => trackCTA("LeftDock — Hoe het werkt", "/hoe-het-werkt"),
    },
    {
      icon: Euro,
      label: "Pricing",
      href: "/#pricing",
      onClick: () => trackCTA("LeftDock — Pricing", "/#pricing"),
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
          className={`hidden md:flex fixed bottom-4 left-1/2 -translate-x-1/2 z-40 flex-row items-center gap-1 rounded-full border border-border/50 bg-background/70 backdrop-blur-xl p-2 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.6)] transition-opacity duration-300 ${hidden ? "opacity-0 pointer-events-none" : "opacity-100"}`}
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
                <TooltipContent side="top" className="font-display text-[10px] tracking-[0.18em] uppercase">
                  {item.label}
                </TooltipContent>
              </Tooltip>
            );
          })}
        </div>
      </TooltipProvider>
    </>
  );
}
