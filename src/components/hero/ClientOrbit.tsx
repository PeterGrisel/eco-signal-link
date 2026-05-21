import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface ClientItem {
  name: string;
  domain: string;
  logo_url: string | null;
  scale: number;
  padding: number;
}

const FALLBACK: ClientItem[] = [
  { name: "Krak de Rijder", domain: "krakderijder.nl", logo_url: null, scale: 1, padding: 0 },
  { name: "Excelsior Rotterdam", domain: "excelsiorrotterdam.nl", logo_url: null, scale: 1, padding: 0 },
  { name: "Core Vision", domain: "core-vision.nl", logo_url: null, scale: 1, padding: 0 },
  { name: "GoBytes", domain: "gobytes.nl", logo_url: null, scale: 1, padding: 0 },
  { name: "Nexer", domain: "nexer.nl", logo_url: null, scale: 1, padding: 0 },
  { name: "Rebel Force", domain: "rebelforce.nl", logo_url: null, scale: 1, padding: 0 },
  { name: "Exes Engineering", domain: "exesengineering.nl", logo_url: null, scale: 1, padding: 0 },
  { name: "Datahub", domain: "datahub.nl", logo_url: null, scale: 1, padding: 0 },
  { name: "Drivewise Lease", domain: "drivewiselease.nl", logo_url: null, scale: 1, padding: 0 },
  { name: "Sascha del Sal", domain: "saschadelsal.com", logo_url: null, scale: 1, padding: 0 },
  { name: "HappyBase", domain: "happybase.me", logo_url: null, scale: 1, padding: 0 },
  { name: "RTC Group", domain: "rtc-group.nl", logo_url: null, scale: 1, padding: 0 },
  { name: "Yaskawa", domain: "yaskawa.nl", logo_url: null, scale: 1, padding: 0 },
  { name: "ThriveOS", domain: "thriveos.nl", logo_url: null, scale: 1, padding: 0 },
];

function logoSrc(c: ClientItem) {
  return c.logo_url && c.logo_url.trim().length > 0
    ? c.logo_url
    : `https://www.google.com/s2/favicons?domain=${c.domain}&sz=128`;
}

interface ClientOrbitProps {
  rings?: number;
  /** Diameter of innermost ring in rem. */
  baseSize?: number;
  /** Gap between rings in rem. */
  gap?: number;
  className?: string;
}

/**
 * Decorative orbiting client-logo rings — used behind the brein-hero.
 * Pointer-events disabled. Counter-rotates the inner logo wrappers so
 * favicons stay upright while the ring spins.
 */
export default function ClientOrbit({
  rings = 2,
  baseSize = 26,
  gap = 12,
  className = "",
}: ClientOrbitProps) {
  const [items, setItems] = useState<ClientItem[]>(FALLBACK);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data, error } = await supabase
        .from("client_logos")
        .select("name,domain,logo_url,scale,padding")
        .eq("is_visible", true)
        .order("sort_order", { ascending: true });
      if (!cancelled && !error && data && data.length > 0) {
        setItems(
          data.map((d: any) => ({
            name: d.name,
            domain: d.domain,
            logo_url: d.logo_url,
            scale: Number(d.scale) || 1,
            padding: d.padding ?? 0,
          }))
        );
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const perRing = Math.ceil(items.length / rings);

  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden ${className}`}
    >
      <div className="relative w-0 h-0">
        {Array.from({ length: rings }).map((_, ringIdx) => {
          const sizeRem = baseSize + ringIdx * gap;
          const slice = items.slice(ringIdx * perRing, ringIdx * perRing + perRing);
          const angleStep = (2 * Math.PI) / slice.length;
          const direction = ringIdx % 2 === 0 ? "normal" : "reverse";
          const duration = 90 + ringIdx * 40;

          return (
            <div
              key={ringIdx}
              className="absolute rounded-full border border-primary/15"
              style={{
                width: `${sizeRem}rem`,
                height: `${sizeRem}rem`,
                left: `-${sizeRem / 2}rem`,
                top: `-${sizeRem / 2}rem`,
                animation: `client-orbit ${duration}s linear infinite`,
                animationDirection: direction,
              }}
            >
              {slice.map((c, i) => {
                const angle = i * angleStep;
                const x = 50 + 50 * Math.cos(angle);
                const y = 50 + 50 * Math.sin(angle);
                return (
                  <div
                    key={c.domain}
                    className="absolute -translate-x-1/2 -translate-y-1/2"
                    style={{ left: `${x}%`, top: `${y}%` }}
                  >
                    <div
                      className="h-9 w-9 md:h-11 md:w-11 rounded-xl bg-background/90 border border-border/40 shadow-[0_6px_24px_-8px_rgba(0,0,0,0.6)] flex items-center justify-center overflow-hidden"
                      style={{
                        animation: `client-orbit ${duration}s linear infinite`,
                        animationDirection: direction === "normal" ? "reverse" : "normal",
                        padding: `${c.padding}px`,
                      }}
                      title={c.name}
                    >
                      <img
                        src={logoSrc(c)}
                        alt=""
                        loading="lazy"
                        className="h-5 w-5 md:h-6 md:w-6 object-contain opacity-85"
                        style={{ transform: `scale(${c.scale})` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
      <style>{`
        @keyframes client-orbit {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}