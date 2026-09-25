import { useTilt } from "../../hooks/useTilt";
import styles from "./Portrait.module.css";

export function Portrait() {
  const tiltRef = useTilt<HTMLDivElement>(3.5);

  return (
    <div className={styles.wrap}>
      <div ref={tiltRef} className={styles.frame}>
        <img
          className={styles.base}
          src="/images/hansel-portrait.jpg"
          alt="Portrait of Hansel Kristanzen"
          loading="lazy"
        />
        <span className={styles.duotone} aria-hidden="true" />
        <span className={styles.frameLabel}>HK / 2026</span>
      </div>
    </div>
  );
}
