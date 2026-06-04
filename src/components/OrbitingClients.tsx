import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { faviconFor } from "@/data/groeistack";

interface ClientLogo {
  id: string;
  name: string;
  domain: string;
  logo_url: string | null;
  scale: number;
  padding: number;
  website: string | null;
}

interface OrbitingClientsProps {
  accent?: string;
  title?: string;
  subtitle?: string;
}

const Logo = ({ c }: { c: ClientLogo }) => {
  const [err, setErr] = useState(false);
  const src = c.logo_url || faviconFor(c.website || c.domain);
  const isHego = c.name.toLowerCase().includes("hego");

  if (isHego && src && !err) {
    return (
      <div className="h-14 w-14 md:h-16 md:w-16 rounded-full flex items-center justify-center relative">
        <div
          aria-hidden
          className="absolute inset-0 rounded-full backdrop-blur-2xl border"
          style={{
            background: `radial-gradient(130% 130% at 30% 20%, hsl(var(--foreground) / 0.95) 0%, hsl(var(--foreground) / 0.85) 45%, hsl(var(--foreground) / 0.7) 100%)`,
            borderColor: `hsl(var(--foreground) / 0.6)`,
            boxShadow: `inset 0 1px 0 hsl(0 0% 100% / 0.6), inset 0 -1px 0 hsl(var(--foreground) / 0.2), 0 10px 30px -10px #003E7E99`,
          }}
        />
        <div
          aria-hidden
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{
            background: `linear-gradient(135deg, hsl(0 0% 100% / 0.5) 0%, transparent 40%, transparent 60%, hsl(0 0% 100% / 0.2) 100%)`,
            mixBlendMode: "overlay",
          }}
        />
        <img
          src={src}
          alt={c.name}
          className="relative object-contain max-h-9 max-w-9 drop-shadow-lg"
          loading="lazy"
          onError={() => setErr(true)}
        />
      </div>
    );
  }

  return (
    <div className="h-14 w-14 md:h-16 md:w-16 rounded-full bg-card/80 border border-border backdrop-blur-sm flex items-center justify-center shadow-lg">
      {err || !src ? (
        <span className="text-[10px] font-display font-bold text-foreground/70 px-1 text-center leading-tight">
          {c.name.slice(0, 6)}
        </span>
      ) : (
        <img
          src={src}
          alt={c.name}
          className="object-contain max-h-9 max-w-9 grayscale opacity-80"
          loading="lazy"
          onError={() => setErr(true)}
        />
      )}
    </div>
  );
};

const Ring = ({
  clients,
  radius,
  duration,
  reverse,
}: {
  clients: ClientLogo[];
  radius: number;
  duration: number;
  reverse?: boolean;
}) => {
  if (clients.length === 0) return null;
  return (
    <div
      className="absolute inset-0 flex items-center justify-center"
      style={{
        animation: `${reverse ? "spin-reverse" : "spin"} ${duration}s linear infinite`,
      }}
    >
      <div className="relative" style={{ width: radius * 2, height: radius * 2 }}>
        {clients.map((c, i) => {
          const angle = (i / clients.length) * Math.PI * 2;
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;
          return (
            <div
              key={c.id}
              className="absolute top-1/2 left-1/2"
              style={{
                transform: `translate(calc(${x}px - 50%), calc(${y}px - 50%))`,
                animation: `${reverse ? "spin" : "spin-reverse"} ${duration}s linear infinite`,
              }}
            >
              <Logo c={c} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

const OrbitingClients = ({
  accent = "hsl(var(--primary))",
  title = "Vertrouwd door industriële B2B-spelers",
  subtitle,
}: OrbitingClientsProps) => {
  const [clients, setClients] = useState<ClientLogo[]>([]);

  useEffect(() => {
    supabase
      .from("client_logos")
      .select("id, name, domain, logo_url, scale, padding, website")
      .eq("is_visible", true)
      .order("sort_order")
      .then(({ data }) => setClients((data as ClientLogo[]) ?? []));
  }, []);

  if (clients.length === 0) return null;

  // Distribute over 3 rings: inner, middle, outer
  const third = Math.ceil(clients.length / 3);
  const inner = clients.slice(0, third);
  const middle = clients.slice(third, third * 2);
  const outer = clients.slice(third * 2);

  return (
    <section className="relative py-20 md:py-28 overflow-hidden border-b border-border bg-card/20">
      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes spin-reverse { from { transform: rotate(0deg); } to { transform: rotate(-360deg); } }
      `}</style>

      <div
        className="absolute inset-0 opacity-25 pointer-events-none"
        style={{ background: `radial-gradient(ellipse at center, ${accent}55 0%, transparent 60%)` }}
      />

      <div className="container mx-auto px-4 md:px-6 relative">
        <div className="relative mx-auto" style={{ maxWidth: 760, height: 560 }}>
          {/* Orbiting rings */}
          <Ring clients={outer} radius={260} duration={80} />
          <Ring clients={middle} radius={190} duration={60} reverse />
          <Ring clients={inner} radius={120} duration={45} />

          {/* Fade overlay so logos at edges soften */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse at center, transparent 35%, hsl(var(--background)) 85%)",
            }}
          />

          {/* Center content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
            <p
              className="font-display text-xs tracking-[0.25em] uppercase mb-3"
              style={{ color: accent }}
            >
              Onze klanten
            </p>
            <h2 className="font-display font-bold text-2xl md:text-4xl tracking-tight leading-tight max-w-md">
              {title}
            </h2>
            {subtitle && (
              <p className="text-muted-foreground text-sm md:text-base mt-3 max-w-sm leading-relaxed">
                {subtitle}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default OrbitingClients;