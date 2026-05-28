import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Brain, ArrowRight, Building2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageLoader from "@/components/PageLoader";
import CtaSection from "@/components/CtaSection";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";
import { supabase } from "@/integrations/supabase/client";
import { faviconFor } from "@/data/groeistack";
import { usePageMeta } from "@/hooks/usePageMeta";

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

  return (
    <div
      className="flex items-center justify-center overflow-hidden shrink-0"
      style={{ width: size, height: size, padding: client.padding ?? 0 }}
    >
      {showFallback ? (
        <span className="font-display font-bold text-foreground/70" style={{ fontSize: size * 0.35 }}>
          {client.name[0]}
        </span>
      ) : (
        <img
          src={src}
          alt={client.name}
          className="object-contain brightness-0 invert opacity-80 hover:opacity-100 transition-opacity"
          style={{ transform: `scale(${client.scale ?? 1})`, maxWidth: "100%", maxHeight: "100%" }}
          loading="lazy"
          onError={() => setErr(true)}
        />
      )}
    </div>
  );
};

const BrainRadial = ({ clients }: { clients: Client[] }) => {
  // Inner ring: first 6 clients close to brein; outer ring: the rest.
  const inner = clients.slice(0, Math.min(6, Math.ceil(clients.length / 2)));
  const outer = clients.slice(inner.length);

  const renderRing = (group: Client[], radiusPct: number, offset = 0) =>
    group.map((c, i) => {
      const angle = (i / group.length) * 2 * Math.PI - Math.PI / 2 + offset;
      const x = 50 + radiusPct * Math.cos(angle);
      const y = 50 + radiusPct * Math.sin(angle);
      return (
        <a
          key={c.id}
          href={`#klant-${c.id}`}
          className="absolute -translate-x-1/2 -translate-y-1/2 flex items-center gap-1.5 rounded-md bg-background/80 border border-foreground/15 px-2.5 py-1.5 shadow-sm hover:border-primary/50 hover:bg-background transition-colors"
          style={{ left: `${x}%`, top: `${y}%` }}
        >
          <ClientLogo client={c} size={18} />
          <span className="text-[10px] uppercase tracking-wider text-foreground/85 whitespace-nowrap">
            {c.name}
          </span>
        </a>
      );
    });

  return (
    <div className="relative aspect-square w-full max-w-md mx-auto">
      {/* Ring guides — exactly like Chapter05Brein */}
      <div className="absolute inset-0 rounded-full border border-primary/20" />
      <div className="absolute inset-8 rounded-full border border-primary/15" />
      <div className="absolute inset-16 rounded-full border border-primary/10" />

      {/* Center brein */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex flex-col items-center justify-center h-28 w-28 rounded-full bg-primary/10 border border-primary/40">
          <Brain className="h-7 w-7 text-primary mb-1" strokeWidth={1.5} />
          <span className="text-[9px] uppercase tracking-[0.2em] text-foreground/90 text-center leading-tight">
            Commercieel
            <br />
            Brein
          </span>
        </div>
      </div>

      {/* Inner orbit */}
      {renderRing(inner, 30)}
      {/* Outer orbit (offset to interleave) */}
      {renderRing(outer, 46, Math.PI / outer.length)}
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

  usePageMeta({
    title: "Klanten | B2BGroeiMachine",
    description:
      "Een selectie van ambitieuze B2B-organisaties die met ons commerciële brein voorspelbare groei bouwen.",
    canonical: "https://b2bgroeimachine.io/klanten",
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
      <div className="min-h-screen">
        <BreadcrumbJsonLd
          items={[
            { name: "Home", url: "https://b2bgroeimachine.io/" },
            { name: "Klanten", url: "https://b2bgroeimachine.io/klanten" },
          ]}
        />
        <Navbar />

        {/* Hero */}
        <section className="relative pt-32 pb-12 overflow-hidden">
          <div className="absolute inset-0 glow-bg pointer-events-none" />
          <div className="container mx-auto px-6 relative z-10 max-w-4xl text-center">
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-primary font-display font-semibold text-sm tracking-[0.2em] uppercase mb-5"
            >
              Klanten
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-display font-bold text-4xl md:text-6xl lg:text-7xl leading-[0.95] tracking-tight mb-6"
            >
              Eén <span className="text-gradient">brein</span>, veel bewegingen
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-muted-foreground text-lg md:text-xl leading-relaxed max-w-2xl mx-auto"
            >
              Ambitieuze B2B-organisaties draaien op hetzelfde commerciële fundament. Verschillende
              sectoren, dezelfde aanpak: data, signalen en herhaalbaar proces.
            </motion.p>
          </div>
        </section>

        {/* Brain Radial */}
        <section className="py-16 md:py-20">
          <div className="container mx-auto px-6">
            {loading ? (
              <div className="h-[500px] animate-pulse rounded-full bg-card/30 max-w-2xl mx-auto" />
            ) : (
              <BrainRadial clients={clients} />
            )}
          </div>
        </section>

        {/* Bento grid */}
        <section className="py-20 border-t border-border">
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="max-w-2xl mb-12"
            >
              <p className="text-primary font-display font-semibold text-sm tracking-[0.2em] uppercase mb-4">
                Wie werkt met ons
              </p>
              <h2 className="font-display font-bold text-2xl md:text-4xl mb-4">
                Klanten in <span className="text-gradient">het wild</span>
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Korte schets per organisatie: sector, samenwerking en, waar relevant, een
                achtergrondartikel.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-6 auto-rows-[180px] gap-4">
              {clients.map((c, i) => {
                const span = bentoSpans[i % bentoSpans.length];
                const blog = c.blog_slug ? blogs[c.blog_slug] : undefined;
                const isLarge = span.includes("row-span-2");
                return (
                  <motion.article
                    key={c.id}
                    id={`klant-${c.id}`}
                    initial={{ opacity: 0, y: 14 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.45, delay: (i % 6) * 0.05 }}
                    className={`card-gradient border border-glow rounded-2xl p-6 flex flex-col justify-between hover:border-primary/40 transition-colors ${span}`}
                  >
                    <div>
                      <div className="flex items-start justify-between gap-3 mb-4">
                        <ClientLogo client={c} size={isLarge ? 56 : 40} />
                        {c.sector && (
                          <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-[0.18em] text-primary/80 bg-primary/10 border border-primary/20 rounded-full px-2.5 py-1">
                            <Building2 className="w-3 h-3" />
                            {c.sector}
                          </span>
                        )}
                      </div>
                      <h3 className={`font-display font-semibold ${isLarge ? "text-2xl md:text-3xl" : "text-lg"} mb-2 leading-tight`}>
                        {c.name}
                      </h3>
                      {c.description && (
                        <p className={`text-muted-foreground leading-relaxed ${isLarge ? "text-base" : "text-sm line-clamp-3"}`}>
                          {c.description}
                        </p>
                      )}
                    </div>

                    {(blog || c.website || c.domain) && (
                      <div className="mt-4 pt-4 border-t border-border/40 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs">
                        {blog && (
                          <Link
                            to={`/blog/${blog.slug}`}
                            className="inline-flex items-center gap-1.5 text-primary hover:underline"
                          >
                            Lees: {blog.title}
                            <ArrowRight className="w-3 h-3" />
                          </Link>
                        )}
                        {(c.website || c.domain) && (
                          <a
                            href={`https://${(c.website || c.domain).replace(/^https?:\/\//, "")}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-muted-foreground hover:text-foreground transition-colors"
                          >
                            {(c.website || c.domain).replace(/^https?:\/\//, "")}
                          </a>
                        )}
                      </div>
                    )}
                  </motion.article>
                );
              })}
            </div>
          </div>
        </section>

        <CtaSection />
        <Footer />
      </div>
    </PageLoader>
  );
};

export default Klanten;