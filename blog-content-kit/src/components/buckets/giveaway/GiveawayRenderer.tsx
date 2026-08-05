import { ReactNode, useMemo, useState, useEffect, useRef } from "react";

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

/** ContentEditable veld dat groeit en mee-print. */
const Editable = ({
  placeholder,
  minHeight = 56,
  className = "",
}: {
  placeholder: string;
  minHeight?: number;
  className?: string;
}) => (
  <div
    contentEditable
    suppressContentEditableWarning
    data-placeholder={placeholder}
    className={`gw-edit text-[14px] leading-relaxed border border-dashed border-[#2E2E2E] rounded-md px-3 py-2 bg-[#121212]/40 ${className}`}
    style={{ minHeight }}
  />
);

const parseBandRange = (band: string): { min: number; max: number; label: string } | null => {
  // matches "0-10:", "0 - 10 :", "10–20:" etc, or "<5:" / ">20:"
  const m1 = band.match(/^\s*(\d+)\s*[-–]\s*(\d+)\s*[:.\-]/);
  if (m1) return { min: +m1[1], max: +m1[2], label: band };
  const m2 = band.match(/^\s*[<≤]\s*(\d+)/);
  if (m2) return { min: -Infinity, max: +m2[1], label: band };
  const m3 = band.match(/^\s*[>≥]\s*(\d+)/);
  if (m3) return { min: +m3[1], max: Infinity, label: band };
  return null;
};

export const GiveawayRenderer = ({ layout, payload }: Props) => {
  if (layout === "scorecard") {
    const rows = payload.scoreRows || [];
    const bands = payload.scoreBands || [];
    const max = Number(payload.scoreMax) || 5;
    const [values, setValues] = useState<Record<number, number | "">>({});
    const total = useMemo(
      () => Object.values(values).reduce<number>((a, v) => a + (typeof v === "number" ? v : 0), 0),
      [values],
    );
    const activeBandIdx = useMemo(() => {
      const parsed = bands.map(parseBandRange);
      return parsed.findIndex((p: any) => p && total >= p.min && total <= p.max);
    }, [total, bands]);
    return (
      <div>
        <div className="flex justify-between uppercase tracking-[0.1em] text-[11px] text-[#998D7D] font-semibold font-display pb-2 border-b border-[#2E2E2E]">
          <span>{payload.scoreRowLabel || "Stelling"}</span>
          <span>{payload.scoreColLabel || `Score (0-${max})`}</span>
        </div>
        <div className="flex flex-col">
          {rows.map((row: any, i: number) => (
            <div key={i} className="flex justify-between items-center gap-4 py-3 border-b border-[#242424]">
              <span className="text-[14.5px] text-[#EEEAE4]">{row.label}</span>
              <input
                type="number"
                min={0}
                max={max}
                inputMode="numeric"
                placeholder={row.right || "0"}
                value={values[i] ?? ""}
                onChange={(e) => {
                  const raw = e.target.value;
                  if (raw === "") return setValues((s) => ({ ...s, [i]: "" }));
                  const n = Math.max(0, Math.min(max, Number(raw)));
                  setValues((s) => ({ ...s, [i]: n }));
                }}
                className="gw-input shrink-0"
              />
            </div>
          ))}
        </div>
        <div className="mt-5 flex items-center justify-between border border-[#E8945A]/30 bg-[#E8945A]/10 rounded-md px-4 py-3">
          <span className="uppercase tracking-[0.12em] text-[11px] text-[#E8945A] font-display font-semibold">
            Jouw score
          </span>
          <span className="font-mono text-[#E8945A] text-lg">
            {total} <span className="opacity-60 text-sm">/ {rows.length * max}</span>
          </span>
        </div>
        {bands.length > 0 && (
          <>
            <div className="mt-6 mb-2">
              <Kicker>Interpretatie</Kicker>
            </div>
            <div className="flex flex-col gap-2.5">
              {bands.map((band: string, i: number) => {
                const active = i === activeBandIdx;
                return (
                  <div
                    key={i}
                    className={`flex gap-2.5 items-start rounded-md px-2 py-1.5 transition-colors ${
                      active ? "bg-[#E8945A]/15 ring-1 ring-[#E8945A]/40" : ""
                    }`}
                  >
                    <span
                      className={`block w-[7px] h-[7px] rounded-sm mt-1.5 shrink-0 ${
                        active ? "bg-[#E8945A]" : "bg-[#E8945A]/40"
                      }`}
                    />
                    <span className={`text-sm leading-relaxed ${active ? "text-[#EEEAE4]" : "text-[#B8AEA1]"}`}>
                      {band}
                    </span>
                  </div>
                );
              })}
            </div>
          </>
        )}
        <div className="mt-5">
          <Kicker>Notities</Kicker>
          <Editable placeholder="Wat valt op? Welke score wil je over 90 dagen halen?" minHeight={84} />
        </div>
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
                <Editable placeholder="Jouw input…" minHeight={64} className="mt-2" />
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
            <Editable placeholder="Jouw input…" minHeight={70} className="mt-3" />
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
            <Editable placeholder="Schrijf hier je antwoord…" minHeight={72} />
          </div>
        ))}
      </div>
    );
  }

  if (layout === "checklist") {
    const groups = payload.groups || [];
    const allItems = useMemo(
      () => groups.flatMap((g: any, gi: number) => (g.items || []).map((_: any, ii: number) => `${gi}-${ii}`)),
      [groups],
    );
    const [checked, setChecked] = useState<Record<string, boolean>>({});
    const doneCount = Object.values(checked).filter(Boolean).length;
    return (
      <div className="flex flex-col gap-5">
        <div className="flex items-center justify-between border border-[#E8945A]/30 bg-[#E8945A]/10 rounded-md px-4 py-2.5">
          <span className="uppercase tracking-[0.12em] text-[11px] text-[#E8945A] font-display font-semibold">
            Voortgang
          </span>
          <span className="font-mono text-[#E8945A] text-sm">
            {doneCount} / {allItems.length}
          </span>
        </div>
        {groups.map((g: any, gi: number) => (
          <div key={gi}>
            <Kicker>{g.heading}</Kicker>
            <div className="flex flex-col">
              {(g.items || []).map((it: string, ii: number) => (
                <label key={ii} className="flex gap-3 items-center py-2 border-b border-[#242424] cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-[18px] h-[18px] accent-[#E8945A] shrink-0"
                    checked={!!checked[`${gi}-${ii}`]}
                    onChange={(e) => setChecked((s) => ({ ...s, [`${gi}-${ii}`]: e.target.checked }))}
                  />
                  <span
                    className={`text-[14.5px] ${
                      checked[`${gi}-${ii}`] ? "text-[#998D7D] line-through" : "text-[#EEEAE4]"
                    }`}
                  >
                    {it}
                  </span>
                </label>
              ))}
            </div>
          </div>
        ))}
        <div>
          <Kicker>Notities</Kicker>
          <Editable placeholder="Acties, blockers, eigenaar…" minHeight={80} />
        </div>
      </div>
    );
  }

  if (layout === "framework") {
    const variant = payload.frameVariant || "flow";
    if (variant === "funnel") {
      const steps = payload.steps || [];
      const widths = ["100%", "88%", "76%", "64%", "52%", "40%"];
      return (
        <div>
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
          <div className="mt-5">
            <Kicker>Jouw cijfers per fase</Kicker>
            <Editable placeholder="Bv. 5000 → 800 → 120 → 18 → 4 deals" minHeight={80} />
          </div>
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
              <div className="pt-1 flex-1 min-w-0">
                <div className="font-display font-semibold text-[15px] text-[#EEEAE4]">{s.label}</div>
                {s.desc && (
                  <div className="text-[13.5px] text-[#998D7D] mt-1 leading-relaxed">{s.desc}</div>
                )}
                <Editable placeholder="Jouw invulling…" minHeight={56} className="mt-2" />
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
            <div className="flex-1 min-w-0">
              <span className="text-sm text-[#D8D0C6] leading-relaxed block">{p.move}</span>
              <Editable placeholder="Eigenaar, deadline, eigen variant…" minHeight={48} className="mt-2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return <div className="text-[#998D7D] text-sm">Onbekend layout-type: {layout}</div>;
};

export default GiveawayRenderer;