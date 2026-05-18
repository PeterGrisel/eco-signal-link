import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Send, Loader2, Calendar, Mail, Phone, Building2 } from "lucide-react";
import { z } from "zod";
import { trackCTA, trackFormSubmit } from "@/lib/tracking";

const contactSchema = z.object({
  name: z.string().trim().min(1, "Naam is verplicht").max(100),
  email: z.string().trim().email("Ongeldig e-mailadres").max(255),
  company: z.string().trim().max(100).optional(),
  phone: z.string().trim().max(20).optional(),
  message: z.string().trim().min(1, "Bericht is verplicht").max(2000),
});

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", company: "", phone: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = contactSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach(err => {
        if (err.path[0]) fieldErrors[err.path[0] as string] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setSubmitting(true);
    const { error } = await supabase.from("contact_submissions").insert({
      name: result.data.name,
      email: result.data.email,
      company: result.data.company || null,
      phone: result.data.phone || null,
      message: result.data.message,
      session_id: sessionStorage.getItem("b2b_session_id") || null,
    });

    if (error) {
      toast({ title: "Fout bij verzenden", description: error.message, variant: "destructive" });
    } else {
      setSubmitted(true);
      trackFormSubmit("contact", { company: result.data.company });
      toast({ title: "Bericht verzonden!", description: "We nemen zo snel mogelijk contact op." });
    }
    setSubmitting(false);
  };

  const inputClass = (field: string) =>
    `w-full bg-background border ${errors[field] ? "border-red-500" : "border-border"} rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary/50 transition-colors`;

  return (
    <>
      <Navbar />
      <main className="pt-16">
        <section className="py-16 md:py-24 relative">
          <div className="absolute inset-0 glow-bg pointer-events-none" />
          <div className="container mx-auto px-4 md:px-6 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-2xl mx-auto mb-16"
            >
              <p className="text-primary font-display font-semibold text-sm tracking-[0.2em] uppercase mb-4">
                Contact
              </p>
              <h1 className="font-display font-bold text-3xl md:text-5xl tracking-tight leading-tight mb-4">
                Laten we
                <br />
                <span className="text-gradient">praten.</span>
              </h1>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Stel een vraag of plan direct een demo.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {/* Form */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                {submitted ? (
                  <div className="bg-card border border-border rounded-lg p-8 text-center">
                    <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-4">
                      <Send className="w-5 h-5 text-green-400" />
                    </div>
                    <h3 className="font-display font-bold text-xl mb-2">Bedankt!</h3>
                    <p className="text-sm text-muted-foreground">
                      We hebben uw bericht ontvangen en nemen zo snel mogelijk contact met u op.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="bg-card border border-border rounded-lg p-6 space-y-4">
                    <div>
                      <label htmlFor="contact-name" className="text-xs font-medium text-muted-foreground mb-1.5 block">Naam *</label>
                      <input
                        id="contact-name"
                        type="text"
                        value={form.name}
                        onChange={e => setForm({ ...form, name: e.target.value })}
                        placeholder="Uw naam"
                        className={inputClass("name")}
                      />
                      {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name}</p>}
                    </div>

                    <div>
                      <label htmlFor="contact-email" className="text-xs font-medium text-muted-foreground mb-1.5 block">E-mail *</label>
                      <input
                        id="contact-email"
                        type="email"
                        value={form.email}
                        onChange={e => setForm({ ...form, email: e.target.value })}
                        placeholder="naam@bedrijf.nl"
                        className={inputClass("email")}
                      />
                      {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label htmlFor="contact-company" className="text-xs font-medium text-muted-foreground mb-1.5 block">Bedrijf</label>
                        <input
                          id="contact-company"
                          type="text"
                          value={form.company}
                          onChange={e => setForm({ ...form, company: e.target.value })}
                          placeholder="Bedrijfsnaam"
                          className={inputClass("company")}
                        />
                      </div>
                      <div>
                        <label htmlFor="contact-phone" className="text-xs font-medium text-muted-foreground mb-1.5 block">Telefoon</label>
                        <input
                          id="contact-phone"
                          type="tel"
                          value={form.phone}
                          onChange={e => setForm({ ...form, phone: e.target.value })}
                          placeholder="+31 6..."
                          className={inputClass("phone")}
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="contact-message" className="text-xs font-medium text-muted-foreground mb-1.5 block">Bericht *</label>
                      <textarea
                        id="contact-message"
                        value={form.message}
                        onChange={e => setForm({ ...form, message: e.target.value })}
                        placeholder="Waar kunnen we u mee helpen?"
                        rows={4}
                        className={inputClass("message")}
                      />
                      {errors.message && <p className="text-xs text-red-400 mt-1">{errors.message}</p>}
                    </div>

                    <Button variant="hero" size="lg" type="submit" disabled={submitting} className="w-full gap-2">
                      {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                      Verstuur bericht
                    </Button>
                  </form>
                )}
              </motion.div>

              {/* Right: Demo + info */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-6"
              >
                {/* Demo booking */}
                <div className="bg-primary/5 border border-primary/20 rounded-lg p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <Calendar className="w-5 h-5 text-primary" />
                    <h3 className="font-display font-bold text-lg">Direct een demo?</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                    Plan een vrijblijvend gesprek en ontdek hoe ons systeem er voor uw organisatie uitziet.
                  </p>
                  <Button variant="hero" size="lg" className="w-full" asChild>
                    <a href="https://app.usemotion.com/meet/Rebel-Force/meeting" target="_blank" rel="noopener noreferrer"
                      onClick={() => trackCTA("Contact — Plan een Demo", "https://app.usemotion.com/meet/Rebel-Force/meeting")}>
                      Plan een gratis Demo →
                    </a>
                  </Button>
                </div>

                {/* Contact info */}
                <div className="bg-card border border-border rounded-lg p-6 space-y-4">
                  <h3 className="font-display font-bold text-lg">Bereikbaarheid</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm">
                      <Mail className="w-4 h-4 text-primary" />
                      <a href="mailto:info@rebelforce.nl" className="text-muted-foreground hover:text-foreground transition-colors">
                        info@rebelforce.nl
                      </a>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Phone className="w-4 h-4 text-primary" />
                      <a href="tel:+31852502925" className="text-muted-foreground hover:text-foreground transition-colors">
                        +31 85 250 2925
                      </a>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Building2 className="w-4 h-4 text-primary" />
                      <span className="text-muted-foreground">Powered by Rebel Force™</span>
                    </div>
                  </div>
                </div>

                {/* Quick links */}
                <div className="bg-card border border-border rounded-lg p-6">
                  <h3 className="font-display font-bold text-sm mb-3">Bekijk ook</h3>
                  <div className="space-y-2">
                    {[
                      { to: "/pricing", label: "Pricing configurator" },
                      { to: "/full-sales-management", label: "Full Sales Management" },
                      { to: "/full-service-recruitment", label: "Full Service Recruitment" },
                    ].map(link => (
                      <a key={link.to} href={link.to} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                        <span>→</span> {link.label}
                      </a>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default Contact;
