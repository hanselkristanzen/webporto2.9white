import { useEffect, useRef, useState } from "react";

/**
 * Returns 0..1 representing how far a section has scrolled past the top
 * of the viewport, reaching 1 once the section's own height has passed.
 * Used to drive scroll-linked transforms without a full ScrollTrigger
 * dependency for this single relationship.
 */
export function useScrollProgress<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [progress, setProgress] = useState(0);
  const ticking = useRef(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const update = () => {
      const rect = node.getBoundingClientRect();
      const raw = -rect.top / (rect.height || 1);
      setProgress(Math.min(1, Math.max(0, raw)));
      ticking.current = false;
    };

    const handle = () => {
      if (ticking.current) return;
      ticking.current = true;
      requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", handle, { passive: true });
    window.addEventListener("resize", handle);
    return () => {
      window.removeEventListener("scroll", handle);
      window.removeEventListener("resize", handle);
    };
  }, []);

  return { ref, progress };
}
