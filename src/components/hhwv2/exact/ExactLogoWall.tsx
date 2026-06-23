import InfiniteSlider from "../ui/InfiniteSlider";
import stelzLogo from "@/assets/stelz-logo.png.asset.json";
import sealecoLogo from "@/assets/sealeco-logo.png.asset.json";
import shotsLogo from "@/assets/shots-logo.png.asset.json";
import hegoLogo from "@/assets/hego-logo.png.asset.json";
import klingeleLogo from "@/assets/klingele24-logo.png.asset.json";

const CLIENTS = [
  { name: "Stelz", src: stelzLogo.url },
  { name: "SealEco", src: sealecoLogo.url },
  { name: "Shots", src: shotsLogo.url },
  { name: "HEGO", src: hegoLogo.url },
  { name: "Klingele 24", src: klingeleLogo.url },
];

const ExactLogoWall = () => (
  <section className="py-10 md:py-14 border-y border-primary/10 bg-card/20">
    <div className="container mx-auto px-4 md:px-6">
      <p className="text-center text-[11px] font-display font-semibold tracking-[0.28em] uppercase text-muted-foreground mb-7">
        Vertrouwd door ambitieuze B2B teams
      </p>
      <InfiniteSlider
        speed={45}
        items={[...CLIENTS, ...CLIENTS].map((c, i) => (
          <span
            key={`${c.name}-${i}`}
            className="inline-flex items-center px-8 md:px-10 h-10 md:h-12"
          >
            <img
              src={c.src}
              alt={c.name}
              loading="lazy"
              className="h-full w-auto object-contain opacity-70 hover:opacity-100 transition-opacity"
              style={{ filter: "grayscale(100%) brightness(1.6) contrast(0.9)" }}
            />
          </span>
        ))}
      />
    </div>
  </section>
);

export default ExactLogoWall;