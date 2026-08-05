import { useEffect, useState, FormEvent } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { usePageMeta } from "@/hooks/usePageMeta";
import GiveawayAssetPage from "@/components/buckets/giveaway/GiveawayAssetPage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";

interface Item {
  id: string;
  bucket_id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  intro: string | null;
  layout: string;
  slot_label: string | null;
  type_label: string | null;
  payload: any;
}

const GiveAwayDetail = () => {
  const { slug } = useParams();
  const [params] = useSearchParams();
  const unlocked = params.get("u") === "1";

  const [item, setItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  usePageMeta({
    title: item ? `${item.title} · Give-Aways` : "Give-Away",
    description: item?.intro || "Gratis B2B-template van B2BGroeiMachine.",
  });

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("content_bucket_items")
        .select("id,bucket_id,slug,title,subtitle,intro,layout,slot_label,type_label,payload")
        .eq("slug", slug!)
        .eq("status", "published")
        .maybeSingle();
      setItem(data as any);
      setLoading(false);
    })();
  }, [slug]);

  useEffect(() => {
    if (!unlocked) return;
    document.body.classList.add("gw-printing");
    return () => { document.body.classList.remove("gw-printing"); };
  }, [unlocked]);

  // If arriving with a token, confirm the lead in the background
  useEffect(() => {
    const token = params.get("t");
    if (!token) return;
    supabase.functions.invoke("content-bucket-confirm", { body: { token } }).catch(() => {});
  }, [params]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!item) return;
    setSubmitting(true);
    try {
      const { error } = await supabase.functions.invoke("content-bucket-request", {
        body: {
          bucket_slug: "give-aways",
          item_slug: item.slug,
          email,
          name,
        },
      });
      if (error) throw error;
      setSubmitted(true);
      toast({ title: "Check je inbox", description: "We sturen een bevestigingslink. Klik die om de template te ontvangen." });
    } catch (err: any) {
      toast({ title: "Er ging iets mis", description: err.message || "Probeer het opnieuw.", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-background flex items-center justify-center text-muted-foreground">Laden…</main>
        <Footer />
      </>
    );
  }
  if (!item) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-background flex flex-col items-center justify-center gap-3">
          <div className="font-display text-2xl">Template niet gevonden</div>
          <Link to="/give-aways" className="text-primary underline">Terug naar overzicht</Link>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <div className="gw-root">
      <div className="js-chrome">
        <Navbar />
      </div>
      <div className="js-chrome bg-[#141414] border-y border-[#2E2E2E] py-3">
        <div className="container mx-auto px-6 md:px-8 flex items-center justify-between">
          <Link to="/give-aways" className="text-[#998D7D] hover:text-[#E8945A] text-sm font-display">← Alle templates</Link>
          <div className="flex items-center gap-2 text-xs text-[#998D7D] font-mono">
            {item.slot_label && (
              <>
                <span className="text-[#E8945A]">{item.slot_label}</span>
                <span className="opacity-50">·</span>
              </>
            )}
            <span>{item.type_label}</span>
          </div>
        </div>
      </div>

      {!unlocked && (
        <div className="js-chrome bg-[#141414]">
          <div className="container mx-auto px-6 md:px-8 py-10">
            <div className="max-w-xl mx-auto bg-[#1A1A1A] border border-[#2E2E2E] rounded-xl p-6 md:p-8">
              <div className="flex items-center gap-2.5 mb-3">
                <span className="block w-5 h-px bg-[#E8945A]" />
                <span className="uppercase tracking-[0.14em] text-[11px] text-[#E8945A] font-display font-semibold">Gratis · check je inbox</span>
              </div>
              <h2 className="font-display font-bold text-2xl text-[#EEEAE4]">{item.title}</h2>
              {item.intro && <p className="text-[#998D7D] mt-2 text-sm leading-relaxed">{item.intro}</p>}
              {submitted ? (
                <div className="mt-5 p-4 rounded-md border border-[#E8945A]/40 bg-[#E8945A]/10 text-[#E8945A] text-sm">
                  Mail verstuurd naar <strong>{email}</strong>. Klik de bevestigingslink om de template te openen.
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-3">
                  <Input
                    placeholder="Je naam"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="bg-[#121212] border-[#2E2E2E] text-[#EEEAE4]"
                  />
                  <Input
                    type="email"
                    required
                    placeholder="Zakelijk e-mailadres"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-[#121212] border-[#2E2E2E] text-[#EEEAE4]"
                  />
                  <Button
                    type="submit"
                    disabled={submitting}
                    className="bg-[#E8945A] text-[#121212] hover:bg-[#F0A968] font-display font-semibold"
                  >
                    {submitting ? "Versturen…" : "Stuur me de template"}
                  </Button>
                  <p className="text-[11px] text-[#998D7D]">
                    Je krijgt één bevestigingsmail. Daarna stuur ik niets ongevraagd, en je kunt altijd uitschrijven.
                  </p>
                </form>
              )}
            </div>

            <div className="mt-8 max-w-xl mx-auto opacity-50 pointer-events-none select-none">
              <PreviewBlur item={item} />
            </div>
          </div>
        </div>
      )}

      {unlocked && (
        <GiveawayAssetPage
          item={item}
          toolbar={
            <button
              onClick={() => window.print()}
              className="flex items-center gap-2 border border-[#2E2E2E] bg-transparent text-[#EEEAE4] px-3.5 py-2 rounded-md font-display font-medium text-[12.5px] hover:border-[#E8945A] hover:text-[#E8945A] transition-colors"
            >
              Print / PDF
            </button>
          }
        />
      )}

      <div className="js-chrome">
        <Footer />
      </div>
    </div>
  );
};

const PreviewBlur = ({ item }: { item: Item }) => (
  <div className="filter blur-sm">
    <GiveawayAssetPage item={item} />
  </div>
);

export default GiveAwayDetail;