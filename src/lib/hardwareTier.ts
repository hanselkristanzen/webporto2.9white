/**
 * A best-effort, one-time guess at whether the current device is
 * meaningfully lower-powered than typical modern hardware. Used only to
 * dial back the heaviest purely-visual knob on the WebGL background
 * effects (render resolution) — never to disable, hide, resize, or
 * otherwise change layout or interaction. A false read in either direction
 * just means a slightly softer or sharper backdrop; it never breaks or
 * noticeably redesigns anything.
 *
 * `navigator.hardwareConcurrency` (logical CPU core count) is a rough but
 * genuinely informative signal here: budget and older laptops commonly
 * report 2–4 cores, while typical modern mid-range-and-up hardware
 * reports 8+. When the API is unavailable, this deliberately defaults to
 * `false` (full quality) rather than guessing — we only ever *reduce*
 * quality on a positive, verifiable low-power signal.
 */
export const isLowPowerDevice: boolean = (() => {
  if (typeof navigator === "undefined") return false;
  const cores = navigator.hardwareConcurrency;
  return typeof cores === "number" && cores > 0 && cores <= 4;
})();
