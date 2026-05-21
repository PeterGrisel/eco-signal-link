import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface FlickeringGridProps {
  squareSize?: number;
  gridGap?: number;
  flickerChance?: number;
  /** RGB tuple, e.g. "232,148,90" for primary orange */
  color?: string;
  maxOpacity?: number;
  className?: string;
}

/**
 * Lightweight canvas flickering grid. Pauses off-screen and when tab hidden.
 * Adapted from AI Fctry — pure DOM, ~30fps cap.
 */
export default function FlickeringGrid({
  squareSize = 4,
  gridGap = 6,
  flickerChance = 0.3,
  color = "232,148,90",
  maxOpacity = 0.25,
  className,
}: FlickeringGridProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [, setSize] = useState({ w: 0, h: 0 });

  const setupGrid = useCallback(
    (w: number, h: number, dpr: number) => {
      const cols = Math.floor(w / (squareSize + gridGap));
      const rows = Math.floor(h / (squareSize + gridGap));
      const squares = new Float32Array(cols * rows);
      for (let i = 0; i < squares.length; i++) {
        squares[i] = Math.random() * maxOpacity;
      }
      return { cols, rows, squares, dpr };
    },
    [squareSize, gridGap, maxOpacity]
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let last = performance.now();
    let grid = setupGrid(0, 0, window.devicePixelRatio || 1);
    let isVisible = true;
    let isPageVisible = !document.hidden;

    const resize = () => {
      const rect = container.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
      grid = setupGrid(rect.width, rect.height, dpr);
      setSize({ w: rect.width, h: rect.height });
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(container);

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          isVisible = e.isIntersecting;
          if (isVisible && isPageVisible && !raf) {
            last = performance.now();
            raf = requestAnimationFrame(tick);
          }
        });
      },
      { threshold: 0 }
    );
    io.observe(container);

    const onVisibility = () => {
      isPageVisible = !document.hidden;
      if (isPageVisible && isVisible && !raf) {
        last = performance.now();
        raf = requestAnimationFrame(tick);
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    const FRAME_INTERVAL = 1000 / 30;
    const tick = (now: number) => {
      if (!isVisible || !isPageVisible) {
        raf = 0;
        return;
      }
      const elapsed = now - last;
      if (elapsed < FRAME_INTERVAL) {
        raf = requestAnimationFrame(tick);
        return;
      }
      const dt = elapsed / 1000;
      last = now;
      for (let i = 0; i < grid.squares.length; i++) {
        if (Math.random() < flickerChance * dt) {
          grid.squares[i] = Math.random() * maxOpacity;
        }
      }
      const rect = container.getBoundingClientRect();
      ctx.clearRect(0, 0, rect.width, rect.height);
      for (let r = 0; r < grid.rows; r++) {
        for (let c = 0; c < grid.cols; c++) {
          const opacity = grid.squares[r * grid.cols + c];
          ctx.fillStyle = `rgba(${color},${opacity})`;
          ctx.fillRect(
            c * (squareSize + gridGap),
            r * (squareSize + gridGap),
            squareSize,
            squareSize
          );
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      if (raf) cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [color, flickerChance, gridGap, maxOpacity, squareSize, setupGrid]);

  return (
    <div
      ref={containerRef}
      className={cn("absolute inset-0 overflow-hidden pointer-events-none", className)}
      aria-hidden
    >
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
}