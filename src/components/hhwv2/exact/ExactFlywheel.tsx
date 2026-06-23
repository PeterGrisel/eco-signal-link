import { motion } from "framer-motion";

const SEGMENTS = [
  {
    key: "content",
    label: "Content",
    color: "hsl(var(--funnel-awareness))",
    note: "Content bouwt autoriteit die zich opstapelt.",
    notePos: "left-0 top-1/3",
    startAngle: -90,
    endAngle: 30,
  },
  {
    key: "outbound",
    label: "Outbound",
    color: "hsl(var(--funnel-engagement))",
    note: "Outbound levert direct pipeline op.",
    notePos: "right-0 top-1/2",
    startAngle: 30,
    endAngle: 150,
  },
  {
    key: "signaal",
    label: "Signalen",
    color: "hsl(var(--funnel-sales))",
    note: "Signalen warmen koude prospects op.",
    notePos: "bottom-0 left-1/2 -translate-x-1/2",
    startAngle: 150,
    endAngle: 270,
  },
];

// Build an SVG arc path (donut segment) between two angles
const arcPath = (
  cx: number,
  cy: number,
  rOuter: number,
  rInner: number,
  startDeg: number,
  endDeg: number,
) => {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const sweep = endDeg - startDeg;
  const largeArc = sweep > 180 ? 1 : 0;

  const x1 = cx + rOuter * Math.cos(toRad(startDeg));
  const y1 = cy + rOuter * Math.sin(toRad(startDeg));
  const x2 = cx + rOuter * Math.cos(toRad(endDeg));
  const y2 = cy + rOuter * Math.sin(toRad(endDeg));

  const x3 = cx + rInner * Math.cos(toRad(endDeg));
  const y3 = cy + rInner * Math.sin(toRad(endDeg));
  const x4 = cx + rInner * Math.cos(toRad(startDeg));
  const y4 = cy + rInner * Math.sin(toRad(startDeg));

  return [
    `M ${x1} ${y1}`,
    `A ${rOuter} ${rOuter} 0 ${largeArc} 1 ${x2} ${y2}`,
    `L ${x3} ${y3}`,
    `A ${rInner} ${rInner} 0 ${largeArc} 0 ${x4} ${y4}`,
    "Z",
  ].join(" ");
};

// Compute label position along the arc midpoint at a given radius
const labelPos = (cx: number, cy: number, r: number, startDeg: number, endDeg: number) => {
  const mid = (startDeg + endDeg) / 2;
  const rad = (mid * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad), angle: mid };
};

const ExactFlywheel = () => {
  const size = 420;
  const cx = size / 2;
  const cy = size / 2;
  const rOuter = 180;
  const rInner = 110;
  const rLabel = (rOuter + rInner) / 2;

  return (
    <section className="relative py-20 md:py-28 border-t border-primary/10">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-2xl mx-auto mb-12 md:mb-16">
          <p className="text-primary font-display font-semibold text-[11px] tracking-[0.22em] uppercase mb-3">
            Het vliegwiel
          </p>
          <h2 className="font-display font-bold text-3xl md:text-4xl lg:text-5xl tracking-tight mb-4">
            Eén <span className="font-serif italic text-gradient">vliegwiel</span>, steeds meer pipeline
          </h2>
          <p className="text-muted-foreground text-base md:text-lg">
            Elke gesloten deal voedt de volgende cyclus. Content, outbound en signalen versterken elkaar.
          </p>
        </div>

        <div className="relative mx-auto" style={{ maxWidth: 900 }}>
          <div className="grid lg:grid-cols-[1fr_auto_1fr] items-center gap-6 md:gap-10">
            {/* Left note */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5 }}
              className="rounded-xl border border-primary/20 card-gradient p-5 max-w-xs lg:ml-auto"
            >
              <span
                className="inline-block h-2 w-2 rounded-full mb-2"
                style={{ background: "hsl(var(--funnel-awareness))" }}
              />
              <p className="font-display font-semibold text-sm text-foreground leading-snug">
                Content bouwt autoriteit die zich opstapelt.
              </p>
            </motion.div>

            {/* Wheel */}
            <motion.div
              initial={{ opacity: 0, scale: 0.94 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7 }}
              className="relative mx-auto"
              style={{ width: size, height: size }}
            >
              <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
                <defs>
                  {SEGMENTS.map((s) => (
                    <radialGradient key={s.key} id={`grad-${s.key}`} cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor={s.color} stopOpacity="0.85" />
                      <stop offset="100%" stopColor={s.color} stopOpacity="0.55" />
                    </radialGradient>
                  ))}
                </defs>

                {/* Outer dashed ring */}
                <circle
                  cx={cx}
                  cy={cy}
                  r={rOuter + 14}
                  fill="none"
                  stroke="hsl(var(--primary) / 0.4)"
                  strokeWidth="1.5"
                  strokeDasharray="4 6"
                />

                {/* Segments */}
                {SEGMENTS.map((s) => (
                  <path
                    key={s.key}
                    d={arcPath(cx, cy, rOuter, rInner, s.startAngle, s.endAngle)}
                    fill={`url(#grad-${s.key})`}
                    stroke="hsl(var(--background))"
                    strokeWidth="3"
                  />
                ))}

                {/* Curved labels along arcs */}
                {SEGMENTS.map((s) => {
                  const pos = labelPos(cx, cy, rLabel, s.startAngle, s.endAngle);
                  // Rotate text so it follows the arc tangent (perpendicular to radius)
                  let rotate = pos.angle + 90;
                  if (rotate > 90 && rotate < 270) rotate -= 180;
                  return (
                    <text
                      key={`label-${s.key}`}
                      x={pos.x}
                      y={pos.y}
                      transform={`rotate(${rotate} ${pos.x} ${pos.y})`}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="font-display font-bold"
                      fill="hsl(var(--background))"
                      style={{ fontSize: 18, letterSpacing: "0.04em" }}
                    >
                      {s.label}
                    </text>
                  );
                })}

                {/* Inner hub */}
                <circle
                  cx={cx}
                  cy={cy}
                  r={rInner - 6}
                  fill="hsl(var(--background))"
                  stroke="hsl(var(--primary) / 0.25)"
                  strokeWidth="1"
                />
              </svg>

              {/* Center text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-8 pointer-events-none">
                <p className="text-[10px] font-display font-semibold tracking-[0.22em] uppercase text-primary mb-1">
                  GTM Vliegwiel
                </p>
                <p className="font-display font-bold text-base text-foreground leading-tight">
                  Elke deal voedt
                  <br />
                  de volgende cyclus
                </p>
              </div>
            </motion.div>

            {/* Right notes */}
            <div className="flex flex-col gap-4 max-w-xs lg:mr-auto">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="rounded-xl border border-primary/20 card-gradient p-5"
              >
                <span
                  className="inline-block h-2 w-2 rounded-full mb-2"
                  style={{ background: "hsl(var(--funnel-engagement))" }}
                />
                <p className="font-display font-semibold text-sm text-foreground leading-snug">
                  Outbound levert direct pipeline op.
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="rounded-xl border border-primary/20 card-gradient p-5"
              >
                <span
                  className="inline-block h-2 w-2 rounded-full mb-2"
                  style={{ background: "hsl(var(--funnel-sales))" }}
                />
                <p className="font-display font-semibold text-sm text-foreground leading-snug">
                  Signalen warmen koude prospects op.
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExactFlywheel;