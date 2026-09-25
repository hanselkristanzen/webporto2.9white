import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type Theme = "light" | "dark";

const STORAGE_KEY = "hk-theme";

interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

function readInitialTheme(): Theme {
  if (typeof document === "undefined") return "light";
  // The inline bootstrap script in index.html has already set this
  // attribute before React mounts, so we simply read it back rather than
  // recomputing (and potentially disagreeing with) the pre-paint value.
  const attr = document.documentElement.getAttribute("data-theme");
  return attr === "dark" ? "dark" : "light";
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: "light",
  toggleTheme: () => {},
  setTheme: () => {},
});

export function useTheme(): ThemeContextValue {
  return useContext(ThemeContext);
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(readInitialTheme);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      // localStorage can throw in private-browsing/blocked-storage contexts;
      // the theme still applies for this session via the DOM attribute.
    }
  }, [theme]);

  // If the person hasn't made an explicit choice yet, keep following the OS
  // preference live (matches TASK 10 — "respect prefers-color-scheme").
  useEffect(() => {
    let hasExplicitChoice = false;
    try {
      hasExplicitChoice = localStorage.getItem(STORAGE_KEY) !== null;
    } catch {
      hasExplicitChoice = false;
    }
    if (hasExplicitChoice) return;

    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e: MediaQueryListEvent) => setThemeState(e.matches ? "dark" : "light");
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  const setTheme = useCallback((next: Theme) => setThemeState(next), []);
  const toggleTheme = useCallback(
    () => setThemeState((prev) => (prev === "light" ? "dark" : "light")),
    []
  );

  const value = useMemo(() => ({ theme, toggleTheme, setTheme }), [theme, toggleTheme, setTheme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
