import { Gauge, Workflow, Radar, Target, Repeat, Clock, Database, Layers, Bell } from "lucide-react";
import CardFlip from "@/components/ui/flip-card";

/**
 * 3 hook cards under the hero — predictability, efficiency, signal streams.
 * Interactive flip on hover/focus.
 */
export default function HomepageHook() {
  return (
    <section aria-label="Kerngedachten" className="relative py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid gap-6 md:gap-8 md:grid-cols-3">
          <CardFlip
            icon={Gauge}
            title="Voorspelbaarheid"
            subtitle="Pijplijn die niet meer afhangt van geluk"
            description="Wij maken uw groei meetbaar. Elke week zicht op signalen, gesprekken en conversie."
            features={["Wekelijkse meetmomenten", "Heldere KPI's", "Vaste ritmes", "Stabiele instroom"]}
            featureIcons={[Target, Gauge, Repeat, Clock]}
          />
          <CardFlip
            icon={Workflow}
            title="Efficiëntie"
            subtitle="Eén systeem, geen losse tools"
            description="Wij bundelen data, outreach en opvolging. Minder handwerk, meer focus op gesprekken."
            features={["Geautomatiseerde flows", "Minder handmatig werk", "Eén bron van waarheid", "Sneller schakelen"]}
            featureIcons={[Workflow, Clock, Database, Layers]}
          />
          <CardFlip
            icon={Radar}
            title="Signaalstromen"
            subtitle="Markt­gedrag wordt commerciële actie"
            description="Wij vangen koopsignalen op tientallen kanalen. Het brein bepaalt de juiste volgende stap."
            features={["Realtime signalen", "Verrijkte profielen", "Slimme triggers", "Sales alerts"]}
            featureIcons={[Radar, Database, Bell, Target]}
          />
        </div>
      </div>
    </section>
  );
}