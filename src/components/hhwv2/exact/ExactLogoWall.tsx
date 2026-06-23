import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { faviconFor } from "@/data/groeistack";
import InfiniteSlider from "../ui/InfiniteSlider";
import stelzLogo from "@/assets/stelz-logo.png.asset.json";
import sealecoLogo from "@/assets/sealeco-logo.png.asset.json";
import shotsLogo from "@/assets/shots-logo.png.asset.json";
import hegoLogo from "@/assets/hego-logo.png.asset.json";
import klingeleLogo from "@/assets/klingele24-logo.png.asset.json";

interface ClientLogo {
  id: string;
  name: string;
  domain: string;
  logo_url: string | null;
  scale: number;
  padding: number;
  website: string | null;
}

const STATIC_CLIENTS = [
  { name: "Stelz", src: stelzLogo.url },
  { name: "SealEco", src: sealecoLogo.url },
  { name: "Shots", src: shotsLogo.url },
  { name: "HEGO", src: hegoLogo.url },
  { name: "Klingele 24", src: klingeleLogo.url },
];

const ExactLogoWall = () => {
  const [clients, setClients] = useState<{ name: string; src: string }[]>([]);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const { data, error } = await supabase
          .from("client_logos")
          .select("id, name, domain, logo_url, scale, padding, website")
          .eq("is_visible", true)
          .order("sort_order");
        
        if (error) throw error;

        if (data && data.length > 0) {
          const formatted = data.map((c) => {
            const src = c.logo_url || faviconFor(c.website || c.domain);
            return {
              name: c.name,
              src: src || "",
            };
          });
          setClients(formatted);
        } else {
          setClients(STATIC_CLIENTS);
        }
      } catch (err) {
        console.error("Error fetching client logos:", err);
        setClients(STATIC_CLIENTS);
      }
    };

    fetchClients();
  }, []);

  const displayClients = clients.length > 0 ? clients : STATIC_CLIENTS;
  // Duplicate list to make infinite slider smooth
  const itemsList = [...displayClients, ...displayClients, ...displayClients];

  return (
    <section className="relative py-12 md:py-16 border-y border-white/[0.06] overflow-hidden">
      {/* soft ambient glow */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

      <div className="container mx-auto px-4 md:px-6">
        {/* eyebrow with flanking hairlines */}
        <div className="flex items-center justify-center gap-4 mb-9 md:mb-11">
          <span className="h-px w-10 md:w-20 bg-gradient-to-r from-transparent to-primary/30" />
          <p className="text-[11px] font-display font-semibold tracking-[0.3em] uppercase text-muted-foreground whitespace-nowrap">
            Vertrouwd door ambitieuze B2B teams
          </p>
          <span className="h-px w-10 md:w-20 bg-gradient-to-l from-transparent to-primary/30" />
        </div>

        <InfiniteSlider
          speed={42}
          items={itemsList.map((c, i) => (
            <div
              key={`${c.name}-${i}`}
              className="group/logo flex h-16 w-32 md:h-20 md:w-44 items-center justify-center rounded-xl border border-white/[0.06] bg-white/[0.025] px-5 backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/25 hover:bg-white/[0.05] hover:shadow-[0_10px_30px_-12px_hsl(var(--primary)/0.4)]"
            >
              {c.src ? (
                <img
                  src={c.src}
                  alt={c.name}
                  loading="lazy"
                  className="max-h-7 md:max-h-9 w-auto object-contain opacity-50 grayscale transition-all duration-300 group-hover/logo:opacity-100 group-hover/logo:grayscale-0"
                  onError={(e) => {
                    const el = e.target as HTMLImageElement;
                    el.style.display = "none";
                    el.insertAdjacentHTML(
                      "afterend",
                      `<span class="text-sm font-display font-semibold tracking-wide text-foreground/70">${c.name}</span>`,
                    );
                  }}
                />
              ) : (
                <span className="text-sm font-display font-semibold tracking-wide text-foreground/60 transition-colors group-hover/logo:text-foreground/90">
                  {c.name}
                </span>
              )}
            </div>
          ))}
        />
      </div>
    </section>
  );
};

export default ExactLogoWall;