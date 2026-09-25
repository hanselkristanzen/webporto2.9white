import { nlpResearch } from "../../data/research";
import { SectionHeading } from "../../components/ui/SectionHeading";
import { Tag } from "../../components/ui/Tag";
import { Reveal } from "../../components/ui/Reveal";
import { useImageLightbox } from "../../components/ui/ImageLightbox";
import { ModelComparison } from "./ModelComparison";
import styles from "./Research.module.css";

const CERTIFICATE_SRC = "/images/research/icimtech-2026-certificate.jpg";
const CERTIFICATE_ALT =
  'ICIMTech 2026 presentation certificate awarded to Hansel Siswanto for "Comparative Analysis of NLP Intent Classification in Indonesian Customer Service Chatbots," Bina Nusantara University, held August 19–20, 2026 in Tangerang, Indonesia';

export function Research() {
  const { dataset } = nlpResearch;
  const { openImage } = useImageLightbox();

  return (
    <section
      id="research"
      className={styles.research}
      data-dark
      aria-labelledby="research-heading"
    >
      <div className="container">
        <div className={styles.headerRow}>
          <div className={styles.headerLeft}>
            <SectionHeading
              index="03"
              eyebrow="Research / Experiments"
              headline={
                <span id="research-heading">Comparing how machines understand Indonesian.</span>
              }
              wide
              kicker="A benchmark of five intent-classification approaches on messy, real-patterned Indonesian customer-service queries — not a lab-clean dataset."
            />
            <Reveal delay={100}>
              <p className={styles.authors}>
                {nlpResearch.authors.map((author, i) => (
                  <span key={author.name} className={author.isMe ? styles.authorMe : undefined}>
                    {author.name}
                    {i < nlpResearch.authors.length - 1 ? ", " : ""}
                  </span>
                ))}
              </p>
            </Reveal>
          </div>

          <Reveal delay={100} className={styles.headerRight}>
            <p className={styles.datasetLabel}>{nlpResearch.venue} · {nlpResearch.status}</p>
            <p className={styles.paperTitle}>{nlpResearch.title}</p>
            <div className={styles.datasetStats}>
              <div className={styles.datasetStat}>
                <span className={styles.datasetStatValue}>
                  {dataset.size.toLocaleString("en-US")}
                </span>
                <span className={styles.datasetStatLabel}>Queries</span>
              </div>
              <div className={styles.datasetStat}>
                <span className={styles.datasetStatValue}>{dataset.intentCategories}</span>
                <span className={styles.datasetStatLabel}>Intent categories</span>
              </div>
            </div>
            <div className={styles.characteristics}>
              {dataset.domains.map((d) => (
                <Tag key={d}>{d}</Tag>
              ))}
            </div>
            <div className={styles.characteristics}>
              {dataset.characteristics.map((c) => (
                <Tag key={c} tone="accent">
                  {c}
                </Tag>
              ))}
            </div>
          </Reveal>
        </div>

        <Reveal>
          <ModelComparison models={nlpResearch.models} />
        </Reveal>

        <div className={styles.insights}>
          <Reveal delay={0}>
            <div className={styles.insight}>
              <p className={styles.insightValue}>100.00%</p>
              <p className={styles.insightLabel}>
                IndoBERT reached perfect accuracy on the clean test set.
              </p>
            </div>
          </Reveal>
          <Reveal delay={80}>
            <div className={styles.insight}>
              <p className={styles.insightValue}>~33× faster</p>
              <p className={styles.insightLabel}>
                TF-IDF + Linear SVM answers in 0.57 ms per query versus IndoBERT's 18.77 ms.
              </p>
            </div>
          </Reveal>
          <Reveal delay={160}>
            <div className={styles.insight}>
              <p className={styles.insightValue}>5.11 vs 7.56 pp</p>
              <p className={styles.insightLabel}>
                Under noisy, informal input, TF-IDF's accuracy drop was smaller than
                IndoBERT's — narrowing the gap between them even further.
              </p>
            </div>
          </Reveal>
        </div>

        <Reveal delay={60}>
          <p className={styles.limitation}>
            <span className={styles.limitationLabel}>Reading the numbers honestly</span>
            {nlpResearch.limitation}
          </p>
        </Reveal>

        <Reveal delay={100} className={styles.certificateBlock}>
          <span className={styles.certificateEyebrow}>Conference Presentation</span>
          <button
            type="button"
            className={`${styles.certificateFrame} cursor-target`}
            onClick={(event) => {
              const rect = event.currentTarget.getBoundingClientRect();
              openImage({
                src: CERTIFICATE_SRC,
                alt: CERTIFICATE_ALT,
                originX: (rect.left + rect.width / 2) / window.innerWidth,
                originY: (rect.top + rect.height / 2) / window.innerHeight,
              });
            }}
            aria-label="View the ICIMTech 2026 presentation certificate at full size"
          >
            <img
              src={CERTIFICATE_SRC}
              alt={CERTIFICATE_ALT}
              className={styles.certificateImage}
              loading="lazy"
            />
          </button>
          <p className={styles.certificateCaption}>
            Certificate of oral presentation, ICIMTech 2026 — Aug 19–20, 2026, Tangerang, Indonesia.
            Click to view full size.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
