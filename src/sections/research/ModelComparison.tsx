import { useState } from "react";
import type { ModelResult } from "../../types/content";
import { useInView } from "../../hooks/useInView";
import styles from "./Research.module.css";

interface ModelComparisonProps {
  models: ModelResult[];
}

const DEFAULT_SELECTED = "indobert";

export function ModelComparison({ models }: ModelComparisonProps) {
  const [selectedId, setSelectedId] = useState(DEFAULT_SELECTED);
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.3 });
  const selected = models.find((m) => m.id === selectedId) ?? models[0];

  const derivedNoisyAccuracy =
    selected.accuracy !== null && selected.robustnessDropPp !== null
      ? (selected.accuracy - selected.robustnessDropPp).toFixed(2)
      : null;

  return (
    <div className={styles.comparison}>
      <div className={styles.modelList} ref={ref}>
        {models.map((model) => {
          const hasData = model.accuracy !== null;
          const widthTarget = hasData ? (model.accuracy as number) / 100 : 0;
          return (
            <button
              key={model.id}
              type="button"
              className={`${styles.modelRow} cursor-target`}
              data-active={model.id === selectedId}
              data-has-data={hasData}
              onMouseEnter={() => setSelectedId(model.id)}
              onFocus={() => setSelectedId(model.id)}
              onClick={() => setSelectedId(model.id)}
              aria-pressed={model.id === selectedId}
            >
              <span className={styles.modelRowTop}>
                <span className={styles.modelName}>{model.name}</span>
                {hasData ? (
                  <span className={styles.modelValue}>{model.accuracy?.toFixed(2)}%</span>
                ) : (
                  <span className={styles.notReported}>Not reported</span>
                )}
              </span>
              <span className={styles.barTrack}>
                <span
                  className={styles.barFill}
                  style={{
                    transform: `scaleX(${inView ? widthTarget : 0})`,
                  }}
                />
              </span>
            </button>
          );
        })}
      </div>

      <div className={styles.detailPanel} aria-live="polite">
        <div>
          <p className={styles.detailName}>{selected.shortName}</p>
          <p className={styles.detailMethod}>{selected.methodology}</p>
        </div>

        {selected.note ? <p className={styles.detailNote}>{selected.note}</p> : null}

        <div className={styles.detailMetrics}>
          <div className={styles.detailMetric}>
            <span className={styles.detailMetricValue}>
              {selected.accuracy !== null ? `${selected.accuracy.toFixed(2)}%` : "—"}
            </span>
            <span className={styles.detailMetricLabel}>Accuracy (clean set)</span>
          </div>
          <div className={styles.detailMetric}>
            <span className={styles.detailMetricValue}>
              {selected.latencyMs !== null ? `${selected.latencyMs.toFixed(2)} ms` : "—"}
            </span>
            <span className={styles.detailMetricLabel}>Latency / query</span>
          </div>
          <div className={styles.detailMetric}>
            <span className={styles.detailMetricValue}>
              {selected.robustnessDropPp !== null ? `−${selected.robustnessDropPp.toFixed(2)} pp` : "—"}
            </span>
            <span className={styles.detailMetricLabel}>Drop under noise</span>
          </div>
          <div className={styles.detailMetric}>
            <span className={styles.detailMetricValue}>
              {derivedNoisyAccuracy !== null ? `≈ ${derivedNoisyAccuracy}%` : "—"}
            </span>
            <span className={styles.detailMetricLabel}>Est. noisy accuracy*</span>
          </div>
        </div>
      </div>
    </div>
  );
}
