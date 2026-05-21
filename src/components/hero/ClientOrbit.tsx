const clients = [
  { name: "Krak de Rijder", domain: "krakderijder.nl" },
  { name: "Excelsior Rotterdam", domain: "excelsiorrotterdam.nl" },
  { name: "Core Vision", domain: "core-vision.nl" },
  { name: "GoBytes", domain: "gobytes.nl" },
  { name: "Nexer", domain: "nexer.nl" },
  { name: "Rebel Force", domain: "rebelforce.nl" },
  { name: "Exes Engineering", domain: "exesengineering.nl" },
  { name: "Datahub", domain: "datahub.nl" },
  { name: "Drivewise Lease", domain: "drivewiselease.nl" },
  { name: "Sascha del Sal", domain: "saschadelsal.com" },
  { name: "HappyBase", domain: "happybase.me" },
  { name: "RTC Group", domain: "rtc-group.nl" },
  { name: "Yaskawa", domain: "yaskawa.nl" },
  { name: "ThriveOS", domain: "thriveos.nl" },
];

function logoUrl(domain: string) {
  return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
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
  const items = clients.slice(0, 14);
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
                      className="h-9 w-9 md:h-11 md:w-11 rounded-xl bg-background/70 backdrop-blur-md border border-border/40 shadow-[0_6px_24px_-8px_rgba(0,0,0,0.6)] flex items-center justify-center overflow-hidden"
                      style={{
                        animation: `client-orbit ${duration}s linear infinite`,
                        animationDirection: direction === "normal" ? "reverse" : "normal",
                      }}
                      title={c.name}
                    >
                      <img
                        src={logoUrl(c.domain)}
                        alt=""
                        loading="lazy"
                        className="h-5 w-5 md:h-6 md:w-6 object-contain opacity-85"
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