import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { BadgeCheck, ArrowRight } from "lucide-react";
import { toast } from "sonner";

interface PartnerOptInProps {
  userId: string;
  journeyId: string;
  userName?: string;
  userCompany?: string;
}

const SECTORS = [
  "IT & SaaS",
  "Zakelijke Dienstverlening",
  "Maakindustrie",
  "Engineering",
  "Financiële Sector",
  "Groothandel",
  "Opleiding & Training",
  "Leasemaatschappijen",
];

const PartnerOptIn = ({ userId, journeyId, userName, userCompany }: PartnerOptInProps) => {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: userName || "",
    company: userCompany || "",
    sector: "",
    tagline: "",
    linkedin_url: "",
    website: "",
  });

  const handleSubmit = async () => {
    if (!form.name || !form.company) {
      toast.error("Vul minimaal uw naam en bedrijf in.");
      return;
    }
    setLoading(true);
    const { error } = await supabase.from("partners").insert({
      user_id: userId,
      journey_id: journeyId,
      name: form.name,
      company: form.company,
      sector: form.sector || null,
      tagline: form.tagline || null,
      linkedin_url: form.linkedin_url || null,
      website: form.website || null,
    } as any);

    if (error) {
      if (error.code === "23505") {
        toast.info("U bent al aangemeld als partner.");
        setSubmitted(true);
      } else {
        toast.error("Er ging iets mis. Probeer het opnieuw.");
      }
    } else {
      toast.success("Aanmelding verstuurd! Na goedkeuring verschijnt u op de partnerpagina.");
      setSubmitted(true);
    }
    setLoading(false);
  };

  if (submitted) {
    return (
      <div className="p-6 rounded-xl border border-primary/30 bg-primary/5 text-center">
        <BadgeCheck className="w-8 h-8 text-primary mx-auto mb-2" />
        <p className="font-display font-semibold text-foreground">Aanmelding ontvangen!</p>
        <p className="text-sm text-muted-foreground mt-1">
          Na goedkeuring verschijnt u op de{" "}
          <a href="/partners" className="text-primary hover:underline">partnerpagina</a>.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 rounded-xl border border-border bg-card">
      <div className="flex items-center gap-2 mb-4">
        <BadgeCheck className="w-5 h-5 text-primary" />
        <h3 className="font-display font-semibold text-lg text-foreground">Word Signal Partner</h3>
      </div>
      <p className="text-sm text-muted-foreground mb-5">
        Ontvang uw Signal Certified badge en word zichtbaar voor andere B2B-professionals.
      </p>

      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <input
            type="text"
            placeholder="Uw naam *"
            value={form.name}
            onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))}
            className="px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
          />
          <input
            type="text"
            placeholder="Bedrijfsnaam *"
            value={form.company}
            onChange={(e) => setForm(f => ({ ...f, company: e.target.value }))}
            className="px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
          />
        </div>
        <select
          value={form.sector}
          onChange={(e) => setForm(f => ({ ...f, sector: e.target.value }))}
          className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:border-primary/50"
        >
          <option value="">Selecteer sector (optioneel)</option>
          {SECTORS.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <input
          type="text"
          placeholder="Korte tagline (optioneel)"
          value={form.tagline}
          onChange={(e) => setForm(f => ({ ...f, tagline: e.target.value }))}
          className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
        />
        <div className="grid grid-cols-2 gap-3">
          <input
            type="url"
            placeholder="LinkedIn URL (optioneel)"
            value={form.linkedin_url}
            onChange={(e) => setForm(f => ({ ...f, linkedin_url: e.target.value }))}
            className="px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
          />
          <input
            type="url"
            placeholder="Website (optioneel)"
            value={form.website}
            onChange={(e) => setForm(f => ({ ...f, website: e.target.value }))}
            className="px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
          />
        </div>
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:shadow-[0_0_20px_hsl(var(--primary)/0.3)] transition-all disabled:opacity-50"
        >
          {loading ? "Aanmelden..." : "Aanmelden als Signal Partner"}
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default PartnerOptIn;
