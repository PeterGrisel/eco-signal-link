import InfographicProcessFlow from "./InfographicProcessFlow";
import InfographicComparison from "./InfographicComparison";
import InfographicStats from "./InfographicStats";
import InfographicLayers from "./InfographicLayers";

/**
 * Parses infographic code blocks from markdown content.
 * 
 * Convention: Use fenced code blocks with language tags:
 *   ```infographic-process  (process flow diagram)
 *   ```infographic-compare  (side-by-side comparison)
 *   ```infographic-stats    (key metrics/stats)
 *   ```infographic-layers   (layered architecture)
 * 
 * The content inside must be valid JSON matching the component props.
 */

type InfographicType = "process" | "compare" | "stats" | "layers";

interface InfographicBlock {
  type: InfographicType;
  data: any;
  placeholder: string;
}

const INFOGRAPHIC_REGEX = /```infographic-(process|compare|stats|layers)\s*\n([\s\S]*?)```/g;

export function extractInfographics(content: string): {
  cleanContent: string;
  infographics: Map<string, InfographicBlock>;
} {
  const infographics = new Map<string, InfographicBlock>();
  let idx = 0;

  const cleanContent = content.replace(INFOGRAPHIC_REGEX, (match, type, jsonStr) => {
    try {
      const data = JSON.parse(jsonStr.trim());
      const placeholder = `%%INFOGRAPHIC_${idx}%%`;
      infographics.set(placeholder, { type, data, placeholder });
      idx++;
      return placeholder;
    } catch (e) {
      console.warn("Failed to parse infographic JSON:", e);
      return match; // keep original if JSON is invalid
    }
  });

  return { cleanContent, infographics };
}

export function renderInfographic(block: InfographicBlock): React.ReactNode {
  switch (block.type) {
    case "process":
      return <InfographicProcessFlow {...block.data} />;
    case "compare":
      return <InfographicComparison {...block.data} />;
    case "stats":
      return <InfographicStats {...block.data} />;
    case "layers":
      return <InfographicLayers {...block.data} />;
    default:
      return null;
  }
}

export function splitContentWithInfographics(
  content: string
): Array<{ type: "markdown"; content: string } | { type: "infographic"; block: InfographicBlock }> {
  const { cleanContent, infographics } = extractInfographics(content);
  
  if (infographics.size === 0) {
    return [{ type: "markdown", content }];
  }

  const parts: Array<{ type: "markdown"; content: string } | { type: "infographic"; block: InfographicBlock }> = [];
  
  // Split by placeholders
  const placeholderPattern = /%%INFOGRAPHIC_\d+%%/g;
  let lastIndex = 0;
  let match;

  while ((match = placeholderPattern.exec(cleanContent)) !== null) {
    // Add markdown before this placeholder
    if (match.index > lastIndex) {
      const md = cleanContent.slice(lastIndex, match.index).trim();
      if (md) parts.push({ type: "markdown", content: md });
    }

    // Add infographic
    const block = infographics.get(match[0]);
    if (block) {
      parts.push({ type: "infographic", block });
    }

    lastIndex = match.index + match[0].length;
  }

  // Add remaining markdown
  if (lastIndex < cleanContent.length) {
    const md = cleanContent.slice(lastIndex).trim();
    if (md) parts.push({ type: "markdown", content: md });
  }

  return parts;
}
