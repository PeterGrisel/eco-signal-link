import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { useFlowTimeline, primePath, pointOnPath } from "@/hooks/useFlowTimeline";

/**
 * Wraps a horizontal row of cards/steps and draws an animated wire
 * connecting them by measuring DOM positions of children with the `.cf-node` class.
 */
interface Props {
  children: React.ReactNode;
  className?: string;
  /** css class added to children that should be connected, default `.cf-node` */
  selector?: string;
}

const ConnectorFlow = ({ children, className, selector = ".cf-node" }: Props) => {
  const ref = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [paths, setPaths] = useState<string[]>([]);

  useEffect(() => {
    const root = ref.current;
    const svg = svgRef.current;
    if (!root || !svg) return;
    const measure = () => {
      if (root.clientWidth < 768) {
        setPaths([]);
        return;
      }
      const w = root.clientWidth;
      const h = root.clientHeight;
      svg.setAttribute("viewBox", `0 0 ${w} ${h}`);
      const rb = root.getBoundingClientRect();
      const nodes = Array.from(root.querySelectorAll<HTMLElement>(selector));
      const next: string[] = [];
      for (let i = 0; i < nodes.length - 1; i++) {
        const a = nodes[i].getBoundingClientRect();
        const b = nodes[i + 1].getBoundingClientRect();
        const x1 = a.right - rb.left;
        const y1 = a.top - rb.top + a.height / 2;
        const x2 = b.left - rb.left;
        const y2 = b.top - rb.top + b.height / 2;
        const mid = (x1 + x2) / 2;
        next.push(`M ${x1} ${y1} C ${mid} ${y1}, ${mid} ${y2}, ${x2} ${y2}`);
      }
      setPaths(next);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(root);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [selector]);

  useFlowTimeline(
    ref,
    (tl, root) => {
      const wires = Array.from(root.querySelectorAll<SVGPathElement>(".cf-wire"));
      const pulses = Array.from(root.querySelectorAll<SVGCircleElement>(".cf-pulse"));
      if (!wires.length) return;
      wires.forEach(primePath);
      gsap.set(pulses, { opacity: 0 });

      tl.to(wires, {
        strokeDashoffset: 0,
        duration: 0.7,
        stagger: 0.15,
        ease: "power2.out",
      });

      const loop = gsap.timeline({ repeat: -1, repeatDelay: 0.6 });
      wires.forEach((p, i) => {
        const pulse = pulses[i];
        if (!pulse) return;
        loop.to(
          { t: 0 },
          {
            t: 1,
            duration: 0.8,
            ease: "power1.inOut",
            onStart: () => gsap.set(pulse, { opacity: 1 }),
            onUpdate: function () {
              const pt = pointOnPath(p, this.targets()[0].t);
              pulse.setAttribute("cx", String(pt.x));
              pulse.setAttribute("cy", String(pt.y));
            },
            onComplete: () => gsap.set(pulse, { opacity: 0 }),
          },
          i === 0 ? 0 : ">-0.3"
        );
      });
      tl.add(loop, ">");
    },
    [paths.length]
  );

  return (
    <div ref={ref} className={`relative ${className ?? ""}`}>
      <svg
        ref={svgRef}
        className="absolute inset-0 w-full h-full pointer-events-none hidden md:block z-0"
        aria-hidden
      >
        {paths.map((d, i) => (
          <path
            key={i}
            className="cf-wire"
            d={d}
            stroke="hsl(var(--primary))"
            strokeOpacity="0.55"
            strokeWidth="1.4"
            fill="none"
            strokeLinecap="round"
          />
        ))}
        {paths.map((_, i) => (
          <circle key={i} className="cf-pulse" r="3.5" fill="hsl(var(--primary))" />
        ))}
      </svg>
      <div className="relative z-10">{children}</div>
    </div>
  );
};

export default ConnectorFlow;