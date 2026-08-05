import { Sparkles } from "lucide-react";
import type { AnswerBlock as AnswerBlockData } from "@/lib/parseAnswerBlock";

interface Props {
  block: AnswerBlockData;
}

// Render inline markdown links [text](url) as anchor tags. Other text is plain.
const renderInline = (text: string) => {
  const parts: (string | JSX.Element)[] = [];
  const re = /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let i = 0;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) parts.push(text.slice(last, m.index));
    const isInternal = /b2bgroeimachine\.io/.test(m[2]);
    parts.push(
      <a
        key={i++}
        href={m[2]}
        className="text-primary underline decoration-primary/40 hover:decoration-primary underline-offset-2"
        {...(isInternal ? {} : { target: "_blank", rel: "noopener noreferrer" })}
      >
        {m[1]}
      </a>
    );
    last = m.index + m[0].length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts.length ? parts : [text];
};

const AnswerBlock = ({ block }: Props) => {
  return (
    <aside
      className="not-prose mb-10 rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/10 via-secondary/40 to-secondary p-6 md:p-8"
      aria-label="Kernantwoord"
    >
      <div className="flex items-center gap-2 text-primary mb-3">
        <Sparkles className="w-4 h-4" />
        <span className="text-xs font-display font-semibold uppercase tracking-wider">
          Kernantwoord
        </span>
      </div>
      <p className="text-foreground text-base md:text-lg leading-relaxed font-medium">
        {renderInline(block.answer)}
      </p>

      {(block.audience || block.when) && (
        <div className="mt-5 grid sm:grid-cols-2 gap-4">
          {block.audience && (
            <div>
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
                Voor wie
              </div>
              <p className="text-sm text-foreground/90">{renderInline(block.audience)}</p>
            </div>
          )}
          {block.when && (
            <div>
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
                Wanneer
              </div>
              <p className="text-sm text-foreground/90">{renderInline(block.when)}</p>
            </div>
          )}
        </div>
      )}

      {block.mistakes && block.mistakes.length > 0 && (
        <div className="mt-5">
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
            Veelgemaakte fouten
          </div>
          <ul className="space-y-1.5">
            {block.mistakes.map((m, i) => (
              <li key={i} className="text-sm text-foreground/90 flex gap-2">
                <span className="text-primary mt-0.5">×</span>
                <span>{renderInline(m)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {block.steps && block.steps.length > 0 && (
        <div className="mt-5">
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
            Stappen
          </div>
          <ol className="space-y-1.5 list-decimal list-inside marker:text-primary marker:font-semibold">
            {block.steps.map((s, i) => (
              <li key={i} className="text-sm text-foreground/90">{renderInline(s)}</li>
            ))}
          </ol>
        </div>
      )}
    </aside>
  );
};

export default AnswerBlock;