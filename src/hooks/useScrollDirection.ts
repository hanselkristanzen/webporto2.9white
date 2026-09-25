import { useEffect, useRef, useState } from "react";

interface ScrollState {
  direction: "up" | "down";
  pastThreshold: boolean;
}

/** Tracks coarse scroll direction + whether we're past a reveal threshold. */
export function useScrollDirection(threshold = 120): ScrollState {
  const [state, setState] = useState<ScrollState>({ direction: "up", pastThreshold: false });
  const lastY = useRef(0);
  const ticking = useRef(false);

  useEffect(() => {
    const handleScroll = () => {
      if (ticking.current) return;
      ticking.current = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        const direction = y > lastY.current ? "down" : "up";
        setState({ direction, pastThreshold: y > threshold });
        lastY.current = y;
        ticking.current = false;
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [threshold]);

  return state;
}
