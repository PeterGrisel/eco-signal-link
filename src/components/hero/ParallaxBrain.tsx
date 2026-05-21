import { useEffect, useState } from "react";
import SplineBrain from "./SplineBrain";

/**
 * Page-wide parallax brain: stays subtly visible while scrolling.
 * Fixed-position canvas behind all content.
 */
export default function ParallaxBrain() {
  const [y, setY] = useState(0);
  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setY(window.scrollY));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);
  // Fade brain out by ~70% as you scroll past ~2 viewports
  const opacity = Math.max(0.25, 1 - y / 2000);
  const translateY = y * 0.15;
  return (
    <div
      aria-hidden
      className="fixed inset-0 z-0 pointer-events-none"
      style={{ opacity, transform: `translate3d(0, ${-translateY}px, 0)` }}
    >
      <SplineBrain className="absolute inset-0" />
    </div>
  );
}
