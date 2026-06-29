import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Check, Calendar, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { openBookingModal } from "@/components/booking/GlobalBookingModal";
import { Spotlight, Meteors } from "@/components/hhwv2/ui/magic";
import { supabase } from "@/integrations/supabase/client";

const ExactFinalCta = () => {
  const [form, setForm] = useState({ name: "", email: "", company: "", size: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!form.name.trim() || !form.email.trim()) return;
    setSubmitting(true);
    try {
      const { error: insertError } = await supabase.from("contact_submissions").insert({
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        company: form.company.trim() || null,
        message: `Demo-aanvraag via Hoe het werkt. Bedrijfsgrootte: ${form.size || "onbekend"}.`,
        selected_package: { source: "hoe-het-werkt-final-cta", size: form.size },
      });
      if (insertError) throw insertError;
      setSubmitted(true);
    } catch (err) {
      console.error("contact_submissions insert failed", err);
      setError("Versturen mislukt. Probeer het nog eens of plan direct een afspraak.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-2xl border border-primary/25 card-gradient p-6 md:p-10 lg:p-12 shadow-[0_0_80px_-20px_hsl(var(--primary)/0.35)]"
        >
          <Meteors number={14} />
          <Spotlight size={560} />
          <div className="relative z-10 grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div>
              <p className="text-primary font-display font-semibold text-[11px] tracking-[0.22em] uppercase mb-3">
                Klaar om te versnellen?
              </p>
              <h2 className="font-display font-bold text-3xl md:text-4xl lg:text-5xl tracking-tight leading-tight mb-4">
                Klaar om jouw <span className="font-serif italic text-gradient-animate">groeimachine</span> te starten?
              </h2>
              <p className="text-muted-foreground text-base leading-relaxed mb-6">
                Laat je gegevens achter en we nemen binnen 24 uur contact op — of plan direct een afspraak in de agenda.
              </p>
              <Button
                type="button"
                onClick={() => openBookingModal()}
                variant="outline"
                size="lg"
                className="group"
              >
                <Calendar className="h-4 w-4 mr-2" />
                Plan afspraak in agenda
                <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-0.5" />
              </Button>
            </div>
            {submitted ? (
              <div className="rounded-xl border border-primary/30 bg-primary/5 p-6 flex flex-col items-start gap-3">
                <CheckCircle2 className="h-8 w-8 text-primary" />
                <h3 className="font-display font-bold text-xl">Bedankt!</h3>
                <p className="text-muted-foreground text-sm">
                  We hebben je aanvraag ontvangen en nemen binnen 24 uur contact op.
                </p>
                <button
                  type="button"
                  onClick={() => openBookingModal()}
                  className="text-primary font-display font-semibold text-sm inline-flex items-center gap-1.5 hover:underline"
                >
                  Of plan zelf een tijdstip <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-3">
                <Field label="Naam" placeholder="Je naam" value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
                <Field label="E-mailadres" type="email" placeholder="naam@bedrijf.nl" value={form.email} onChange={(v) => setForm({ ...form, email: v })} />
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                <Field label="Bedrijf" placeholder="Jouw bedrijf" value={form.company} onChange={(v) => setForm({ ...form, company: v })} />
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-display font-semibold text-foreground/80">Hoeveel medewerkers?</label>
                  <select
                    value={form.size}
                    onChange={(e) => setForm({ ...form, size: e.target.value })}
                    className="rounded-md border border-primary/25 bg-background/60 px-3 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary/60"
                  >
                    <option value="">Kies een range</option>
                    <option>1—10</option>
                    <option>11—50</option>
                    <option>51—200</option>
                    <option>200+</option>
                  </select>
                </div>
              </div>
              <Button type="submit" disabled={submitting} variant="hero" size="lg" className="group relative w-full overflow-hidden">
                <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                {submitting ? "Versturen…" : "Stuur mijn aanvraag"}
                <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
              {error && <p className="text-xs text-destructive">{error}</p>}
              <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[12px] text-muted-foreground pt-2">
                <span className="inline-flex items-center gap-1.5">
                  <Check className="h-3.5 w-3.5 text-primary" strokeWidth={2.5} /> Binnen 24 uur reactie
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Check className="h-3.5 w-3.5 text-primary" strokeWidth={2.5} /> Geen verplichtingen
                </span>
              </div>
            </form>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const Field = ({
  label,
  placeholder,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-xs font-display font-semibold text-foreground/80">{label}</label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      required
      className="rounded-md border border-primary/25 bg-background/60 px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary/60"
    />
  </div>
);

export default ExactFinalCta;