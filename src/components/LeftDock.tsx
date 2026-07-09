import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Mail, Linkedin, HelpCircle, MessageCircle, Euro, BookOpen, Phone } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { trackCTA } from "@/lib/tracking";

const EMAIL = "info@rebelforce.nl";
const LINKEDIN = "https://www.linkedin.com/company/b2bgroeimachine/";
const WHATSAPP = "https://wa.me/31852502925";
const PHONE = "tel:+493075675721";

export default function LeftDock() {
  const location = useLocation();
  const navigate = useNavigate();
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    // Verberg de dock zodra hij visueel over tekst, kaarten of interactieve
    // elementen valt. We vergelijken de bbox van de dock met die van zichtbare
    // content-elementen en verbergen bij overlap.
    const SELECTOR =
      "h1,h2,h3,h4,h5,h6,p,a,button,input,textarea,label,li,blockquote,img,svg,[role='button'],[data-card],.card,article,figure";

    const check = () => {
      const dock = document.querySelector<HTMLElement>("[data-left-dock]");
      if (!dock) return;
      const r = dock.getBoundingClientRect();
      // Iets ruimere zone zodat de dock al verdwijnt vóór hij raakt
      const dockBox = {
        left: r.left - 12,
        right: r.right + 12,
        top: r.top - 8,
        bottom: r.bottom + 8,
      };

      const nodes = document.querySelectorAll<HTMLElement>(SELECTOR);
      let overlap = false;
      for (const el of nodes) {
        if (el.closest("[data-left-dock]")) continue;
        // Skip onzichtbare elementen
        if (!el.offsetParent && getComputedStyle(el).position !== "fixed") continue;
        const b = el.getBoundingClientRect();
        if (b.width === 0 || b.height === 0) continue;
        if (b.bottom < dockBox.top || b.top > dockBox.bottom) continue;
        if (b.right < dockBox.left || b.left > dockBox.right) continue;
        overlap = true;
        break;
      }
      setHidden(overlap);
    };

    let raf = 0;
    const schedule = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(check);
    };
    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    const interval = window.setInterval(schedule, 600);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      window.clearInterval(interval);
    };
  }, [location.pathname]);

  if (location.pathname.startsWith("/signaal") || location.pathname.startsWith("/admin")) return null;
  if (location.pathname.startsWith("/voor") && location.pathname !== "/voor/hego") return null;

  const scrollToId = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const goToAnchor = (path: string, id: string, label: string) => {
    if (location.pathname === "/") {
      scrollToId(id);
    } else {
      navigate(path);
    }
    trackCTA(`LeftDock — ${label}`, path);
  };

  const items = [
    {
      icon: HelpCircle,
      label: "FAQ",
      onClick: () => goToAnchor("/#faq", "faq", "FAQ"),
    },
    {
      icon: Euro,
      label: "Pricing",
      onClick: () => {
        navigate("/pricing");
        trackCTA("LeftDock — Pricing", "/pricing");
      },
    },
    {
      icon: Phone,
      label: "Bel AI Assistent (+49 30 75675721)",
      href: PHONE,
      external: true,
      onClick: () => trackCTA("LeftDock — Phone", PHONE),
    },
    {
      icon: Mail,
      label: "E-mail",
      href: `mailto:${EMAIL}`,
      external: true,
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
          data-left-dock
          className={`hidden md:flex fixed left-4 top-1/2 -translate-y-1/2 z-40 flex-col items-center gap-2 rounded-full border border-border/50 bg-background/70 backdrop-blur-xl p-2 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.6)] transition-opacity duration-300 ${hidden ? "opacity-0 pointer-events-none" : "opacity-100"}`}
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
    </>
  );
}
