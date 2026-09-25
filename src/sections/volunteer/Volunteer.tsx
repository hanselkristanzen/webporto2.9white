import { volunteer } from "../../data/volunteer";
import { Reveal } from "../../components/ui/Reveal";
import { useImageLightbox } from "../../components/ui/ImageLightbox";
import styles from "./Volunteer.module.css";

export function Volunteer() {
  const { openImage } = useImageLightbox();

  return (
    <section
      id="volunteer"
      className={styles.volunteer}
      aria-labelledby="volunteer-heading"
    >
      <div className="container">
        <h2 id="volunteer-heading" className="visually-hidden">
          Volunteer Work
        </h2>
        {volunteer.map((entry) => (
          <Reveal key={entry.id} className={styles.row} as="div">
            <span className={styles.label}>
              07
              <br />
              Volunteer
            </span>
            <div className={styles.body}>
              <p className={styles.role}>
                {entry.role} — {entry.organization}
              </p>
              <p className={styles.description}>{entry.description}</p>
            </div>
            <div className={styles.meta}>
              {entry.image ? (
                <button
                  type="button"
                  className={`${styles.photoTrigger} cursor-target`}
                  onClick={(event) => {
                    const rect = event.currentTarget.getBoundingClientRect();
                    openImage({
                      src: entry.image!,
                      alt: entry.imageAlt ?? `Photo from ${entry.organization}`,
                      originX: (rect.left + rect.width / 2) / window.innerWidth,
                      originY: (rect.top + rect.height / 2) / window.innerHeight,
                    });
                  }}
                  aria-label={`Open photo from ${entry.organization}`}
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
              <span>{entry.date}</span>
              <span>{entry.location}</span>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
