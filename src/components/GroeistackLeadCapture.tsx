import { useState } from "react";
import { motion } from "framer-motion";
import { Bell, CheckCircle2, Loader2 } from "lucide-react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

const schema = z.object({
  name: z.string().trim().min(2, "Vul uw naam in").max(100),
  email: z.string().trim().email("Ongeldig e-mailadres").max(255),
});

const GroeistackLeadCapture = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const { toast } = useToast();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse({ name, email });
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
      source: "groeistack",
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
    toast({
      title: "Bedankt!",
      description: "U ontvangt updates zodra er nieuwe tools beschikbaar komen.",
    });
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 md:px-6 pb-16 md:pb-24"
    >
      <div className="max-w-2xl mx-auto card-gradient border-glow rounded-2xl p-6 md:p-10 text-center">
        <span className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 mb-4">
          <Bell className="w-5 h-5 text-primary" strokeWidth={1.6} />
        </span>
        <h2 className="font-display font-bold text-2xl md:text-3xl tracking-tight mb-3">
          Blijf op de hoogte van nieuwe tools
        </h2>
        <p className="text-muted-foreground mb-6">
          Wij testen continu nieuwe AI- en GTM-tools. Ontvang een mail zodra wij
          een nieuwe tool aan de Groeistack toevoegen.
        </p>

        {done ? (
          <div className="inline-flex items-center gap-2 text-primary font-medium">
            <CheckCircle2 className="w-5 h-5" />
            U staat op de lijst.
          </div>
        ) : (
          <form
            onSubmit={submit}
            className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto"
          >
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
          </form>
        )}
      </div>
    </motion.section>
  );
};

export default GroeistackLeadCapture;