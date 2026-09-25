import { useEffect, useRef, useState } from "react";
import { gsap } from "../../lib/gsap";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import styles from "./Loader.module.css";

interface LoaderProps {
  onComplete: () => void;
}

export function Loader({ onComplete }: LoaderProps) {
  const shellRef = useRef<HTMLDivElement>(null);
  const word1Ref = useRef<HTMLDivElement>(null);
  const word2Ref = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  const [count, setCount] = useState(0);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) {
      onComplete();
      return;
    }

    const counter = { value: 0 };
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
        onComplete: () => onComplete(),
      });

      tl.to(counter, {
        value: 100,
        duration: 2.05,
        ease: "power1.inOut",
        onUpdate: () => setCount(Math.round(counter.value)),
      }, 0);

      if (fillRef.current) {
        tl.to(fillRef.current, { scaleX: 1, duration: 2.05, ease: "power1.inOut" }, 0);
      }

      if (word1Ref.current) {
        tl.to(word1Ref.current, {
          opacity: 1,
          filter: "blur(0px)",
          y: 0,
          scale: 1,
          duration: 0.7,
        }, 0);
        tl.to(word1Ref.current, {
          opacity: 0,
          filter: "blur(6px)",
          y: -14,
          scale: 1.02,
          duration: 0.45,
        }, 0.95);
      }

      if (word2Ref.current) {
        tl.to(word2Ref.current, {
          opacity: 1,
          filter: "blur(0px)",
          y: 0,
          scale: 1,
          duration: 0.7,
        }, 1.25);
        tl.to(word2Ref.current, {
          opacity: 0,
          filter: "blur(6px)",
          y: -14,
          scale: 1.02,
          duration: 0.4,
        }, 1.95);
      }

      if (shellRef.current) {
        tl.to(shellRef.current, {
          yPercent: -100,
          duration: 0.9,
          ease: "cubic-bezier(0.65, 0, 0.35, 1)",
        }, 2.05);
      }
    });

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reducedMotion]);

  if (reducedMotion) return null;

  return (
    <div
      ref={shellRef}
      className={styles.loader}
      role="status"
      aria-label="Loading Hansel Kristanzen's portfolio"
    >
      <div className={styles.wordWrap}>
        <div ref={word1Ref} className={styles.word}>
          HANSEL KRISTANZEN
        </div>
        <div ref={word2Ref} className={styles.word}>
          COMPUTER SCIENCE × DESIGN
        </div>
      </div>
      <div className={styles.counter}>
        <span className="mono">{String(count).padStart(3, "0")}</span>
        <span className={styles.counterBar}>
          <span ref={fillRef} className={styles.counterFill} />
        </span>
      </div>
    </div>
  );
}
