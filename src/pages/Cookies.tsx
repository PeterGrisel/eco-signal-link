import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { usePageMeta } from "@/hooks/usePageMeta";

const Cookies = () => {
  usePageMeta({
    title: "Cookieverklaring | B2BGroeiMachine",
    description: "Lees onze cookieverklaring en ontdek welke cookies B2BGroeiMachine gebruikt en hoe je ze kunt beheren.",
  });

  return (
    <>
      <Navbar />
      <main className="pt-16">
        <article className="py-16 md:py-24">
          <div className="container mx-auto px-4 md:px-6 max-w-3xl prose prose-invert prose-sm md:prose-base">
            <h1 className="font-display">Cookieverklaring</h1>

            <h2>1. Het gebruik van cookies</h2>
            <p><a href="https://www.rebelforce.nl/">www.rebelforce.nl</a> maakt gebruik van cookies. Een cookie is een eenvoudig klein bestandje dat met pagina's van deze website wordt meegestuurd en door je browser op je harde schijf wordt opgeslagen. De daarin opgeslagen informatie kan bij een volgend bezoek weer naar onze servers teruggestuurd worden.</p>
            <p>Het gebruik van cookies is van groot belang voor het goed laten draaien van onze website. Dankzij de (anonieme) input van bezoekers kunnen we het gebruik van de website verbeteren en deze gebruiksvriendelijker maken.</p>

            <h2>2. Toestemming voor het gebruik van cookies</h2>
            <p>Voor het gebruik van bepaalde cookies is jouw toestemming vereist.</p>

            <h2>3. Type cookies en hun doelstellingen</h2>
            <p>Wij gebruiken de volgende type cookies:</p>
            <ul>
              <li><strong>Functionele cookies:</strong> hiermee kunnen we de website beter laten functioneren en is die gebruiksvriendelijker voor de bezoeker. Bijvoorbeeld: we slaan je inloggegevens op of wat je in je winkelmandje hebt gestopt.</li>
              <li><strong>Analytische cookies:</strong> deze zorgen ervoor dat iedere keer wanneer je een website bezoekt er een cookie wordt gegenereerd. Deze cookie dient enkel voor statistische doeleinden. Zo kunnen daarmee de volgende data verzameld worden:
                <ul>
                  <li>welke pagina's je hebt bekeken</li>
                  <li>hoelang je op een bepaalde pagina bent gebleven</li>
                  <li>bij welke pagina je de site hebt verlaten</li>
                </ul>
              </li>
            </ul>

            <h2>4. Je rechten met betrekking tot je gegevens</h2>
            <p>Je hebt het recht op inzage, rectificatie, beperking en verwijdering van persoonsgegevens. Daarnaast heb je recht van bezwaar tegen verwerking en recht op gegevensoverdraagbaarheid. Je kunt deze rechten uitoefenen door ons een mail te sturen via <a href="mailto:info@rebelforce.nl">info@rebelforce.nl</a>.</p>

            <h2>5. Cookies blokkeren en verwijderen</h2>
            <p>Je kunt cookies te allen tijde eenvoudig zelf blokkeren en verwijderen via je internetbrowser. Als je de cookies in je browser verwijdert, kan dat gevolgen hebben voor het prettige gebruik van deze website.</p>
            <p>Sommige tracking cookies worden geplaatst door derden. Deze cookies kan je centraal verwijderen via <a href="https://youronlinechoices.com/" target="_blank" rel="noopener noreferrer">youronlinechoices.com</a>.</p>
            <p>Hoe je je instellingen kunt aanpassen, verschilt per browser:</p>
            <ul>
              <li><a href="https://support.mozilla.org/nl/kb/cookies-verwijderen-gegevens-wissen-websites-opgeslagen" target="_blank" rel="noopener noreferrer">Firefox</a></li>
              <li><a href="https://support.google.com/chrome/answer/95647?co=GENIE.Platform=Desktop&hl=nl" target="_blank" rel="noopener noreferrer">Google Chrome</a></li>
              <li><a href="https://support.microsoft.com/nl-nl/kb/278835" target="_blank" rel="noopener noreferrer">Internet Explorer</a></li>
              <li><a href="https://support.apple.com/nl-nl/HT201265" target="_blank" rel="noopener noreferrer">Safari op smartphone</a></li>
              <li><a href="https://support.apple.com/nl-be/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer">Safari op Mac</a></li>
            </ul>

            <h2>6. Nieuwe ontwikkelingen en onvoorziene cookies</h2>
            <p>De teksten van onze website kunnen op ieder moment worden aangepast door voortdurende ontwikkelingen. Dit geldt ook voor onze cookieverklaring. Neem deze verklaring daarom regelmatig door om op de hoogte te blijven van eventuele wijzigingen.</p>
            <p>In blogartikelen kan gebruik worden gemaakt van embedded content (zoals YouTube video's). Deze codes maken vaak gebruik van cookies. Wij hebben echter geen controle op wat deze derde partijen met hun cookies doen.</p>
            <p>Kom je op onze website onvoorziene cookies tegen? Laat het ons weten via <a href="mailto:info@rebelforce.nl">info@rebelforce.nl</a>.</p>

            <h2>7. Slotopmerkingen</h2>
            <p>Wij zullen deze verklaringen af en toe aan moeten passen, bijvoorbeeld wanneer we onze website aanpassen of de regels rondom cookies wijzigen. Mocht je nog vragen en/of opmerkingen hebben neem dan contact op met <a href="mailto:info@rebelforce.nl">info@rebelforce.nl</a>.</p>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
};

export default Cookies;
