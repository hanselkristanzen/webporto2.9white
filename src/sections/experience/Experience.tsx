import { useEffect, useRef } from "react";
import { experience } from "../../data/experience";
import { SectionHeading } from "../../components/ui/SectionHeading";
import { gsap, ScrollTrigger } from "../../lib/gsap";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { TimelineItem } from "./TimelineItem";
import styles from "./Experience.module.css";

export function Experience() {
  const timelineRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion || !timelineRef.current || !fillRef.current) return;

    const trigger = ScrollTrigger.create({
      trigger: timelineRef.current,
      start: "top 75%",
      end: "bottom 70%",
      scrub: 0.6,
      onUpdate: (self) => {
        gsap.set(fillRef.current, { scaleY: self.progress });
      },
    });

    return () => trigger.kill();
  }, [reducedMotion]);

  return (
    <section id="experience" className={styles.experience} aria-labelledby="experience-heading">
      <div className="container">
        <div className={styles.headerRow}>
          <SectionHeading
            index="04"
            eyebrow="Experience"
            headline={<span id="experience-heading">Where the work has happened.</span>}
          />
        </div>

        <div className={styles.timeline} ref={timelineRef}>
          <span className={styles.lineTrack} aria-hidden="true" />
          <span className={styles.lineFill} ref={fillRef} aria-hidden="true" />
          {experience.map((entry) => (
            <TimelineItem key={entry.id} entry={entry} />
          ))}
        </div>
      </div>
    </section>
  );
}
