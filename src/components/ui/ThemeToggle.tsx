import { useTheme } from "../../lib/ThemeContext";
import styles from "./ThemeToggle.module.css";

interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      className={[styles.toggle, "cursor-target", className].filter(Boolean).join(" ")}
      onClick={toggleTheme}
      role="switch"
      aria-checked={isDark}
      aria-label={`Switch to ${isDark ? "light" : "dark"} theme`}
    >
      <span className={styles.option} data-active={!isDark}>
        Light
      </span>
      <span className={styles.option} data-active={isDark}>
        Dark
      </span>
      <span className={styles.knob} data-position={isDark ? "dark" : "light"} aria-hidden="true" />
    </button>
  );
}
