import { Reveal } from "../../components/ui/Reveal";
import { MagneticButton } from "../../components/ui/MagneticButton";
import { Portrait } from "../../components/ui/Portrait";
import styles from "./About.module.css";

export function About() {
  return (
    <section id="about" className={styles.about} aria-labelledby="about-heading">
      <div className={`container ${styles.grid}`}>
        <div className={styles.left}>
          <div className={styles.stickyWrap}>
            <Reveal variant="fade">
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <span className="mono eyebrow">01</span>
                <span className="eyebrow">About</span>
              </div>
            </Reveal>
            <Reveal delay={80}>
              <h2 id="about-heading" className={styles.headline}>
                A computer science student who likes to build things.
              </h2>
            </Reveal>
            <Reveal delay={140}>
              <dl className={styles.metaList}>
                <div className={styles.metaItem}>
                  <dt className={styles.metaLabel}>Born</dt>
                  <dd className={styles.metaValue}>Purwokerto, Indonesia</dd>
                </div>
                <div className={styles.metaItem}>
                  <dt className={styles.metaLabel}>Based in</dt>
                  <dd className={styles.metaValue}>Jakarta, Indonesia</dd>
                </div>
                <div className={styles.metaItem}>
                  <dt className={styles.metaLabel}>Studying at</dt>
                  <dd className={styles.metaValue}>BINUS University</dd>
                </div>
              </dl>
            </Reveal>
            <Reveal delay={180}>
              <div className={styles.cvRow}>
                <MagneticButton
                  className="cursor-target"
                  href="/Hansel-Kristanzen-CV.pdf"
                  download="Hansel-Kristanzen-CV.pdf"
                  variant="outline"
                  showArrow={false}
                >
                  View CV
                </MagneticButton>
              </div>
            </Reveal>
            <Reveal delay={220} className={styles.portraitSlot}>
              <Portrait />
            </Reveal>
          </div>
        </div>

        <div className={styles.right}>
          <Reveal>
            <p className={styles.paragraph}>
              Hansel Kristanzen is a computer science student and a designer.
            </p>
          </Reveal>
          <Reveal delay={50}>
            <p className={styles.paragraph}>
              Born in Purwokerto, he moved to Jakarta in 2024 to attend Binus University.
            </p>
          </Reveal>
          <Reveal delay={100}>
            <p className={styles.paragraph}>
              He enjoys exploring how technology can solve real-world problems. He is
              always curious to learn new things and improve his skills.
            </p>
          </Reveal>
          <Reveal delay={150}>
            <p className={styles.paragraph}>
              Hansel enjoys taking on new challenges, working with others, and turning
              ideas into practical solutions. One of the academic projects he has worked
              on is Stairslife, a platform designed to connect students with small
              businesses.
            </p>
          </Reveal>
          <Reveal delay={200}>
            <p className={styles.paragraph}>
              Beyond coding, he has also been involved in various organizational and
              event activities, helping him develop his teamwork, leadership, and
              problem-solving skills.
            </p>
          </Reveal>
          <Reveal delay={250}>
            <p className={styles.paragraph}>
              Hansel is currently focused on learning and growing as a software engineer.
            </p>
          </Reveal>
          <Reveal delay={300} variant="clip">
            <p className={styles.settle}>neversettle.</p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
