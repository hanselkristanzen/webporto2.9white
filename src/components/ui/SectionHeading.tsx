import type { ReactNode } from "react";
import { Reveal } from "./Reveal";
import styles from "./SectionHeading.module.css";

interface SectionHeadingProps {
  eyebrow: string;
  index?: string;
  headline: ReactNode;
  kicker?: ReactNode;
  wide?: boolean;
  headingLevel?: "h2" | "h3";
}

export function SectionHeading({
  eyebrow,
  index,
  headline,
  kicker,
  wide,
  headingLevel = "h2",
}: SectionHeadingProps) {
  const Heading = headingLevel;

  return (
    <div className={styles.wrap}>
      <Reveal variant="fade">
        <div className={styles.eyebrowRow}>
          {index ? <span className={styles.index}>{index}</span> : null}
          <span className="eyebrow">{eyebrow}</span>
          <span className={styles.rule} aria-hidden="true" />
        </div>
      </Reveal>
      <Reveal delay={80}>
        <Heading className={`${styles.headline} ${wide ? styles["headline--wide"] : ""}`}>
          {headline}
        </Heading>
      </Reveal>
      {kicker ? (
        <Reveal delay={140}>
          <p className={styles.kicker}>{kicker}</p>
        </Reveal>
      ) : null}
    </div>
  );
}
