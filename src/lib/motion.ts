/**
 * Motion tokens mirrored from styles/tokens.css so GSAP timelines and
 * CSS transitions always agree on rhythm. Durations are in seconds
 * (GSAP's unit); the CSS custom properties use ms for the same values.
 */
export const duration = {
  fast: 0.15,
  normal: 0.3,
  slow: 0.6,
  cinematic: 1.1,
} as const;

/** cubic-bezier eases as GSAP-compatible arrays / strings. */
export const ease = {
  out: "cubic-bezier(0.16, 1, 0.3, 1)",
  inOut: "cubic-bezier(0.65, 0, 0.35, 1)",
  signal: "cubic-bezier(0.22, 0.61, 0.36, 1)",
} as const;

/** Standard stagger step used across list/grid reveal animations. */
export const stagger = {
  tight: 0.05,
  normal: 0.08,
  loose: 0.14,
} as const;
