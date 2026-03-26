import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { solutions } from "@/data/solutions";

// Map keywords in blog content to solution slugs
const keywordMap: Record<string, string[]> = {
  pipeline: ["voorspelbare-pipeline"],
  outbound: ["outbound-automatisering"],
  automatisering: ["outbound-automatisering"],
  automatiseren: ["outbound-automatisering"],
  recruitment: ["commercieel-talent"],
  talent: ["commercieel-talent"],
  data: ["data-gedreven-sales"],
  signalen: ["data-gedreven-sales", "gerichte-prospecting"],
  schaalbaar: ["schaalbaar-groeisysteem"],
  groei: ["schaalbaar-groeisysteem"],
  internationaal: ["internationaal-uitbreiden"],
  buitenland: ["internationaal-uitbreiden"],
  tools: ["versnipperde-tools"],
  crm: ["weg-uit-excel", "versnipperde-tools"],
  excel: ["weg-uit-excel"],
  spreadsheet: ["weg-uit-excel"],
  prospecting: ["gerichte-prospecting"],
  targeting: ["gerichte-prospecting"],
  hagel: ["gerichte-prospecting"],
};

function getRelatedSolutions(content: string, title: string, max = 3) {
  const text = `${title} ${content}`.toLowerCase();
  const slugScores: Record<string, number> = {};

  for (const [keyword, slugs] of Object.entries(keywordMap)) {
    const regex = new RegExp(keyword, "gi");
    const matches = text.match(regex);
    if (matches) {
      for (const slug of slugs) {
        slugScores[slug] = (slugScores[slug] || 0) + matches.length;
      }
    }
  }

  const sorted = Object.entries(slugScores)
    .sort((a, b) => b[1] - a[1])
    .slice(0, max)
    .map(([slug]) => slug);

  // If less than 2 matches, fill with defaults
  if (sorted.length < 2) {
    const defaults = ["voorspelbare-pipeline", "outbound-automatisering", "data-gedreven-sales"];
    for (const d of defaults) {
      if (!sorted.includes(d) && sorted.length < max) sorted.push(d);
    }
  }

  return sorted
    .map((slug) => solutions.find((s) => s.slug === slug))
    .filter(Boolean);
}

interface RelatedSolutionsProps {
  content: string;
  title: string;
}

const RelatedSolutions = ({ content, title }: RelatedSolutionsProps) => {
  const related = getRelatedSolutions(content, title);

  if (related.length === 0) return null;

  return (
    <div className="mt-12 p-6 rounded-xl border border-border bg-secondary/30">
      <h3 className="font-display font-bold text-lg text-foreground mb-4">
        Gerelateerde oplossingen
      </h3>
      <div className="space-y-3">
        {related.map((sol) => (
          <Link
            key={sol!.slug}
            to={`/solutions/${sol!.slug}`}
            className="flex items-center justify-between gap-3 p-3 rounded-lg hover:bg-secondary transition-colors group"
          >
            <div>
              <p className="font-display font-semibold text-foreground group-hover:text-primary transition-colors">
                {sol!.title}
              </p>
              <p className="text-sm text-muted-foreground">{sol!.description}</p>
            </div>
            <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary shrink-0 transition-colors" />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RelatedSolutions;
