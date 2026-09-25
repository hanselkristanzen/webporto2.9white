import { useEffect, useRef, useState } from "react";
import Particles from "./Particles";
import { LatticeFallback } from "./LatticeFallback";
import { CanvasErrorBoundary } from "./CanvasErrorBoundary";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import { useTheme } from "../../lib/ThemeContext";
import { isLowPowerDevice } from "../../lib/hardwareTier";

function detectWebGL(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(
      window.WebGLRenderingContext &&
        (canvas.getContext("webgl2") || canvas.getContext("webgl"))
    );
  } catch {
    return false;
  }
}

// The hero's own palette — warm cream in a few brightnesses (dimmer entries
// read as "further away") with one rare amber accent, matching the site's
// single signal colour (see tokens.css). Entries are repeated to weight them.
// Module-level constants, so their references are stable across renders.
const DARK_PALETTE = [
  "#f6f3ec",
  "#d8d3c4",
  "#b9b3a2",
  "#9c9686",
  "#d8d3c4",
  "#c9c3b0",
  "#b9b3a2",
  "#e8b84b",
];
// The hero is dark in both themes, so the light theme only nudges it: a touch
// dimmer and warmer, the same subtlety the previous backdrop used.
const LIGHT_PALETTE = [
  "#efe9db",
  "#cfc8b5",
  "#b0aa98",
  "#948e7e",
  "#cfc8b5",
  "#c0baa6",
  "#b0aa98",
  "#dcae43",
];

export function HeroCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);
  const [hasBeenVisible, setHasBeenVisible] = useState(false);
  const reducedMotion = useReducedMotion();
  const isTablet = useMediaQuery("(max-width: 1024px)");
  const isMobile = useMediaQuery("(max-width: 640px)");
  const [webglOk] = useState<boolean>(() => detectWebGL());
  // Render resolution, decided once: capped at 1.5x (1x on low-power devices).
  const [pixelRatio] = useState<number>(() =>
    Math.min(window.devicePixelRatio || 1, isLowPowerDevice ? 1 : 1.5)
  );
  const { theme } = useTheme();

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { rootMargin: "35% 0px 35% 0px", threshold: 0 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  // PERFORMANCE: the particle scene is mounted once, the first time the hero
  // is actually visible, and stays mounted from then on; `active={visible}`
  // cancels its render loop (no GPU work, no per-frame wakeups) while the
  // hero is off-screen without tearing anything down, so scrolling back up
  // costs no fresh WebGL context or shader compile.
  useEffect(() => {
    if (visible) setHasBeenVisible(true);
  }, [visible]);

  // The hero is always a dark, cinematic section by design (matches the
  // reference screenshots) — the global light/dark toggle intentionally
  // doesn't invert it. It still participates subtly in the theme system
  // (TASK 27), via a small palette shift rather than a full repaint. The
  // palette is applied in place, so toggling the theme never rebuilds the
  // WebGL scene.
  const particleColors = theme === "dark" ? DARK_PALETTE : LIGHT_PALETTE;
  const particleCount = isMobile ? 120 : isTablet ? 160 : 210;

  const shouldRenderParticles = !reducedMotion && webglOk;

  return (
    <div ref={containerRef} style={{ width: "100%", height: "100%" }}>
      {shouldRenderParticles && hasBeenVisible ? (
        <CanvasErrorBoundary fallback={<LatticeFallback />}>
          <Particles
            particleCount={particleCount}
            particleSpread={10}
            speed={0.1}
            particleColors={particleColors}
            moveParticlesOnHover={false}
            alphaParticles
            particleBaseSize={5}
            sizeRandomness={0}
            cameraDistance={40}
            pixelRatio={pixelRatio}
            active={visible}
          />
        </CanvasErrorBoundary>
      ) : (
        <LatticeFallback />
      )}
    </div>
  );
}
