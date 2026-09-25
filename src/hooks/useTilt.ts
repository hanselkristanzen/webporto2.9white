import { useEffect, useRef } from "react";
import { useReducedMotion } from "./useReducedMotion";
import { useIsTouchDevice } from "./useMediaQuery";

/** Attaches a subtle perspective tilt (--rx/--ry custom properties) driven by pointer position. */
export function useTilt<T extends HTMLElement>(strength = 6) {
  const ref = useRef<T | null>(null);
  const reducedMotion = useReducedMotion();
  const isTouch = useIsTouchDevice();

  useEffect(() => {
    const node = ref.current;
    if (!node || reducedMotion || isTouch) return;

    const handleMove = (event: PointerEvent) => {
      const rect = node.getBoundingClientRect();
      const relX = (event.clientX - rect.left) / rect.width - 0.5;
      const relY = (event.clientY - rect.top) / rect.height - 0.5;
      node.style.setProperty("--rx", `${relX * strength}deg`);
      node.style.setProperty("--ry", `${-relY * strength}deg`);
    };

    const handleLeave = () => {
      node.style.setProperty("--rx", "0deg");
      node.style.setProperty("--ry", "0deg");
    };

    node.addEventListener("pointermove", handleMove);
    node.addEventListener("pointerleave", handleLeave);
    return () => {
      node.removeEventListener("pointermove", handleMove);
      node.removeEventListener("pointerleave", handleLeave);
    };
  }, [reducedMotion, isTouch, strength]);

  return ref;
}
