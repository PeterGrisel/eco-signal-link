import { useState } from "react";
import { motion } from "framer-motion";
import { Bell, CheckCircle2, Loader2 } from "lucide-react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import { trackFormSubmit } from "@/lib/tracking";

const schema = z.object({
  name: z.string().trim().min(2, "Vul uw naam in").max(100),
  email: z.string().trim().email("Ongeldig e-mailadres").max(255),
  consent: z.literal(true, {
    errorMap: () => ({ message: "U dient akkoord te gaan met de privacyvoorwaarden" }),
  }),
});

interface GroeistackLeadCaptureProps {
  title?: string;
  description?: string;
  source?: string;
}

const GroeistackLeadCapture = ({
  title = "Wilt u op de hoogte blijven van alle GTM-ontwikkelingen?",
  description = "Ontvang een melding zodra wij nieuwe tools, playbooks en inzichten delen.",
  source = "groeistack",
}: GroeistackLeadCaptureProps) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const { toast } = useToast();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse({ name, email, consent });
    if (!parsed.success) {
      toast({
        title: "Controleer uw gegevens",
        description: parsed.error.issues[0]?.message ?? "Ongeldige invoer",
        variant: "destructive",
      });
      return;
    }
    setLoading(true);
    const sb = supabase as unknown as { from: (t: string) => any };
    const { error } = await sb.from("groeistack_leads").insert({
      name: parsed.data.name,
      email: parsed.data.email,
      source: source,
    });
    setLoading(false);
    if (error) {
      toast({
        title: "Er ging iets mis",
        description: "Probeer het later opnieuw.",
        variant: "destructive",
      });
      return;
    }
    setDone(true);
    trackFormSubmit("groeistack_lead", { source });
    toast({
      title: "Bedankt!",
      description: "U staat op de lijst en ontvangt onze updates.",
    });
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 md:px-6 pb-16 md:pb-20"
    >
      <div className="max-w-2xl mx-auto card-gradient border-glow rounded-2xl p-6 md:p-10 text-center">
        <span className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 mb-4">
          <Bell className="w-5 h-5 text-primary" strokeWidth={1.6} />
        </span>
        <h2 className="font-display font-bold text-2xl md:text-3xl tracking-tight mb-3">
          {title}
        </h2>
        <p className="text-muted-foreground mb-6">
          {description}
        </p>

        {done ? (
          <div className="inline-flex items-center gap-2 text-primary font-medium">
            <CheckCircle2 className="w-5 h-5" />
            U staat op de lijst.
          </div>
        ) : (
          <form
            onSubmit={submit}
            className="flex flex-col gap-4 max-w-xl mx-auto text-left"
          >
            <div className="flex flex-col sm:flex-row gap-3">
              <Input
                type="text"
                placeholder="Uw naam"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={100}
                required
                className="flex-1"
                autoComplete="name"
              />
              <Input
                type="email"
                placeholder="E-mailadres"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                maxLength={255}
                required
                className="flex-1"
                autoComplete="email"
              />
              <Button type="submit" disabled={loading} className="shrink-0">
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Houd mij op de hoogte"
                )}
              </Button>
            </div>
            
            <div className="flex items-start space-x-2 pt-1">
              <Checkbox
                id="consent"
                checked={consent}
                onCheckedChange={(checked) => setConsent(checked === true)}
                className="mt-1"
              />
              <Label
                htmlFor="consent"
                className="text-xs text-muted-foreground leading-normal cursor-pointer select-none"
              >
                Ik geef toestemming om mijn gegevens te verwerken en mij op de hoogte te houden van nieuwe GTM- en AI-ontwikkelingen. Uw gegevens worden verwerkt conform onze{" "}
                <Link to="/privacy" className="text-primary hover:underline" target="_blank">
                  Privacy Policy
                </Link>
                . *
              </Label>
            </div>
          </form>
        )}
      </div>
    </motion.section>
  );
};

export default GroeistackLeadCapture;