import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import SignaalLayout from "../components/SignaalLayout";

const TOOLS = ["Apollo", "HubSpot", "LinkedIn", "Clay", "Instantly", "40+ andere tools"];

const SignaalLanding = () => {
  return (
    <SignaalLayout>
      {/* Hero */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden">
        {/* Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#E8FF47]/5 rounded-full blur-[120px] pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative text-center max-w-3xl mx-auto"
        >
          <h1 className="font-['DM_Serif_Display'] text-5xl md:text-7xl leading-[1.1] mb-6 text-[#F0F0EE]">
            Stop met zoeken.{" "}
            <span className="text-[#E8FF47]">Begin met detecteren.</span>
          </h1>
          <p className="text-lg text-[#6B6B72] max-w-xl mx-auto mb-8 font-['DM_Sans'] font-light">
            Bouw het systeem dat prospects vindt op het moment dat ze klaar zijn — niet wanneer jij tijd hebt.
          </p>

          <Link
            to="/signaal/start"
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#E8FF47] text-[#0A0A0B] rounded-lg text-base font-medium hover:shadow-[0_0_30px_rgba(232,255,71,0.3)] transition-all font-['DM_Sans']"
          >
            Bouw jouw systeem gratis →
          </Link>
          <p className="mt-4 text-xs text-[#6B6B72] font-mono">
            7 lagen · 90 minuten · Jouw blueprint
          </p>
        </motion.div>

        {/* Animated layer stack */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="relative mt-16 w-full max-w-md mx-auto"
        >
          {Array.from({ length: 7 }, (_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + i * 0.1 }}
              className="flex items-center gap-3 py-2 px-4 mb-1 rounded bg-[#111113] border border-[#1E1E22]"
            >
              <span className="font-mono text-xs text-[#E8FF47] w-6">0{i + 1}</span>
              <span className="text-xs text-[#6B6B72] font-['DM_Sans']">
                {['Definitie', 'Signaalgewichten', 'Bronnen', 'Kritische vragen', 'Detectie', 'Drempelwaarde', 'Respons'][i]}
              </span>
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 + i * 0.15 }}
                className="ml-auto font-mono text-xs text-[#E8FF47]/60"
              >
                {[0, 15, 15, 20, 15, 10, 25][i]}pts
              </motion.span>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Social proof */}
      <div className="py-8 border-y border-[#1E1E22]">
        <p className="text-center text-xs text-[#6B6B72] font-['DM_Sans']">
          Werkt met{" "}
          {TOOLS.map((tool, i) => (
            <span key={tool}>
              <span className="text-[#F0F0EE]/60">{tool}</span>
              {i < TOOLS.length - 1 && " · "}
            </span>
          ))}
        </p>
      </div>

      {/* Three columns */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-8">
          {[
            { title: 'Leer waarom', desc: 'Universele principes die onder elk succesvol prospecting systeem liggen. Onafhankelijk van tooling.' },
            { title: 'Bepaal wat', desc: 'Jouw markt, jouw ICP, jouw signalen. Elke keuze wordt onderdeel van je blueprint.' },
            { title: 'Kies hoe', desc: 'Tool-agnostische executie. Van Apollo tot Clay — jij kiest wat past bij je stack.' },
          ].map((col) => (
            <div key={col.title} className="p-6 rounded-xl bg-[#111113] border border-[#1E1E22]">
              <h3 className="font-['DM_Serif_Display'] text-lg text-[#E8FF47] mb-3">{col.title}</h3>
              <p className="text-sm text-[#6B6B72] leading-relaxed font-['DM_Sans']">{col.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Signal pyramid */}
      <section className="py-24 px-6">
        <div className="max-w-lg mx-auto text-center">
          <h2 className="font-['DM_Serif_Display'] text-3xl text-[#F0F0EE] mb-12">De Signaal Piramide</h2>
          <div className="space-y-2">
            {[
              { zone: 'HEET', range: '≥40', color: '#E8FF47', width: 'w-1/3' },
              { zone: 'WARM', range: '20–39', color: '#E8FF47', width: 'w-2/3', opacity: 'opacity-50' },
              { zone: 'KOUD', range: '<20', color: '#E8FF47', width: 'w-full', opacity: 'opacity-20' },
            ].map((tier) => (
              <div
                key={tier.zone}
                className={`${tier.width} mx-auto py-4 rounded-lg border border-[#1E1E22] flex items-center justify-center gap-3 ${tier.opacity || ''}`}
                style={{ backgroundColor: `${tier.color}10` }}
              >
                <span className="font-mono text-sm font-medium" style={{ color: tier.color }}>{tier.zone}</span>
                <span className="text-xs text-[#6B6B72] font-mono">{tier.range}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-6 text-center">
        <p className="text-lg text-[#6B6B72] font-['DM_Sans'] mb-6">
          Start gratis. Export voor <span className="text-[#E8FF47] font-mono">€97</span>.
        </p>
        <Link
          to="/signaal/start"
          className="inline-flex items-center gap-2 px-8 py-4 bg-[#E8FF47] text-[#0A0A0B] rounded-lg text-base font-medium hover:shadow-[0_0_30px_rgba(232,255,71,0.3)] transition-all font-['DM_Sans']"
        >
          Bouw jouw systeem gratis →
        </Link>
      </section>
    </SignaalLayout>
  );
};

export default SignaalLanding;
