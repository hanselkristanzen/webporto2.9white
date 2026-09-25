import Lenis from "lenis";
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  type ReactNode,
} from "react";
import { gsap, ScrollTrigger } from "./gsap";
import { useReducedMotion } from "../hooks/useReducedMotion";

interface SmoothScrollValue {
  scrollTo: (target: string | number | HTMLElement, options?: { offset?: number }) => void;
  /** Temporarily pauses/resumes smooth scrolling (used to lock scroll behind the loader/mobile menu). */
  stop: () => void;
  start: () => void;
}

function fallbackScrollTo(target: string | number | HTMLElement) {
  const el = typeof target === "string" ? document.querySelector(target) : target;
  if (el instanceof HTMLElement) {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  } else if (typeof target === "number") {
    window.scrollTo({ top: target, behavior: "smooth" });
  }
}

const SmoothScrollContext = createContext<SmoothScrollValue>({
  scrollTo: fallbackScrollTo,
  stop: () => {},
  start: () => {},
});

export function useSmoothScroll(): SmoothScrollValue {
  return useContext(SmoothScrollContext);
}

export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) {
      // Respect the user's preference entirely — no smooth-scroll layer,
      // native scrolling takes over and CSS disables transitions/animations.
      return;
    }

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t: number) => 1 - Math.pow(1 - t, 3),
      smoothWheel: true,
      touchMultiplier: 1.15,
    });
    lenisRef.current = lenis;

    lenis.on("scroll", ScrollTrigger.update);

    const update = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(update);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [reducedMotion]);

  // These closures always read lenisRef.current at call time, so they stay
  // correct even though the ref itself is populated asynchronously inside
  // the effect above (refs don't trigger memo recomputation).
  const value = useMemo<SmoothScrollValue>(
    () => ({
      scrollTo: (target, options) => {
        const lenis = lenisRef.current;
        if (lenis) {
          lenis.scrollTo(target, { offset: options?.offset ?? 0 });
        } else {
          fallbackScrollTo(target);
        }
      },
      stop: () => lenisRef.current?.stop(),
      start: () => lenisRef.current?.start(),
    }),
    []
  );

  return (
    <SmoothScrollContext.Provider value={value}>
      {children}
    </SmoothScrollContext.Provider>
  );
}
