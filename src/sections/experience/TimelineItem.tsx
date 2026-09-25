import type { ExperienceEntry } from "../../types/content";
import { useInView } from "../../hooks/useInView";
import { useImageLightbox } from "../../components/ui/ImageLightbox";
import styles from "./Experience.module.css";

interface TimelineItemProps {
  entry: ExperienceEntry;
}

export function TimelineItem({ entry }: TimelineItemProps) {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.4 });
  const { openImage } = useImageLightbox();

  return (
    <div
      ref={ref}
      className={styles.item}
      data-visible={inView}
      style={{ opacity: inView ? 1 : 0.45 }}
    >
      <span className={styles.dot} aria-hidden="true" />
      <span className={styles.date}>
        {entry.start === entry.end ? entry.start : `${entry.start} — ${entry.end}`}
      </span>
      <div>
        <h3 className={styles.role}>{entry.role}</h3>
        <p className={styles.org}>{entry.organization}</p>
      </div>
      <div className={styles.location}>
        <span className={styles.locationText}>{entry.location}</span>
        <span className={styles.locationText}>{entry.mode}</span>
        {entry.image ? (
          <button
            type="button"
            className={`${styles.photoTrigger} cursor-target`}
            onClick={(event) => {
              const rect = event.currentTarget.getBoundingClientRect();
              openImage({
                src: entry.image!,
                alt: entry.imageAlt ?? `Photo from ${entry.role} at ${entry.organization}`,
                originX: (rect.left + rect.width / 2) / window.innerWidth,
                originY: (rect.top + rect.height / 2) / window.innerHeight,
              });
            }}
            aria-label={`Open photo from ${entry.role} at ${entry.organization}`}
          >
            <img
              className={styles.photoThumb}
              src={entry.image}
              alt=""
              aria-hidden="true"
              loading="lazy"
            />
          </button>
        ) : null}
      </div>
    </div>
  );
}
