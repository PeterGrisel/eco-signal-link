import { motion } from "framer-motion";

/**
 * Korte, pakkende tussenstop tussen acts. Twee zinnen: wit + oranje.
 * Rustige fade-in per regel, geen letter-effect.
 */
export default function CinematicBridge({
  white,
  orange,
}: {
  white: string;
  orange: string;
}) {
  return (
    <section className="relative py-32 md:py-48">
      <div className="container mx-auto px-4 md:px-6">
        <h2 className="font-display font-bold tracking-tight text-4xl md:text-6xl lg:text-7xl leading-[1.05] [text-wrap:balance]">
          <motion.span
            className="block text-foreground"
            initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true, margin: "-15% 0px" }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            {white}
          </motion.span>
          <motion.span
            className="block text-primary"
            initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true, margin: "-15% 0px" }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.25 }}
          >
            {orange}
          </motion.span>
        </h2>
      </div>
    </section>
  );
}