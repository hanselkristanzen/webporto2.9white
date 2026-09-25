import { education } from "../../data/education";
import { SectionHeading } from "../../components/ui/SectionHeading";
import { Reveal } from "../../components/ui/Reveal";
import styles from "./Education.module.css";

export function Education() {
  return (
    <section id="education" className={styles.education} aria-labelledby="education-heading">
      <div className="container">
        <div className={styles.headerRow}>
          <SectionHeading
            index="05"
            eyebrow="Education"
            headline={<span id="education-heading">Grounded in the fundamentals.</span>}
          />
        </div>

        <div className={styles.grid}>
          {education.map((entry, i) => (
            <Reveal key={entry.id} delay={i * 80} className={styles.card}>
              <div className={styles.cardTop}>
                <h3 className={styles.institution}>{entry.institution}</h3>
                <span className={styles.years}>
                  {entry.start} — {entry.end}
                </span>
              </div>
              <div>
                <p className={styles.program}>{entry.program}</p>
                {entry.focus ? <p className={styles.focus}>{entry.focus}</p> : null}
              </div>
              <div className={styles.footerRow}>
                <span className={styles.location}>{entry.location}</span>
                {entry.distinction ? (
                  <span className={styles.distinction}>{entry.distinction}</span>
                ) : null}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
