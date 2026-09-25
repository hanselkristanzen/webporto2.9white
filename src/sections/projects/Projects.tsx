import { projects } from "../../data/projects";
import { SectionHeading } from "../../components/ui/SectionHeading";
import { Reveal } from "../../components/ui/Reveal";
import { ProjectCase } from "./ProjectCase";
import styles from "./Projects.module.css";

export function Projects() {
  return (
    <section id="work" className={styles.projects} aria-labelledby="work-heading">
      <div className="container">
        <div className={styles.headerRow}>
          <SectionHeading
            index="02"
            eyebrow="Selected Work"
            headline={<span id="work-heading">Projects built end to end.</span>}
            kicker="Case studies from frontend engineering to product thinking — the work that best shows how Hansel builds."
          />
        </div>

        <div className={styles.caseList}>
          {projects.map((project, index) => (
            <ProjectCase key={project.slug} project={project} index={index} />
          ))}
        </div>

        <Reveal>
          <div className={styles.comingSoon}>
            <span className={styles.comingSoonLabel}>More projects coming soon</span>
            <span className={styles.comingSoonRule} aria-hidden="true" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
