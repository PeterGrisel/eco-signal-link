import { motion } from "framer-motion";
import { TextSplit } from "@/components/ui/split-text";

/**
 * Korte, pakkende tussenstop tussen acts. Twee zinnen: wit + oranje.
 * Letters reageren op de muis (TextSplit hover-effect).
 */
export default function CinematicBridge({
  white,
  orange,
}: {
  white: string;
  orange: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-15% 0px" }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="relative py-32 md:py-48"
    >
      <div className="container mx-auto px-4 md:px-6 space-y-2 md:space-y-3">
        <TextSplit
          className="font-display font-bold tracking-tight text-4xl md:text-6xl lg:text-7xl"
          topClassName="text-foreground"
          bottomClassName="text-foreground"
          maxMove={28}
        >
          {white}
        </TextSplit>
        <TextSplit
          className="font-display font-bold tracking-tight text-4xl md:text-6xl lg:text-7xl"
          topClassName="text-primary"
          bottomClassName="text-primary"
          maxMove={28}
        >
          {orange}
        </TextSplit>
      </div>
    </motion.div>
  );
}