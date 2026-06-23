import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import VideoDialog from "./ui/VideoDialog";
import { CTA } from "@/content/copy";

const VideoCaptureSection = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const target = CTA.gratisScan.href + (email ? `?email=${encodeURIComponent(email)}` : "");
    if (CTA.gratisScan.external) {
      window.open(target, "_blank");
    } else {
      window.location.hash = target.replace(/^#/, "");
    }
  };

  const handlePlay = () => {
    const ev = new CustomEvent("open-booking-modal", { detail: { source: "Hoe het werkt v2 — video" } });
    window.dispatchEvent(ev);
  };

  return (
    <section className="relative pt-4 pb-16 md:pb-24">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <VideoDialog onPlay={handlePlay} />
          <form
            onSubmit={handleSubmit}
            className="mt-6 flex flex-col sm:flex-row gap-3 rounded-2xl border border-primary/25 bg-card/60 p-3 backdrop-blur"
          >
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="je werk-email"
              className="flex-1 bg-transparent px-4 py-3 text-base text-foreground placeholder:text-muted-foreground/60 focus:outline-none"
              aria-label="Werk-email"
            />
            <Button type="submit" variant="hero" size="lg">
              Plan groeisessie
              <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </form>
          <p className="mt-3 text-center text-xs text-muted-foreground">
            60 minuten. Vrijblijvend. Je krijgt je 1-Pagina Groeiplan mee.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default VideoCaptureSection;