import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Brain, ArrowRight } from "lucide-react";
import PageLoader from "@/components/PageLoader";
import { KlantCases } from "@/components/cases/KlantCases";
import { Container } from "@/components/v2/Container";
import { Footer } from "@/components/v2/Footer";
import { GroeiplanCta } from "@/components/v2/GroeiplanCta";
import { Nav } from "@/components/v2/Nav";
import { Section } from "@/components/v2/Section";
import { SectionHeader } from "@/components/v2/SectionHeader";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";
import JsonLd from "@/components/JsonLd";
import { buildClientsSchema } from "@/data/schemaOrg";
import { supabase } from "@/integrations/supabase/client";
import { faviconFor } from "@/data/groeistack";
import { usePageMeta } from "@/hooks/usePageMeta";
import { useBolMaten } from "@/hooks/useBolMaten";
import SphereImageGrid from "@/components/ui/img-sphere";
import InfiniteSlider from "@/components/hhwv2/ui/InfiniteSlider";

interface Client {
  id: string;
  name: string;
  domain: string;
  logo_url: string | null;
  scale: number;
  padding: number;
  sector: string | null;
  description: string | null;
  blog_slug: string | null;
  website: string | null;
}

interface RelatedBlog {
  slug: string;
  title: string;
}

const ClientLogo = ({ client, size = 56 }: { client: Client; size?: number }) => {
  const [err, setErr] = useState(false);
  const src = client.logo_url || faviconFor(client.website || client.domain);
  const showFallback = err || !src;
  const isHego = client.name.toLowerCase().includes("hego");

  if (isHego && !showFallback) {
    return (
      <div
        className="flex items-center justify-center overflow-hidden shrink-0 relative"
        style={{ width: size, height: size }}
      >
        <div
          aria-hidden
          className="absolute inset-0 rounded-xl backdrop-blur-2xl border"
          style={{
            background: `radial-gradient(130% 130% at 30% 20%, hsl(var(--foreground) / 0.95) 0%, hsl(var(--foreground) / 0.85) 45%, hsl(var(--foreground) / 0.7) 100%)`,
            borderColor: `hsl(var(--foreground) / 0.6)`,
            boxShadow: `inset 0 1px 0 hsl(0 0% 100% / 0.6), inset 0 -1px 0 hsl(var(--foreground) / 0.2), 0 10px 30px -10px #003E7E99`,
          }}
        />
        <div
          aria-hidden
          className="absolute inset-0 rounded-xl pointer-events-none"
          style={{
            background: `linear-gradient(135deg, hsl(0 0% 100% / 0.5) 0%, transparent 40%, transparent 60%, hsl(0 0% 100% / 0.2) 100%)`,
            mixBlendMode: "overlay",
          }}
        />
        <img
          src={src}
          alt={client.name}
          className="relative object-contain drop-shadow-md"
          style={{ transform: `scale(${client.scale ?? 1})`, maxWidth: "80%", maxHeight: "80%" }}
          loading="lazy"
          onError={() => setErr(true)}
        />
      </div>
    );
  }

  return (
    <div
      className="flex items-center justify-center overflow-hidden shrink-0"
      style={{ width: size, height: size, padding: client.padding ?? 0 }}
    >
      {showFallback ? (
        <span className="font-display font-bold text-brand-ink-3" style={{ fontSize: size * 0.35 }}>
          {client.name[0]}
        </span>
      ) : (
        <img
          src={src}
          alt={client.name}
          className="object-contain"
          style={{ transform: `scale(${client.scale ?? 1})`, maxWidth: "100%", maxHeight: "100%" }}
          loading="lazy"
          onError={() => setErr(true)}
        />
      )}
    </div>
  );
};

const BrainRadial = ({ clients }: { clients: Client[] }) => {
  // Two counter-rotating orbits.
  const inner = clients.slice(0, Math.min(6, Math.ceil(clients.length / 2)));
  const outer = clients.slice(inner.length);

  const Ring = ({
    group,
    radiusPct,
    duration,
    reverse,
    offset = 0,
  }: {
    group: Client[];
    radiusPct: number;
    duration: number;
    reverse?: boolean;
    offset?: number;
  }) => (
    <div
      className="absolute inset-0"
      style={{
        animation: `klanten-spin ${duration}s linear infinite`,
        animationDirection: reverse ? "reverse" : "normal",
      }}
    >
      {group.map((c, i) => {
        const angle = (i / group.length) * 2 * Math.PI - Math.PI / 2 + offset;
        const x = 50 + radiusPct * Math.cos(angle);
        const y = 50 + radiusPct * Math.sin(angle);
        return (
          <a
            key={c.id}
            href={`#klant-${c.id}`}
            className="absolute -translate-x-1/2 -translate-y-1/2 flex items-center gap-1.5 rounded-md bg-background/85 border border-foreground/15 px-2.5 py-1.5 shadow-sm hover:border-primary/50 hover:bg-background transition-colors"
            style={{
              left: `${x}%`,
              top: `${y}%`,
              // Counter-rotate so the pill stays upright while the ring spins.
              animation: `klanten-spin ${duration}s linear infinite`,
              animationDirection: reverse ? "normal" : "reverse",
            }}
          >
            <ClientLogo client={c} size={18} />
            <span className="text-[10px] uppercase tracking-wider text-foreground/85 whitespace-nowrap">
              {c.name}
            </span>
          </a>
        );
      })}
    </div>
  );

  return (
    <div className="relative aspect-square w-full max-w-md mx-auto">
      {/* Ring guides */}
      <div className="absolute inset-0 rounded-full border border-primary/20" />
      <div className="absolute inset-8 rounded-full border border-primary/15" />
      <div className="absolute inset-16 rounded-full border border-primary/10" />

      {/* Center brein */}
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <div className="flex flex-col items-center justify-center h-28 w-28 rounded-full bg-primary/10 border border-primary/40">
          <Brain className="h-7 w-7 text-primary mb-1" strokeWidth={1.5} />
          <span className="text-[9px] uppercase tracking-[0.2em] text-foreground/90 text-center leading-tight">
            Commercieel
            <br />
            Brein
          </span>
        </div>
      </div>

      <Ring group={inner} radiusPct={30} duration={45} />
      <Ring group={outer} radiusPct={46} duration={70} reverse offset={Math.PI / Math.max(outer.length, 1)} />

      <style>{`
        @keyframes klanten-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

// Bento sizing rotation: 6 columns grid; mix of sizes for visual rhythm.
const bentoSpans = [
  "md:col-span-2 md:row-span-2", // large
  "md:col-span-2",
  "md:col-span-2",
  "md:col-span-2",
  "md:col-span-2 md:row-span-2",
  "md:col-span-2",
  "md:col-span-2",
  "md:col-span-2",
  "md:col-span-3",
  "md:col-span-3",
  "md:col-span-2",
  "md:col-span-2",
  "md:col-span-2",
];

const Klanten = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [blogs, setBlogs] = useState<Record<string, RelatedBlog>>({});
  const [loading, setLoading] = useState(true);

  // Bolgrootte mee laten schalen met het scherm (ook bij rotatie/resize).
  const bol = useBolMaten();

  usePageMeta({
    title: "Klanten | B2BGroeiMachine",
    description:
      "Een selectie van ambitieuze B2B-organisaties die met ons commerciële brein voorspelbare groei bouwen.",
    canonical: "https://www.b2bgroeimachine.io/klanten",
  });

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from("client_logos")
        .select("id, name, domain, logo_url, scale, padding, sector, description, blog_slug, website")
        .eq("is_visible", true)
        .order("sort_order");
      const list = (data as Client[]) ?? [];
      setClients(list);

      const slugs = list.map((c) => c.blog_slug).filter(Boolean) as string[];
      if (slugs.length) {
        const { data: posts } = await supabase
          .from("blog_posts")
          .select("slug, title")
          .in("slug", slugs)
          .eq("status", "published");
        const map: Record<string, RelatedBlog> = {};
        (posts ?? []).forEach((p) => {
          map[p.slug] = p as RelatedBlog;
        });
        setBlogs(map);
      }
      setLoading(false);
    };
    load();
  }, []);

  return (
    <PageLoader>
      <div className="min-h-screen bg-brand-paper">
        <BreadcrumbJsonLd
          items={[
            { name: "Home", url: "https://www.b2bgroeimachine.io/" },
            { name: "Klanten", url: "https://www.b2bgroeimachine.io/klanten" },
          ]}
        />
        {clients.length > 0 && (
          <JsonLd
            id="klanten-itemlist-jsonld"
            data={buildClientsSchema(clients, "https://www.b2bgroeimachine.io/klanten")}
          />
        )}
        <Nav />

        <main>
          {/* Hero met de klantenbol. */}
          <header className="bg-brand-deep text-white">
            <Container className="pb-10 pt-16 lg:pt-24">
              <div className="v2-enter max-w-[46rem]">
                <p className="mb-6 font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-brand-accent">
                  [ Klanten ]
                </p>
                <h1 className="mb-[22px] font-display text-[length:var(--v2-h1)] font-black leading-[1.02] tracking-[-0.035em]">
                  Eén brein, <span className="text-brand-accent">veel bewegingen.</span>
                </h1>
                <p className="max-w-[56ch] text-[16.5px] leading-relaxed text-[#D6CEC3]">
                  Ambitieuze B2B-organisaties draaien op hetzelfde commerciële fundament. Verschillende sectoren,
                  dezelfde aanpak: data, signalen en herhaalbaar proces.
                </p>
              </div>

              <div className="mt-10">
                {loading ? (
                  <div className="mx-auto h-[420px] max-w-2xl animate-pulse rounded-full bg-white/5" />
                ) : bol.mobiel ? (
                  /* Op mobiel stottert de 3D-bol; toon dan de eenvoudige logo-slider. */
                  <InfiniteSlider
                    speed={38}
                    items={[...clients, ...clients, ...clients].map((c, i) => (
                      <a
                        key={`${c.id}-${i}`}
                        href={`#klant-${c.id}`}
                        className="flex h-20 w-32 items-center justify-center rounded-brand border border-white/[.14] bg-white px-4"
                      >
                        <ClientLogo client={c} size={48} />
                      </a>
                    ))}
                  />
                ) : (
                  <div className="flex justify-center overflow-hidden">
                    <SphereImageGrid
                      key={bol.containerSize}
                      className="mx-auto"
                      images={clients
                        .map((c) => ({
                          id: c.id,
                          src: c.logo_url || faviconFor(c.website || c.domain) || "",
                          alt: c.name,
                          title: c.name,
                          description: c.sector || undefined,
                        }))
                        .filter((i) => i.src)}
                      containerSize={bol.containerSize}
                      sphereRadius={bol.sphereRadius}
                      baseImageScale={bol.baseImageScale}
                      hoverScale={bol.hoverScale}
                      dragSensitivity={bol.dragSensitivity}
                      momentumDecay={0.96}
                      autoRotate
                      autoRotateSpeed={bol.autoRotateSpeed}
                      showModal={false}
                      onImageClick={(img) => {
                        const el = document.getElementById(`klant-${img.id}`);
                        el?.scrollIntoView({ behavior: "smooth", block: "start" });
                      }}
                    />
                  </div>
                )}
              </div>
            </Container>
          </header>

          <KlantCases tone="mist" />

          {/* Alle klanten. */}
          <Section tone="paper" id="alle-klanten">
            <SectionHeader
              eyebrow="Wie werkt met ons"
              title="Klanten in het wild."
              lead="Korte schets per organisatie: sector, samenwerking en, waar relevant, een achtergrondartikel."
            />
            <div className="grid auto-rows-[minmax(180px,auto)] grid-cols-1 gap-[14px] md:grid-cols-6">
              {clients.map((c, i) => {
                const span = bentoSpans[i % bentoSpans.length];
                const blog = c.blog_slug ? blogs[c.blog_slug] : undefined;
                const isLarge = span.includes("row-span-2");
                return (
                  <article
                    key={c.id}
                    id={`klant-${c.id}`}
                    className={`flex scroll-mt-24 flex-col justify-between rounded-brand border border-brand-line bg-brand-mist p-6 transition-colors hover:border-brand-accent ${span}`}
                  >
                    <div>
                      <div className="mb-4 flex items-start justify-between gap-3">
                        <ClientLogo client={c} size={isLarge ? 56 : 40} />
                        {c.sector && (
                          <span className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-brand-accent-ink">
                            {c.sector}
                          </span>
                        )}
                      </div>
                      <h3
                        className={`mb-2 font-display font-bold leading-tight tracking-[-0.015em] ${
                          isLarge ? "text-2xl md:text-3xl" : "text-lg"
                        }`}
                      >
                        {c.name}
                      </h3>
                      {c.description && (
                        <p
                          className={`leading-relaxed text-brand-ink-2 ${
                            isLarge ? "text-[15px]" : "line-clamp-3 text-[13.5px]"
                          }`}
                        >
                          {c.description}
                        </p>
                      )}
                    </div>

                    {(blog || c.website || c.domain) && (
                      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-brand-line pt-4 text-xs">
                        {blog && (
                          <Link
                            to={`/blog/${blog.slug}`}
                            className="inline-flex items-center gap-1.5 font-semibold text-brand-accent-ink hover:underline"
                          >
                            Lees: {blog.title}
                            <ArrowRight className="h-3 w-3" />
                          </Link>
                        )}
                        {(c.website || c.domain) && (
                          <a
                            href={`https://${(c.website || c.domain).replace(/^https?:\/\//, "")}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-brand-ink-3 transition-colors hover:text-brand-ink"
                          >
                            {(c.website || c.domain).replace(/^https?:\/\//, "")}
                          </a>
                        )}
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          </Section>

          <GroeiplanCta />
        </main>
        <Footer />
      </div>
    </PageLoader>
  );
};

export default Klanten;