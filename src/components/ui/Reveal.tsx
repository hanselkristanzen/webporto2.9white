import { createElement, type CSSProperties, type ElementType, type ReactNode } from "react";
import { useInView } from "../../hooks/useInView";
import styles from "./Reveal.module.css";

interface RevealProps {
  children: ReactNode;
  as?: ElementType;
  variant?: "up" | "fade" | "up-sm" | "scale" | "clip";
  delay?: number;
  className?: string;
  threshold?: number;
}

/**
 * Shared entrance-animation primitive. Wrap any block-level content to have
 * it fade/rise into view once, driven by IntersectionObserver rather than
 * a scroll-linked library — kept lightweight since most of the site's
 * reveals are simple one-shot transitions. Fully inert under
 * prefers-reduced-motion (see Reveal.module.css).
 *
 * Uses createElement (rather than JSX) for the polymorphic tag: TypeScript's
 * JSX checker can't narrow props/ref correctly for a runtime-determined
 * ElementType, so createElement sidesteps that false-positive type error.
 */
export function Reveal({
  children,
  as = "div",
  variant = "up",
  delay = 0,
  className,
  threshold,
}: RevealProps) {
  const { ref, inView } = useInView<HTMLElement>({ threshold });

  const style = { "--reveal-delay": `${delay}ms` } as CSSProperties;

  return createElement(
    as,
    {
      ref,
      className: [styles.reveal, inView ? styles.isVisible : "", className]
        .filter(Boolean)
        .join(" "),
      "data-variant": variant,
      style,
    },
    children
  );
}
