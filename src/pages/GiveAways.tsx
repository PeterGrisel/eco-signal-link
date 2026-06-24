import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { usePageMeta } from "@/hooks/usePageMeta";

interface Bucket { id: string; name: string; tagline: string | null; description: string | null; cta_text: string | null; }
interface Item { id: string; slug: string; title: string; subtitle: string | null; intro: string | null; layout: string; slot_label: string | null; type_label: string | null; is_bonus: boolean; }

const GiveAways = () => {
  const [bucket, setBucket] = useState<Bucket | null>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  usePageMeta({
    title: "Give-Aways · B2BGroeiMachine",
    description: "24 gratis B2B-templates. Eén per week. Scherp je groeisysteem aan met scorecards, canvas, checklists, frameworks en playbooks.",
  });

  useEffect(() => {
    (async () => {
      const { data: b } = await supabase.from("content_buckets").select("*").eq("slug", "give-aways").maybeSingle();
      if (b) setBucket(b as any);
      const { data: it } = await supabase
        .from("content_bucket_items")
        .select("id,slug,title,subtitle,intro,layout,slot_label,type_label,is_bonus")
        .eq("bucket_id", (b as any)?.id)
        .eq("status", "published")
        .order("position", { ascending: true });
      setItems((it as any) || []);
      setLoading(false);
    })();
  }, []);

  const core = items.filter((i) => !i.is_bonus);
  const bonus = items.filter((i) => i.is_bonus);

  return (
    <>
      <Navbar />
      <main className="bg-background min-h-screen">
        <section className="border-b border-border">
          <div className="container mx-auto px-6 md:px-8 py-16 md:py-24">
            <div className="flex items-center gap-2.5 mb-5">
              <span className="block w-5 h-px bg-primary" />
              <span className="uppercase tracking-[0.14em] text-[11px] text-primary font-display font-semibold">
                Content engine · gratis weggeeftemplates
              </span>
            </div>
            <h1 className="font-display font-bold text-4xl md:text-6xl leading-[1.05] tracking-tight max-w-3xl">
              Give-<span className="italic font-medium text-primary">Aways.</span>
            </h1>
            <p className="mt-4 max-w-xl text-muted-foreground text-lg leading-relaxed">
              {bucket?.description || "Eén template per week. Direct te gebruiken om je B2B-groeisysteem scherper te maken."}
            </p>
            <div className="mt-6 flex items-center gap-2 text-sm text-muted-foreground font-mono">
              <span className="text-primary">{items.length}</span>
              <span>templates</span>
              <span className="opacity-50">·</span>
              <span>1 systeem</span>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-6 md:px-8 py-12">
          {loading && <div className="text-muted-foreground text-sm">Laden…</div>}
          {!loading && (
            <>
              <CardGrid title="Kerntemplates" items={core} />
              {bonus.length > 0 && <div className="mt-12"><CardGrid title="Bonus" items={bonus} /></div>}
            </>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
};

const CardGrid = ({ title, items }: { title: string; items: Item[] }) => (
  <div>
    <div className="flex items-center gap-2.5 mb-5">
      <span className="block w-5 h-px bg-primary" />
      <span className="uppercase tracking-[0.14em] text-[11px] text-primary font-display font-semibold">{title}</span>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {items.map((it) => (
        <Link
          key={it.id}
          to={`/give-aways/${it.slug}`}
          className="group block bg-card border border-border rounded-xl p-5 hover:border-primary/60 transition-colors"
        >
          <div className="flex items-center justify-end gap-2 mb-3">
            <span className="text-[9px] uppercase tracking-[0.08em] text-muted-foreground border border-border rounded-md px-1.5 py-0.5 font-display font-semibold">
              {it.type_label}
            </span>
          </div>
          <h3 className="font-display font-medium text-[15px] leading-tight text-foreground group-hover:text-primary transition-colors">
            {it.title}
          </h3>
          {it.intro && <p className="mt-2 text-xs text-muted-foreground leading-relaxed line-clamp-3">{it.intro}</p>}
        </Link>
      ))}
    </div>
  </div>
);

export default GiveAways;