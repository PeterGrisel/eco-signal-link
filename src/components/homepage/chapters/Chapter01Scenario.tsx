import ChapterFrame from "../ChapterFrame";
import ScenarioSideScroller from "../ScenarioSideScroller";

export default function Chapter01Scenario() {
  return (
    <ChapterFrame
      id="chapter-01" number="01"
      eyebrow="Het herkenbare scenario"
      title={<>U wacht op een lancering. <span className="text-primary">De markt geeft al signalen af.</span></>}
      intro="Veel prospects zoeken niet actief. Ze laten verspreid, indirect en vaak kleine signalen zien over tientallen kanalen. De kracht zit in het herkennen, combineren en wegen van die signalen."
      closing={<>Niet alleen activiteit vastleggen. <span className="text-primary">Eerst context vastleggen.</span></>}
      tone="cool"
    >
      <ScenarioSideScroller />
    </ChapterFrame>
  );
}