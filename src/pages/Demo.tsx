import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { usePageMeta } from "@/hooks/usePageMeta";
import { BOOKING_URL } from "@/content/copy";

const LOOM_EMBED = "https://www.loom.com/embed/c85440502c844aeb8a19d0cf831e83ff?hideEmbedTopBar=true";

const Demo = () => {
  usePageMeta({
    title: "Bekijk de 3-minuten uitleg | B2BGroeiMachine",
    description:
      "Zie in 3 minuten hoe wij voorspelbare B2B-pijplijn bouwen. Plan daarna direct uw Groeiplan-sessie.",
    canonical: "https://www.b2bgroeimachine.io/demo",
  });

  return (
    <>
      <Navbar />
      <main className="pt-24 pb-20">
        <section className="container mx-auto px-4 md:px-6 max-w-5xl">
          <div className="text-center mb-10">
            <p className="text-sm uppercase tracking-widest text-[#E8945A] mb-4">
              3 minuten uitleg
            </p>
            <h1 className="font-display text-3xl md:text-5xl font-bold leading-tight mb-4">
              Zo bouwt u voorspelbare B2B-pijplijn
            </h1>
            <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
              Bekijk de korte uitleg. Plan daarna direct uw Groeiplan-sessie.
              Geen verkoop-pitch, wel een helder beeld van uw groeimotor.
            </p>
          </div>

          <div
            className="relative w-full rounded-2xl overflow-hidden shadow-2xl border border-border bg-black"
            style={{ paddingBottom: "56.25%" }}
          >
            <iframe
              src={LOOM_EMBED}
              title="B2BGroeiMachine — 3 minuten uitleg"
              frameBorder={0}
              allowFullScreen
              allow="autoplay; fullscreen; picture-in-picture"
              className="absolute inset-0 w-full h-full"
            />
          </div>

          <div className="mt-12 text-center">
            <h2 className="font-display text-2xl md:text-3xl font-bold mb-3">
              Klaar voor uw 1-Pagina Groeiplan?
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto mb-6">
              In 60 minuten brengen we uw commerciële groeimotor terug naar
              één helder A4. Kies hieronder een moment in de agenda.
            </p>
          </div>

          <div className="rounded-2xl overflow-hidden border border-border bg-card">
            <iframe
              src={BOOKING_URL}
              title="Plan uw Groeiplan-sessie"
              className="w-full"
              style={{ minHeight: 720, border: 0 }}
            />
          </div>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Liever direct mailen? <a href="mailto:peter.grisel@rebelforce.nl" className="text-[#E8945A] hover:underline">peter.grisel@rebelforce.nl</a>
          </p>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default Demo;