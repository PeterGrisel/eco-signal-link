import * as React from "react";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { createPortal } from "react-dom";
import {
  Phone,
  Workflow,
  Layers,
  Calculator,
  FileSpreadsheet,
  Handshake,
  Users,
  Newspaper,
  BookOpen,
  Mail,
  Sparkles,
  BookMarked,
  Building2,
  X,
  type LucideIcon,
} from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { MenuToggleIcon } from "@/components/ui/menu-toggle-icon";

import { trackCTA } from "@/lib/tracking";
import { cn } from "@/lib/utils";
import { WeglotLanguageToggle } from "@/components/WeglotLanguageToggle";
import { CurrencySwitcher } from "@/components/CurrencySwitcher";
import { GLogoIcon } from "@/components/icons/GLogoIcon";

type LinkItem = {
  title: string;
  href: string;
  icon: LucideIcon;
  description?: string;
};

const oplossingen: LinkItem[] = [
  {
    title: "Groeistack",
    href: "/groeistack",
    icon: Layers,
    description: "Onze modulaire B2B groeistack",
  },
  {
    title: "Tools",
    href: "/tools",
    icon: Calculator,
    description: "Funnel-, pipeline- en value calculators",
  },
  {
    title: "Cheatsheets",
    href: "/cheatsheets",
    icon: FileSpreadsheet,
    description: "Praktische templates en frameworks",
  },
  {
    title: "Playbooks",
    href: "/playbooks",
    icon: BookMarked,
    description: "Bewezen werkstromen uit het signaal-systeem",
  },
  {
    title: "Partners",
    href: "/partners",
    icon: Handshake,
    description: "Signal Certified partner-netwerk",
  },
];

const bedrijf: LinkItem[] = [
  {
    title: "Over ons",
    href: "/over-ons",
    icon: Sparkles,
    description: "Onze missie en aanpak",
  },
  {
    title: "Ons team",
    href: "/ons-team",
    icon: Users,
    description: "De mensen achter B2BGroeiMachine",
  },
  {
    title: "Klanten",
    href: "/klanten",
    icon: Building2,
    description: "Wie werkt met ons commerciële brein",
  },
  {
    title: "Brandstory",
    href: "/brandstory",
    icon: BookOpen,
    description: "Het verhaal in editorial vorm",
  },
];

const bedrijf2: LinkItem[] = [
  { title: "Blog", href: "/blog", icon: Newspaper },
  { title: "Contact", href: "/contact", icon: Mail },
];

function useScroll(threshold: number) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > threshold);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);
  return scrolled;
}

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const scrolled = useScroll(10);
  const location = useLocation();
  const navigate = useNavigate();

  const scrollToPricing = (e: React.MouseEvent) => {
    e.preventDefault();
    trackCTA("Navbar — Pricing", "#pricing");
    if (location.pathname === "/") {
      const el = document.getElementById("pricing");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      navigate("/#pricing");
      // Wait for Index to mount, then scroll
      const tryScroll = (attempt = 0) => {
        const el = document.getElementById("pricing");
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        } else if (attempt < 20) {
          setTimeout(() => tryScroll(attempt + 1), 100);
        }
      };
      setTimeout(() => tryScroll(), 100);
    }
    setOpen(false);
  };

  // Close mobile sheet on route change
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  // Lock body scroll while mobile menu open
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const ctaClasses =
    "group relative inline-flex items-center gap-2 overflow-hidden rounded-md border border-primary/40 bg-gradient-to-r from-primary via-primary to-primary/80 px-5 py-2.5 text-base font-semibold text-primary-foreground shadow-[0_0_24px_-6px_hsl(var(--primary)/0.7)] transition-all hover:shadow-[0_0_32px_-4px_hsl(var(--primary)/0.9)] hover:-translate-y-0.5";

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-transform duration-500 ease-out",
        scrolled
          ? "translate-y-0 bg-background/85 backdrop-blur-xl border-b border-border/80 shadow-[0_4px_24px_-12px_rgba(0,0,0,0.4)]"
          : "-translate-y-full bg-transparent border-b border-transparent",
      )}
    >
      <div className="container mx-auto flex items-center justify-between h-20 md:h-24 px-4 md:px-6">
        <Link
          to="/"
          className="flex items-center gap-2 shrink-0 group"
        >
          {/* Mobile: Orange G Logo Icon */}
          <div className="md:hidden">
            <GLogoIcon size={36} className="text-primary hover:opacity-90 transition-opacity" />
          </div>

          {/* Desktop: Full text logo */}
          <div className="hidden md:block font-display font-bold text-xl md:text-2xl tracking-tight">
            <span className="text-foreground">B2B</span>
            <span className="text-primary">GroeiMachine</span>
          </div>
        </Link>

        <NavigationMenu className="hidden md:flex absolute left-1/2 -translate-x-1/2 max-w-none">
          <NavigationMenuList className="gap-1">
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link
                  to="/hoe-het-werkt"
                  onClick={() => trackCTA("Navbar — Hoe het werkt", "/hoe-het-werkt")}
                  className="inline-flex h-11 items-center justify-center rounded-md bg-transparent px-4 text-base font-medium text-foreground/80 transition-colors hover:bg-accent/60 hover:text-foreground"
                >
                  Hoe het werkt
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuTrigger className="h-11 px-4 text-base bg-transparent data-[state=open]:bg-accent/50">
                Oplossingen
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <div className="grid grid-cols-2 gap-2 p-4 w-[600px]">
                  {oplossingen.map((item) => (
                    <ListItem key={item.href} {...item} location="Navbar — Oplossingen" />
                  ))}
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuTrigger className="h-11 px-4 text-base bg-transparent data-[state=open]:bg-accent/50">
                Bedrijf
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <div className="grid grid-cols-2 gap-4 p-4 w-[560px]">
                  <div className="flex flex-col gap-2">
                    {bedrijf.map((item) => (
                      <ListItem key={item.href} {...item} location="Navbar — Bedrijf" />
                    ))}
                  </div>
                  <div className="flex flex-col gap-1 border-l border-border/60 pl-4">
                    {bedrijf2.map((item) => (
                      <CompactItem key={item.href} {...item} location="Navbar — Bedrijf" />
                    ))}
                  </div>
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <a
                  href="/#pricing"
                  onClick={scrollToPricing}
                  className="inline-flex h-11 items-center justify-center rounded-md bg-transparent px-4 text-base font-medium text-foreground/80 transition-colors hover:bg-accent/60 hover:text-foreground"
                >
                  Pricing
                </a>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        <div className="hidden md:flex items-center gap-2">
          <CurrencySwitcher />
          <WeglotLanguageToggle />
        </div>

        <div className="md:hidden flex items-center gap-2">
          <CurrencySwitcher />
          <WeglotLanguageToggle />
          <button
          type="button"
          onClick={() => setOpen(!open)}
          className="p-2 text-foreground"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label="Menu openen"
        >
          <MenuToggleIcon open={open} className="h-7 w-7" />
          </button>
        </div>
      </div>

      <MobileMenu open={open}>
        <div className="flex h-full flex-col">
          <div className="flex h-16 shrink-0 items-center justify-between border-b border-border/70 px-5">
            <span className="font-display text-xl font-bold text-foreground">Menu</span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="flex h-11 w-11 items-center justify-center rounded-md border border-border/80 text-foreground transition-colors hover:border-primary/50 hover:text-primary"
              aria-label="Menu sluiten"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="container mx-auto flex flex-1 flex-col gap-5 overflow-y-auto px-4 pb-24 pt-4">
            <div className="grid gap-2">
              <MobilePrimaryLink to="/" label="Home" onClick={() => setOpen(false)} />
              <MobilePrimaryLink
                to="/hoe-het-werkt"
                label="Hoe het werkt"
                onClick={() => {
                  trackCTA("Navbar (mobile) — Hoe het werkt", "/hoe-het-werkt");
                  setOpen(false);
                }}
                highlighted
              />
            </div>

          <MobileSection title="Oplossingen" items={oplossingen} onClick={() => setOpen(false)} />
          <MobileSection
            title="Bedrijf"
            items={[...bedrijf, ...bedrijf2]}
            onClick={() => setOpen(false)}
          />
          </div>

          <div className="shrink-0 border-t border-border/70 bg-background/95 p-4">
            <a
              href="/#pricing"
              onClick={(e) => {
                scrollToPricing(e);
                setOpen(false);
              }}
              className="flex items-center justify-between rounded-lg border border-primary/35 bg-primary/10 px-4 py-3.5 font-display text-lg font-semibold text-foreground transition-colors hover:border-primary/60 hover:bg-primary/15"
            >
              Pricing
              <span className="text-primary">→</span>
            </a>
          </div>
        </div>
      </MobileMenu>
    </header>
  );
};

function MobilePrimaryLink({
  to,
  label,
  onClick,
  highlighted = false,
}: {
  to: string;
  label: string;
  onClick: () => void;
  highlighted?: boolean;
}) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className={cn(
        "rounded-lg border px-4 py-3 font-display text-xl font-semibold transition-colors",
        highlighted
          ? "border-primary/40 bg-primary/10 text-foreground hover:border-primary/70"
          : "border-border/70 text-foreground hover:border-primary/40 hover:text-primary",
      )}
    >
      {label}
    </Link>
  );
}

function MobileMenu({ open, children }: { open: boolean; children: React.ReactNode }) {
  if (typeof window === "undefined") return null;
  if (!open) return null;
  return createPortal(
    <div
      id="mobile-menu"
      className="fixed inset-0 z-[10000] md:hidden bg-background animate-in fade-in duration-200"
    >
      {children}
    </div>,
    document.body,
  );
}

function MobileSection({
  title,
  items,
  onClick,
}: {
  title: string;
  items: LinkItem[];
  onClick: () => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="px-1 text-xs uppercase tracking-[0.18em] text-muted-foreground font-semibold">
        {title}
      </div>
      <div className="flex flex-col gap-1">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              to={item.href}
              onClick={() => {
                trackCTA(`Navbar (mobile) — ${item.title}`, item.href);
                onClick();
              }}
              className="flex items-center gap-3 rounded-md px-2 py-2.5 font-display text-lg text-foreground transition-colors hover:bg-accent/50 hover:text-primary"
            >
              <Icon className="w-5 h-5 shrink-0 text-primary/80" />
              {item.title}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

function ListItem({
  title,
  href,
  icon: Icon,
  description,
  location,
}: LinkItem & { location: string }) {
  return (
    <NavigationMenuLink asChild>
      <Link
        to={href}
        onClick={() => trackCTA(`${location} — ${title}`, href)}
        className="group flex gap-3 rounded-lg p-3 transition-colors hover:bg-accent/60 focus:bg-accent/60 outline-none"
      >
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary group-hover:bg-primary/15 transition-colors">
          <Icon className="w-5 h-5" />
        </span>
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-foreground">{title}</span>
          {description && (
            <span className="text-xs text-muted-foreground leading-relaxed">{description}</span>
          )}
        </div>
      </Link>
    </NavigationMenuLink>
  );
}

function CompactItem({
  title,
  href,
  icon: Icon,
  location,
}: LinkItem & { location: string }) {
  return (
    <NavigationMenuLink asChild>
      <Link
        to={href}
        onClick={() => trackCTA(`${location} — ${title}`, href)}
        className="flex items-center gap-2.5 rounded-md px-2 py-2 text-sm text-foreground/80 hover:text-foreground hover:bg-accent/60 transition-colors"
      >
        <Icon className="w-4 h-4 text-primary/70" />
        {title}
      </Link>
    </NavigationMenuLink>
  );
}

export default Navbar;
