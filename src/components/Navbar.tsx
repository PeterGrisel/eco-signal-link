import * as React from "react";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { createPortal } from "react-dom";
import {
  ArrowRight,
  Rocket,
  Workflow,
  Layers,
  Calculator,
  GraduationCap,
  FileSpreadsheet,
  Handshake,
  Users,
  Newspaper,
  BookOpen,
  Mail,
  Sparkles,
  BookMarked,
  Phone,
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
import CtaLink from "@/components/CtaLink";
import { trackCTA } from "@/lib/tracking";
import { cn } from "@/lib/utils";

type LinkItem = {
  title: string;
  href: string;
  icon: LucideIcon;
  description?: string;
};

const oplossingen: LinkItem[] = [
  {
    title: "Hoe het werkt",
    href: "/hoe-het-werkt",
    icon: Workflow,
    description: "Het signaal-gedreven proces in 7 stappen",
  },
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
    title: "Trainingen",
    href: "/trainingen",
    icon: GraduationCap,
    description: "Train uw team op signaal-prospecting",
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
    if (location.pathname === "/") {
      const el = document.getElementById("pricing");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      navigate("/#pricing");
    }
    trackCTA("Navbar — Pricing", "#pricing");
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
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-background/85 backdrop-blur-xl border-b border-border/80 shadow-[0_4px_24px_-12px_rgba(0,0,0,0.4)]"
          : "bg-background/60 backdrop-blur-md border-b border-transparent",
      )}
    >
      <div className="container mx-auto flex items-center justify-between h-20 md:h-24 px-4 md:px-6">
        <Link
          to="/"
          className="font-display font-bold text-xl md:text-2xl tracking-tight shrink-0"
        >
          <span className="text-foreground">B2B</span>
          <span className="text-primary">GroeiMachine</span>
        </Link>

        <NavigationMenu className="hidden md:flex absolute left-1/2 -translate-x-1/2 max-w-none">
          <NavigationMenuList className="gap-1">
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
          <a
            href="tel:+493075675721"
            className={ctaClasses}
          >
            <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
            <Phone className="w-4 h-4 relative" />
            <span className="relative">Bel onze AI Assistent</span>
            <span className="text-xs font-normal opacity-80">+49 30 75675721</span>
          </a>
        </div>

        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="md:hidden p-2 text-foreground"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label="Menu openen"
        >
          <MenuToggleIcon open={open} className="h-7 w-7" />
        </button>
      </div>

      <MobileMenu open={open}>
        <div className="container mx-auto px-4 pt-24 pb-10 flex flex-col gap-8 overflow-y-auto h-full">
          <MobileSection title="Oplossingen" items={oplossingen} onClick={() => setOpen(false)} />
          <MobileSection
            title="Bedrijf"
            items={[...bedrijf, ...bedrijf2]}
            onClick={() => setOpen(false)}
          />
          <a
            href="/#pricing"
            onClick={(e) => {
              scrollToPricing(e);
              setOpen(false);
            }}
            className="text-2xl font-display font-semibold text-foreground"
          >
            Pricing
          </a>
          <a
            href="tel:+493075675721"
            className={cn(ctaClasses, "w-full justify-center mt-4")}
          >
            <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
            <Phone className="w-4 h-4 relative" />
            <span className="relative">Bel onze AI Assistent</span>
            <span className="text-xs font-normal opacity-80">+49 30 75675721</span>
          </a>
        </div>
      </MobileMenu>
    </header>
  );
};

function MobileMenu({ open, children }: { open: boolean; children: React.ReactNode }) {
  if (typeof window === "undefined") return null;
  if (!open) return null;
  return createPortal(
    <div
      id="mobile-menu"
      className="fixed inset-0 z-40 md:hidden bg-background/95 backdrop-blur-xl animate-in fade-in duration-200"
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
    <div className="flex flex-col gap-3">
      <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground font-semibold">
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
              className="flex items-center gap-3 py-2.5 text-xl font-display text-foreground hover:text-primary transition-colors"
            >
              <Icon className="w-5 h-5 text-primary/80" />
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
