import { ReactNode } from "react";

export type GiveawayPayload = Record<string, any>;

interface Props {
  layout: string;
  payload: GiveawayPayload;
}

const Kicker = ({ children }: { children: ReactNode }) => (
  <div className="flex items-center gap-2.5 mb-3">
    <span className="block w-[18px] h-px bg-[#E8945A]" />
    <span className="uppercase tracking-[0.12em] text-[11px] text-[#E8945A] font-semibold font-display">
      {children}
    </span>
  </div>
);

export const GiveawayRenderer = ({ layout, payload }: Props) => {
  if (layout === "scorecard") {
    const rows = payload.scoreRows || [];
    const bands = payload.scoreBands || [];
    return (
      <div>
        <div className="flex justify-between uppercase tracking-[0.1em] text-[11px] text-[#998D7D] font-semibold font-display pb-2 border-b border-[#2E2E2E]">
          <span>{payload.scoreRowLabel || "Stelling"}</span>
          <span>{payload.scoreColLabel || "Score"}</span>
        </div>
        <div className="flex flex-col">
          {rows.map((row: any, i: number) => (
            <div key={i} className="flex justify-between items-center gap-4 py-3 border-b border-[#242424]">
              <span className="text-[14.5px] text-[#EEEAE4]">{row.label}</span>
              <div className="min-w-[80px] h-8 border border-[#2E2E2E] rounded-md flex items-center justify-center font-mono text-sm text-[#E8945A] shrink-0">
                {row.right || ""}
              </div>
            </div>
          ))}
        </div>
        {bands.length > 0 && (
          <>
            <div className="mt-6 mb-2">
              <Kicker>Interpretatie</Kicker>
            </div>
            <div className="flex flex-col gap-2.5">
              {bands.map((band: string, i: number) => (
                <div key={i} className="flex gap-2.5 items-start">
                  <span className="block w-[7px] h-[7px] bg-[#E8945A] rounded-sm mt-1.5 shrink-0" />
                  <span className="text-sm text-[#B8AEA1] leading-relaxed">{band}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    );
  }

  if (layout === "canvas") {
    const variant = payload.canvasLayout || "columns";
    if (variant === "matrix") {
      const cells = [payload.mtTL, payload.mtTR, payload.mtBL, payload.mtBR];
      return (
        <div>
          <div className="grid grid-cols-2 gap-2.5">
            {cells.map((c: any, i: number) => (
              <div key={i} className="border border-[#2E2E2E] rounded-lg bg-[#161616] p-3.5 min-h-[120px]">
                <div className="font-display font-semibold text-[13px] text-[#EEEAE4]">{c?.label}</div>
                <div className="text-[12px] text-[#998D7D] mt-1 leading-relaxed">{c?.hint}</div>
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-3 text-[10px] uppercase tracking-[0.12em] text-[#998D7D] font-display font-semibold">
            <span>Y-as: {payload.axisY}</span>
            <span>X-as: {payload.axisX}</span>
          </div>
        </div>
      );
    }
    const blocks = payload.canvasBlocks || [];
    const cls = variant === "grid"
      ? "grid grid-cols-2 md:grid-cols-3 gap-2.5"
      : "flex flex-col md:flex-row gap-2.5";
    return (
      <div className={cls}>
        {blocks.map((b: any, i: number) => (
          <div key={i} className="flex-1 border border-[#2E2E2E] rounded-lg bg-[#161616] p-3.5 flex flex-col min-h-[150px]">
            <div className="font-display font-semibold text-[13px] text-[#EEEAE4] leading-snug">{b.label}</div>
            <div className="text-[12px] text-[#998D7D] mt-1.5 leading-relaxed">{b.hint}</div>
            <div className="mt-auto h-12 border-t border-dashed border-[#2E2E2E] mt-3" />
          </div>
        ))}
      </div>
    );
  }

  if (layout === "worksheet") {
    const prompts = payload.prompts || [];
    return (
      <div className="flex flex-col gap-3.5">
        {prompts.map((p: string, i: number) => (
          <div key={i} className="border border-[#2E2E2E] rounded-lg p-4 bg-[#161616]">
            <div className="font-display font-semibold text-[13.5px] text-[#EEEAE4] mb-2">{i + 1}. {p}</div>
            <div className="h-12 border-t border-dashed border-[#2E2E2E]" />
          </div>
        ))}
      </div>
    );
  }

  if (layout === "checklist") {
    const groups = payload.groups || [];
    return (
      <div className="flex flex-col gap-5">
        {groups.map((g: any, gi: number) => (
          <div key={gi}>
            <Kicker>{g.heading}</Kicker>
            <div className="flex flex-col">
              {(g.items || []).map((it: string, ii: number) => (
                <div key={ii} className="flex gap-3 items-center py-2 border-b border-[#242424]">
                  <span className="w-5 h-5 border-[1.5px] border-[#3a3a3a] rounded-md shrink-0" />
                  <span className="text-[14.5px] text-[#EEEAE4]">{it}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (layout === "framework") {
    const variant = payload.frameVariant || "flow";
    if (variant === "funnel") {
      const steps = payload.steps || [];
      const widths = ["100%", "88%", "76%", "64%", "52%", "40%"];
      return (
        <div className="flex flex-col gap-2.5 items-center">
          {steps.map((s: any, i: number) => (
            <div
              key={i}
              style={{ width: widths[i] || "40%" }}
              className="rounded-lg p-3.5 text-center font-display font-semibold text-sm text-[#1A120B]"
            >
              <div style={{ background: "linear-gradient(135deg,#EA8A4A,#F0A968)", borderRadius: 8, padding: 14 }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>
      );
    }
    return (
      <div>
        <div className="flex flex-col gap-3">
          {(payload.steps || []).map((s: any, i: number) => (
            <div key={i} className="flex gap-3.5 items-start">
              <div className="w-[34px] h-[34px] rounded-full border border-[#E8945A] text-[#E8945A] flex items-center justify-center font-mono text-[13px] shrink-0">
                {i + 1}
              </div>
              <div className="pt-1">
                <div className="font-display font-semibold text-[15px] text-[#EEEAE4]">{s.label}</div>
                {s.desc && (
                  <div className="text-[13.5px] text-[#998D7D] mt-1 leading-relaxed">{s.desc}</div>
                )}
              </div>
            </div>
          ))}
        </div>
        {payload.conclusion && (
          <div className="mt-4 border border-[#E8945A]/30 bg-[#E8945A]/10 rounded-lg px-4 py-3 text-[#E8945A] font-display font-semibold text-sm">
            → {payload.conclusion}
          </div>
        )}
      </div>
    );
  }

  if (layout === "playbook") {
    const plays = payload.plays || [];
    return (
      <div className="flex flex-col gap-2.5">
        {plays.map((p: any, i: number) => (
          <div key={i} className="flex flex-col md:flex-row gap-3.5 p-3.5 border border-[#2E2E2E] rounded-lg bg-[#161616]">
            <span className="md:w-[152px] shrink-0 font-mono text-[10.5px] text-[#E8945A] bg-[#E8945A]/10 border border-[#E8945A]/30 rounded-md px-2 py-1.5 leading-snug self-start">
              {p.trigger}
            </span>
            <span className="text-sm text-[#D8D0C6] leading-relaxed">{p.move}</span>
          </div>
        ))}
      </div>
    );
  }

  return <div className="text-[#998D7D] text-sm">Onbekend layout-type: {layout}</div>;
};

export default GiveawayRenderer;