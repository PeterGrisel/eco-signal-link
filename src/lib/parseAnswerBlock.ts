// Parser voor AI-answer blocks in markdown content.
// Detecteert een "## Kernantwoord" (of "## TL;DR" / "## Antwoord") sectie en
// optionele subsecties "Voor wie", "Wanneer", "Veelgemaakte fouten", "Stappen".

export interface AnswerBlock {
  answer: string;
  audience?: string;
  when?: string;
  mistakes?: string[];
  steps?: string[];
}

export interface AnswerParseResult {
  block: AnswerBlock | null;
  contentWithoutAnswer: string;
  faqs: { question: string; answer: string }[];
}

const ANSWER_HEADINGS = ["kernantwoord", "tl;dr", "tldr", "antwoord", "samenvatting"];
const SUB_LABELS: Record<keyof Omit<AnswerBlock, "answer">, string[]> = {
  audience: ["voor wie", "doelgroep"],
  when: ["wanneer", "wanneer gebruik je dit"],
  mistakes: ["veelgemaakte fouten", "fouten", "valkuilen"],
  steps: ["stappen", "stappenplan", "checklist", "concrete stappen"],
};

function matchesLabel(line: string, labels: string[]): boolean {
  const norm = line.trim().toLowerCase().replace(/^\*\*|\*\*$/g, "").replace(/[:：]$/, "").trim();
  return labels.includes(norm);
}

function extractList(lines: string[]): string[] {
  return lines
    .map((l) => l.trim())
    .filter((l) => /^[-*+]\s+/.test(l) || /^\d+\.\s+/.test(l))
    .map((l) => l.replace(/^[-*+]\s+/, "").replace(/^\d+\.\s+/, "").trim())
    .filter(Boolean);
}

export function parseAnswerBlock(markdown: string): AnswerParseResult {
  const lines = markdown.split("\n");
  let answerStart = -1;
  let answerHeadingLevel = 2;

  for (let i = 0; i < lines.length; i++) {
    const m = lines[i].match(/^(#{2,3})\s+(.+?)\s*$/);
    if (m) {
      const title = m[2].toLowerCase().trim();
      if (ANSWER_HEADINGS.some((h) => title === h || title.startsWith(h + " "))) {
        answerStart = i;
        answerHeadingLevel = m[1].length;
        break;
      }
    }
  }

  // FAQ extractie (altijd, los van answer block)
  const faqs = extractFaqs(lines);

  if (answerStart === -1) {
    return { block: null, contentWithoutAnswer: markdown, faqs };
  }

  // Vind eind van answer-sectie: volgende heading van hetzelfde of hoger niveau
  let answerEnd = lines.length;
  for (let i = answerStart + 1; i < lines.length; i++) {
    const m = lines[i].match(/^(#{1,6})\s+/);
    if (m && m[1].length <= answerHeadingLevel) {
      answerEnd = i;
      break;
    }
  }

  const section = lines.slice(answerStart + 1, answerEnd);

  // Eerste niet-lege paragraaf is het kernantwoord
  const block: AnswerBlock = { answer: "" };
  const answerLines: string[] = [];
  let idx = 0;
  while (idx < section.length && section[idx].trim() === "") idx++;
  while (idx < section.length) {
    const line = section[idx];
    if (line.trim() === "") break;
    // Stop als we een sublabel of bold-label tegenkomen
    if (/^\*\*[^*]+\*\*:?\s*$/.test(line.trim())) break;
    if (/^###\s+/.test(line)) break;
    answerLines.push(line);
    idx++;
  }
  block.answer = answerLines.join(" ").trim();

  // Parse sublabels
  let currentLabel: keyof Omit<AnswerBlock, "answer"> | null = null;
  let buffer: string[] = [];

  const flush = () => {
    if (!currentLabel || buffer.length === 0) return;
    if (currentLabel === "mistakes" || currentLabel === "steps") {
      const list = extractList(buffer);
      if (list.length) (block as any)[currentLabel] = list;
    } else {
      const text = buffer.join(" ").trim();
      if (text) (block as any)[currentLabel] = text;
    }
    buffer = [];
  };

  for (; idx < section.length; idx++) {
    const raw = section[idx];
    const trimmed = raw.trim();
    const labelMatch = trimmed.match(/^(?:###\s+|\*\*)([^*:]+?)(?:\*\*)?[:：]?\s*$/);
    if (labelMatch) {
      const label = labelMatch[1].toLowerCase().trim();
      const found = (Object.keys(SUB_LABELS) as Array<keyof typeof SUB_LABELS>)
        .find((k) => SUB_LABELS[k].includes(label));
      if (found) {
        flush();
        currentLabel = found;
        continue;
      }
    }
    if (currentLabel) buffer.push(raw);
  }
  flush();

  if (!block.answer) {
    return { block: null, contentWithoutAnswer: markdown, faqs };
  }

  const contentWithoutAnswer =
    lines.slice(0, answerStart).join("\n").trimEnd() +
    "\n\n" +
    lines.slice(answerEnd).join("\n").trimStart();

  return { block, contentWithoutAnswer: contentWithoutAnswer.trim(), faqs };
}

function extractFaqs(lines: string[]): { question: string; answer: string }[] {
  // Zoekt naar een "## FAQ" of "## Veelgestelde vragen" sectie en parseert ### vragen
  let faqStart = -1;
  let faqLevel = 2;
  for (let i = 0; i < lines.length; i++) {
    const m = lines[i].match(/^(#{2,3})\s+(.+?)\s*$/);
    if (m) {
      const title = m[2].toLowerCase().trim();
      if (
        title === "faq" ||
        title.startsWith("veelgestelde vragen") ||
        title.startsWith("vaak gestelde vragen")
      ) {
        faqStart = i;
        faqLevel = m[1].length;
        break;
      }
    }
  }
  if (faqStart === -1) return [];

  let faqEnd = lines.length;
  for (let i = faqStart + 1; i < lines.length; i++) {
    const m = lines[i].match(/^(#{1,6})\s+/);
    if (m && m[1].length <= faqLevel) {
      faqEnd = i;
      break;
    }
  }

  const out: { question: string; answer: string }[] = [];
  const section = lines.slice(faqStart + 1, faqEnd);
  let current: { question: string; answer: string } | null = null;
  for (const line of section) {
    const q = line.match(/^#{3,4}\s+(.+?)\s*\??\s*$/);
    if (q) {
      if (current && current.answer.trim()) out.push(current);
      current = { question: q[1].trim(), answer: "" };
    } else if (current && line.trim()) {
      current.answer += (current.answer ? " " : "") + line.trim();
    }
  }
  if (current && current.answer.trim()) out.push(current);
  return out;
}