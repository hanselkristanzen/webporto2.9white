import {
  forwardRef,
  useMemo,
  useRef,
  useEffect,
  useCallback,
  type CSSProperties,
  type MouseEventHandler,
  type RefObject,
} from "react";
import { motion } from "motion/react";
import { rafThrottle } from "../../lib/rafThrottle";
import { isDocumentVisible } from "../../lib/documentVisibility";
import "./VariableProximity.css";

function useAnimationFrame(callback: () => void) {
  useEffect(() => {
    let frameId: number;

    const loop = () => {
      callback();
      frameId = requestAnimationFrame(loop);
    };

    frameId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frameId);
  }, [callback]);
}

/*
  PERFORMANCE: raw pointer position is tracked once, at module scope, and
  shared by every mounted VariableProximity instance — rather than each
  instance attaching its own window-level mousemove/touchmove listener.
  The page can have several instances at once (e.g. two Hero words plus the
  Contact heading), and they all just want the same raw cursor position;
  running N identical listeners to compute the same thing is pure waste.
  Each instance still converts this shared, page-relative position into its
  own container-relative coordinates independently (in `tick`, below),
  since different instances can have different containers.

  `sharedPointerVersion` is a second layer on top of that: every mounted
  instance's `tick()` used to call `getBoundingClientRect()` on its own
  container (and on every one of its letters) on *every single animation
  frame, forever* — even while the mouse sits perfectly still, which is the
  overwhelming majority of the time a page is open. The version counter
  lets `tick()` bail out before doing any of that work when nothing that
  could affect the result has actually changed. It's bumped on pointer
  move (the obvious case) and also on scroll/resize, since either of those
  changes a container's position on screen relative to a stationary
  pointer — this preserves the exact same "reacts to viewport-relative
  position" behavior as the unthrottled version, it just skips the
  recomputation on frames where genuinely nothing moved.
*/
const sharedPointer = { x: 0, y: 0 };
let sharedPointerVersion = 0;
let sharedPointerSubscribers = 0;

const bumpSharedVersion = () => {
  sharedPointerVersion += 1;
};

const handleSharedMouseMove = (ev: MouseEvent) => {
  sharedPointer.x = ev.clientX;
  sharedPointer.y = ev.clientY;
  bumpSharedVersion();
};

const handleSharedTouchMove = (ev: TouchEvent) => {
  const touch = ev.touches[0];
  if (!touch) return;
  sharedPointer.x = touch.clientX;
  sharedPointer.y = touch.clientY;
  bumpSharedVersion();
};

const handleSharedScrollOrResize = rafThrottle(bumpSharedVersion);

function useSharedPointerTracking() {
  useEffect(() => {
    sharedPointerSubscribers += 1;
    if (sharedPointerSubscribers === 1) {
      window.addEventListener("mousemove", handleSharedMouseMove, { passive: true });
      window.addEventListener("touchmove", handleSharedTouchMove, { passive: true });
      window.addEventListener("scroll", handleSharedScrollOrResize, { passive: true });
      window.addEventListener("resize", handleSharedScrollOrResize, { passive: true });
    }
    return () => {
      sharedPointerSubscribers -= 1;
      if (sharedPointerSubscribers === 0) {
        window.removeEventListener("mousemove", handleSharedMouseMove);
        window.removeEventListener("touchmove", handleSharedTouchMove);
        window.removeEventListener("scroll", handleSharedScrollOrResize);
        window.removeEventListener("resize", handleSharedScrollOrResize);
        handleSharedScrollOrResize.cancel();
      }
    };
  }, []);
}

export interface VariableProximityProps {
  label: string;
  fromFontVariationSettings: string;
  toFontVariationSettings: string;
  containerRef: RefObject<HTMLElement | null>;
  radius?: number;
  falloff?: "linear" | "exponential" | "gaussian";
  className?: string;
  onClick?: MouseEventHandler<HTMLSpanElement>;
  style?: CSSProperties;
}

const VariableProximity = forwardRef<HTMLSpanElement, VariableProximityProps>((props, ref) => {
  const {
    label,
    fromFontVariationSettings,
    toFontVariationSettings,
    containerRef,
    radius = 50,
    falloff = "linear",
    className = "",
    onClick,
    style,
  } = props;

  const letterRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const interpolatedSettingsRef = useRef<string[]>([]);
  const processedVersionRef = useRef(-1);
  useSharedPointerTracking();

  const parsedSettings = useMemo(() => {
    const parseSettings = (settingsStr: string) =>
      new Map(
        settingsStr
          .split(",")
          .map((s) => s.trim())
          .map((s) => {
            const [name, value] = s.split(" ");
            return [name.replace(/['"]/g, ""), parseFloat(value)] as [string, number];
          })
      );

    const fromSettings = parseSettings(fromFontVariationSettings);
    const toSettings = parseSettings(toFontVariationSettings);

    return Array.from(fromSettings.entries()).map(([axis, fromValue]) => ({
      axis,
      fromValue,
      toValue: toSettings.get(axis) ?? fromValue,
    }));
  }, [fromFontVariationSettings, toFontVariationSettings]);

  const calculateDistance = (x1: number, y1: number, x2: number, y2: number) =>
    Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);

  const calculateFalloff = useCallback(
    (distance: number) => {
      const norm = Math.min(Math.max(1 - distance / radius, 0), 1);
      switch (falloff) {
        case "exponential":
          return norm ** 2;
        case "gaussian":
          return Math.exp(-((distance / (radius / 2)) ** 2) / 2);
        case "linear":
        default:
          return norm;
      }
    },
    [radius, falloff]
  );

  const tick = useCallback(() => {
    if (!containerRef?.current || !isDocumentVisible()) return;
    // Nothing that could change the result has happened since the last
    // frame we actually processed — skip every rect read below entirely.
    if (processedVersionRef.current === sharedPointerVersion) return;
    processedVersionRef.current = sharedPointerVersion;

    const containerRect = containerRef.current.getBoundingClientRect();
    const x = sharedPointer.x - containerRect.left;
    const y = sharedPointer.y - containerRect.top;

    letterRefs.current.forEach((letterRef, index) => {
      if (!letterRef) return;

      const rect = letterRef.getBoundingClientRect();
      const letterCenterX = rect.left + rect.width / 2 - containerRect.left;
      const letterCenterY = rect.top + rect.height / 2 - containerRect.top;

      const distance = calculateDistance(x, y, letterCenterX, letterCenterY);

      if (distance >= radius) {
        letterRef.style.fontVariationSettings = fromFontVariationSettings;
        return;
      }

      const falloffValue = calculateFalloff(distance);
      const newSettings = parsedSettings
        .map(({ axis, fromValue, toValue }) => {
          const interpolatedValue = fromValue + (toValue - fromValue) * falloffValue;
          return `'${axis}' ${interpolatedValue}`;
        })
        .join(", ");

      interpolatedSettingsRef.current[index] = newSettings;
      letterRef.style.fontVariationSettings = newSettings;
    });
  }, [containerRef, radius, fromFontVariationSettings, parsedSettings, calculateFalloff]);

  useAnimationFrame(tick);

  const words = label.split(" ");
  let letterIndex = 0;

  return (
    <span
      ref={ref}
      className={`${className} variable-proximity`}
      onClick={onClick}
      style={{ display: "inline", ...style }}
    >
      {words.map((word, wordIndex) => (
        <span key={wordIndex} style={{ display: "inline-block", whiteSpace: "nowrap" }}>
          {word.split("").map((letter) => {
            const currentLetterIndex = letterIndex++;
            return (
              <motion.span
                key={currentLetterIndex}
                ref={(el) => {
                  letterRefs.current[currentLetterIndex] = el;
                }}
                style={{
                  display: "inline-block",
                  fontVariationSettings: interpolatedSettingsRef.current[currentLetterIndex],
                }}
                aria-hidden="true"
              >
                {letter}
              </motion.span>
            );
          })}
          {wordIndex < words.length - 1 && <span style={{ display: "inline-block" }}>&nbsp;</span>}
        </span>
      ))}

      <span className="sr-only">{label}</span>
    </span>
  );
});

VariableProximity.displayName = "VariableProximity";

export default VariableProximity;
