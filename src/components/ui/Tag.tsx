import type { AnchorHTMLAttributes, ReactNode } from "react";
import styles from "./Tag.module.css";

interface TagProps {
  children: ReactNode;
  tone?: "default" | "accent";
  /** When provided, the tag renders as a real link (e.g. "LIVE PROJECT"). */
  href?: string;
  target?: AnchorHTMLAttributes<HTMLAnchorElement>["target"];
  rel?: string;
  showArrow?: boolean;
}

export function Tag({ children, tone = "default", href, target, rel, showArrow }: TagProps) {
  const className = [styles.tag, href ? "cursor-target" : ""].filter(Boolean).join(" ");

  if (href) {
    return (
      <a href={href} target={target} rel={rel} className={className} data-tone={tone}>
        {children}
        {showArrow ? (
          <span className={styles.arrow} aria-hidden="true">
            →
          </span>
        ) : null}
      </a>
    );
  }

  return (
    <span className={className} data-tone={tone}>
      {children}
    </span>
  );
}
