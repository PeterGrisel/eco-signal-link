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
    supabase
      .from("client_logos")
      .select("id, name, domain, logo_url, scale, padding, website")
      .eq("is_visible", true)
      .order("sort_order")
      .then(({ data }) => {
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
      })
      .catch(() => {
        setClients(STATIC_CLIENTS);
      });
  }, []);

  const displayClients = clients.length > 0 ? clients : STATIC_CLIENTS;
  // Duplicate list to make infinite slider smooth
  const itemsList = [...displayClients, ...displayClients, ...displayClients];

  return (
    <section className="py-10 md:py-14 border-y border-primary/10 bg-card/20">
      <div className="container mx-auto px-4 md:px-6">
        <p className="text-center text-[11px] font-display font-semibold tracking-[0.28em] uppercase text-muted-foreground mb-7">
          Vertrouwd door ambitieuze B2B teams
        </p>
        <InfiniteSlider
          speed={45}
          items={itemsList.map((c, i) => (
            <span
              key={`${c.name}-${i}`}
              className="inline-flex items-center px-8 md:px-10 h-10 md:h-12"
            >
              {c.src ? (
                <img
                  src={c.src}
                  alt={c.name}
                  loading="lazy"
                  className="h-full w-auto object-contain opacity-70 hover:opacity-100 transition-opacity"
                  style={{ filter: "grayscale(100%) brightness(1.6) contrast(0.9)" }}
                  onError={(e) => {
                    // Hide or handle load error gracefully
                    (e.target as HTMLElement).style.display = "none";
                  }}
                />
              ) : (
                <span className="text-sm font-display font-semibold tracking-wide text-foreground/80">
                  {c.name}
                </span>
              )}
            </span>
          ))}
        />
      </div>
    </section>
  );
};

export default ExactLogoWall;