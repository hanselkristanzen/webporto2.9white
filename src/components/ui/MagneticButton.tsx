import { useEffect, useRef, type AnchorHTMLAttributes, type ButtonHTMLAttributes, type ReactNode } from "react";
import { gsap } from "../../lib/gsap";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { useIsTouchDevice } from "../../hooks/useMediaQuery";
import styles from "./MagneticButton.module.css";

type CommonProps = {
  children: ReactNode;
  variant?: "outline" | "solid";
  showArrow?: boolean;
  className?: string;
};

type AsButton = CommonProps &
  ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };

type AsAnchor = CommonProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };

type MagneticButtonProps = AsButton | AsAnchor;

const STRENGTH = 0.35;

export function MagneticButton(props: MagneticButtonProps) {
  const { children, variant = "outline", showArrow = true, className, ...rest } = props;
  const wrapRef = useRef<HTMLSpanElement>(null);
  const targetRef = useRef<HTMLElement | null>(null);
  const reducedMotion = useReducedMotion();
  const isTouch = useIsTouchDevice();

  useEffect(() => {
    const wrap = wrapRef.current;
    const target = targetRef.current;
    if (!wrap || !target || reducedMotion || isTouch) return;

    const xTo = gsap.quickTo(target, "x", { duration: 0.5, ease: "power3.out" });
    const yTo = gsap.quickTo(target, "y", { duration: 0.5, ease: "power3.out" });

    const handleMove = (event: PointerEvent) => {
      const rect = wrap.getBoundingClientRect();
      const relX = event.clientX - (rect.left + rect.width / 2);
      const relY = event.clientY - (rect.top + rect.height / 2);
      xTo(relX * STRENGTH);
      yTo(relY * STRENGTH);
    };

    const handleLeave = () => {
      xTo(0);
      yTo(0);
    };

    wrap.addEventListener("pointermove", handleMove);
    wrap.addEventListener("pointerleave", handleLeave);
    return () => {
      wrap.removeEventListener("pointermove", handleMove);
      wrap.removeEventListener("pointerleave", handleLeave);
    };
  }, [reducedMotion, isTouch]);

  const content = (
    <>
      <span>{children}</span>
      {showArrow ? (
        <span className={styles.arrow} aria-hidden="true">
          →
        </span>
      ) : null}
    </>
  );

  const sharedClassName = [styles.button, className].filter(Boolean).join(" ");

  return (
    <span
      ref={wrapRef}
      className={styles.magnetic}
    >
      {"href" in props && props.href ? (
        <a
          ref={(node) => {
            targetRef.current = node;
          }}
          className={sharedClassName}
          data-variant={variant}
          {...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)}
        >
          {content}
        </a>
      ) : (
        <button
          ref={(node) => {
            targetRef.current = node;
          }}
          type="button"
          className={sharedClassName}
          data-variant={variant}
          {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}
        >
          {content}
        </button>
      )}
    </span>
  );
}
