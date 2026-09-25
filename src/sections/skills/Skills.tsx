import { skillGroups } from "../../data/skills";
import { SectionHeading } from "../../components/ui/SectionHeading";
import { Reveal } from "../../components/ui/Reveal";
import styles from "./Skills.module.css";

export function Skills() {
  return (
    <section id="skills" className={styles.skills} aria-labelledby="skills-heading">
      <div className="container">
        <div className={styles.headerRow}>
          <SectionHeading
            index="08"
            eyebrow="Skills / Technology"
            headline={<span id="skills-heading">Tools Hansel reaches for.</span>}
          />
        </div>

        <div className={styles.grid}>
          {skillGroups.map((group, gi) => (
            <div key={group.id} className={styles.group}>
              <Reveal delay={gi * 60} variant="fade">
                <p className={`eyebrow ${styles.groupLabel}`}>{group.label}</p>
              </Reveal>
              <ul>
                {group.skills.map((skill, si) => (
                  <Reveal key={skill} as="li" delay={gi * 60 + si * 40} variant="up-sm">
                    <span className={styles.skillItem} tabIndex={0}>
                      <span className={styles.skillMarker} aria-hidden="true">
                        →
                      </span>
                      {skill}
                    </span>
                  </Reveal>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
