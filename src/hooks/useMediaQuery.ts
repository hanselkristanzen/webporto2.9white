import { useEffect, useState } from "react";

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState<boolean>(() =>
    typeof window === "undefined" ? false : window.matchMedia(query).matches
  );

  useEffect(() => {
    const mql = window.matchMedia(query);
    const handler = (event: MediaQueryListEvent) => setMatches(event.matches);
    setMatches(mql.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, [query]);

  return matches;
}

/** Coarse pointer / no hover ≈ touch-first device (phones, most tablets). */
export function useIsTouchDevice(): boolean {
  return useMediaQuery("(pointer: coarse)");
}

/** Convenience breakpoint hooks mirrored from the design tokens. */
export function useIsMobile(): boolean {
  return useMediaQuery("(max-width: 768px)");
}

export function useIsDesktop(): boolean {
  return useMediaQuery("(min-width: 1025px)");
}
