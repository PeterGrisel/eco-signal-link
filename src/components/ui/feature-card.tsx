"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Check } from "lucide-react";
import { motion } from "framer-motion";
import { ReactNode } from "react";

interface FeatureCardProps {
  title: string;
  description: string;
  items: string[];
  action?: ReactNode;
}

export function FeatureCard({ title, description, items, action }: FeatureCardProps) {
  return (
    <div className="relative w-full max-w-md mx-auto">
      {/* Glow */}
      <motion.div
        aria-hidden
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="absolute -inset-6 rounded-[2rem] bg-primary/20 blur-3xl pointer-events-none"
      />

      <Card className="relative bg-card/80 backdrop-blur-xl border border-foreground/10 rounded-3xl overflow-hidden">
        {/* Top gradient border */}
        <div
          aria-hidden
          className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent"
        />

        <CardContent className="p-8 md:p-10">
          <h3 className="font-display text-2xl md:text-3xl font-medium text-foreground mb-3 [text-wrap:balance]">
            {title}
          </h3>
          <p className="text-muted-foreground leading-relaxed mb-8">{description}</p>

          <div className="h-px w-full bg-foreground/10 mb-8" />

          <ul className="space-y-4 mb-10">
            {items.map((item, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: -8 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                className="flex items-start gap-3"
              >
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <Check className="h-3 w-3" strokeWidth={3} />
                </span>
                <span className="text-sm md:text-base text-foreground/90">{item}</span>
              </motion.li>
            ))}
          </ul>

          {action && <div className="flex justify-center">{action}</div>}
        </CardContent>
      </Card>
    </div>
  );
}