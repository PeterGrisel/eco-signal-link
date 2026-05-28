import ChapterFrame from "../ChapterFrame";
import PipelineValueCalculator from "@/components/pipeline/PipelineValueCalculator";

export default function Chapter07Schaal() {
  return (
    <ChapterFrame
      id="chapter-07"
      number="07"
      eyebrow="Schaal in cijfers"
      title={<>Een voorbeeld: van markt naar <span className="text-primary">€500k pipeline.</span></>}
      intro="Stel u richt zich op 2.000 bedrijven binnen uw ICP. Zo loopt het door uw funnel. Stap voor stap, niet gegokt."
      tone="warm"
    >
      <PipelineValueCalculator />
    </ChapterFrame>
  );
}
