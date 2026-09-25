import type { Project, ProjectVisual } from "../../types/content";
import { Reveal } from "../../components/ui/Reveal";
import { Tag } from "../../components/ui/Tag";
import { MagneticButton } from "../../components/ui/MagneticButton";
import { useTilt } from "../../hooks/useTilt";
import styles from "./Projects.module.css";

interface ProjectCaseProps {
  project: Project;
  index: number;
}

function bareUrl(url: string): string {
  return url.replace(/^https?:\/\//, "").replace(/\/$/, "");
}

interface ProjectVisualTileProps {
  visual: ProjectVisual;
  projectTitle: string;
}

/**
 * One clickable, browser-chrome-framed preview of a shipped product.
 * Extracted from ProjectCase so each tile can own its own tilt instance:
 * a project with one visual (StairsLife) renders exactly one of these,
 * unchanged in markup/behaviour from before this component existed; a
 * project with several (MR.COFFEE's Figma + live-site previews) renders
 * one per visual, each independently tiltable, cursor-targetable, and
 * keyboard-focusable.
 */
function ProjectVisualTile({ visual, projectTitle }: ProjectVisualTileProps) {
  const tiltRef = useTilt<HTMLDivElement>(5);
  const accessibleLabel = visual.label
    ? `Open ${projectTitle} — ${visual.label} — in a new tab`
    : `Open ${projectTitle} in a new tab`;

  return (
    <div className={styles.visualItem}>
      {visual.label ? <span className={styles.narrativeLabel}>{visual.label}</span> : null}
      <a
        className={`${styles.mockup} cursor-target`}
        href={visual.href}
        target="_blank"
        rel="noreferrer noopener"
        aria-label={accessibleLabel}
      >
        <div ref={tiltRef} className={styles.visualTilt}>
          <div className={styles.mockupChrome} aria-hidden="true">
            <span className={styles.mockupDots}>
              <span />
              <span />
              <span />
            </span>
            <span className={styles.mockupAddress}>{visual.addressLabel ?? bareUrl(visual.href)}</span>
          </div>
          <div className={styles.mockupScreen}>
            <img
              className={styles.mockupImage}
              src={visual.image}
              alt={visual.imageAlt}
              loading="lazy"
            />
          </div>
        </div>
      </a>
    </div>
  );
}

export function ProjectCase({ project, index }: ProjectCaseProps) {
  // Only used by the "no visuals yet" placeholder below. Called
  // unconditionally (rules-of-hooks) — useTilt() is a no-op whenever its
  // ref never ends up attached to a DOM node, so this costs nothing on the
  // (current, common) path where every project already has a visual.
  const placeholderTiltRef = useTilt<HTMLDivElement>(5);
  const visuals = project.visuals ?? [];

  return (
    <article className={styles.case} aria-labelledby={`project-${project.slug}`}>
      <div className={styles.caseInfo}>
        <Reveal variant="fade">
          <span className={styles.caseIndex}>{String(index + 1).padStart(2, "0")}</span>
        </Reveal>
        <Reveal delay={60}>
          <h3 id={`project-${project.slug}`} className={styles.caseTitle}>
            {project.title}
          </h3>
        </Reveal>
        <Reveal delay={100}>
          <div className={styles.tagRow}>
            {project.tags.map((tag) =>
              tag === "LIVE PROJECT" && project.link ? (
                <Tag key={tag} tone="accent" href={project.link} target="_blank" rel="noreferrer noopener" showArrow>
                  {tag}
                </Tag>
              ) : (
                <Tag key={tag} tone={tag === "LIVE PROJECT" ? "accent" : "default"}>
                  {tag}
                </Tag>
              )
            )}
          </div>
        </Reveal>

        <Reveal delay={140}>
          <div className={styles.narrativeGrid}>
            <div className={styles.narrativeBlock}>
              <span className={styles.narrativeLabel}>What it is</span>
              <p className={styles.narrativeValue}>{project.description}</p>
            </div>
            {project.whyItMatters ? (
              <div className={styles.narrativeBlock}>
                <span className={styles.narrativeLabel}>Why it matters</span>
                <p className={styles.narrativeValue}>{project.whyItMatters}</p>
              </div>
            ) : null}
            <div className={styles.narrativeBlock}>
              <span className={styles.narrativeLabel}>What Hansel did</span>
              <p className={styles.narrativeValue}>{project.role}</p>
            </div>
            {project.technicallyInteresting ? (
              <div className={styles.narrativeBlock}>
                <span className={styles.narrativeLabel}>Technically interesting</span>
                <p className={styles.narrativeValue}>{project.technicallyInteresting}</p>
              </div>
            ) : null}
          </div>
        </Reveal>

        <Reveal delay={170}>
          <div>
            <span className={styles.narrativeLabel}>Stack</span>
            <div className={styles.techRow}>
              {project.technologies.map((tech) => (
                <span key={tech} className={styles.tech}>
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </Reveal>

        {project.link ? (
          <Reveal delay={180}>
            <div className={styles.ctaRow}>
              <MagneticButton
                className="cursor-target"
                href={project.link}
                target="_blank"
                rel="noreferrer noopener"
              >
                Visit Live Site
              </MagneticButton>
            </div>
          </Reveal>
        ) : null}
      </div>

      <Reveal variant="scale" delay={80} as="div" className={styles.visualSlot}>
        {visuals.length > 0 ? (
          <div className={visuals.length > 1 ? styles.visualGroup : undefined}>
            {visuals.map((visual) => (
              <ProjectVisualTile key={visual.href} visual={visual} projectTitle={project.title} />
            ))}
          </div>
        ) : (
          <div ref={placeholderTiltRef} className={styles.visualTilt}>
            <span className={styles.visualLabel}>Preview coming soon</span>
          </div>
        )}
      </Reveal>
    </article>
  );
}
